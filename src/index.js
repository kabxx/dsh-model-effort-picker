'use strict';

export const name = 'model-effort-picker';

function routeKey(route) {
  return JSON.stringify([route.provider, route.model]);
}

function needsRepair(selection, capability) {
  if (!selection || !capability) return false;
  if (capability.kind === 'single') return selection.reasoningEffort === undefined;
  if (capability.kind === 'none') return selection.reasoningEffort !== undefined;
  return false;
}

export function apply(ctx) {
  ctx.inject(['agents', 'llm'], (hostCtx) => {
    const capabilities = new Map();
    const providerGenerations = new Map();
    const disposedAgents = new WeakSet();
    const maxResolveAttempts = 4;
    let globalGeneration = 0;
    let disposed = false;

    function routeGeneration(provider) {
      return `${globalGeneration}:${providerGenerations.get(provider) ?? 0}`;
    }

    function clearCache() {
      globalGeneration += 1;
      providerGenerations.clear();
      capabilities.clear();
      warmDefault();
    }

    function clearProvider(provider) {
      if (typeof provider !== 'string' || !provider) {
        clearCache();
        return;
      }
      providerGenerations.set(provider, (providerGenerations.get(provider) ?? 0) + 1);
      for (const key of [...capabilities.keys()]) {
        try {
          const [cachedProvider] = JSON.parse(key);
          if (cachedProvider === provider) capabilities.delete(key);
        } catch {
          capabilities.delete(key);
        }
      }
      warmDefault();
    }

    async function resolveCapability(route, signal) {
      const key = routeKey(route);
      for (let attempt = 0; attempt < maxResolveAttempts; attempt += 1) {
        if (disposed || signal?.aborted) return null;
        const generation = routeGeneration(route.provider);
        if (capabilities.has(key)) {
          return { capability: capabilities.get(key), generation };
        }
        const info = await hostCtx.llm.resolveModelInfo(route.provider, route.model, signal);
        if (disposed || signal?.aborted) return null;
        const efforts = info?.reasoning?.efforts ?? [];
        const capability = efforts.length === 0
          ? { kind: 'none' }
          : efforts.length === 1
            ? { kind: 'single', effort: efforts[0].id }
            : { kind: 'multi' };
        if (generation === routeGeneration(route.provider)) {
          capabilities.set(key, capability);
          return { capability, generation };
        }
        // Catalog changed while resolving; retry against the latest generation instead of returning stale capabilities.
      }
      return null;
    }

    function warmDefault() {
      if (disposed) return;
      const defaults = hostCtx.get?.('agentDefaultModel');
      if (!defaults || typeof defaults.currentSelection !== 'function') return;
      const selection = defaults.currentSelection();
      if (!selection?.provider || !selection?.model) return;
      void resolveCapability(selection).catch(() => {});
    }

    function applyRepair(agent, expected, capability, generation) {
      if (disposed || disposedAgents.has(agent)) return false;
      if (routeGeneration(expected.provider) !== generation) return false;
      const latest = agent?.model?.current?.();
      if (!latest || latest.provider !== expected.provider || latest.model !== expected.model) return false;
      if (!needsRepair(latest, capability)) return false;
      if (capability.kind === 'single') {
        if (typeof capability.effort !== 'string' || capability.effort.length === 0) return false;
        agent.model.select({
          provider: latest.provider,
          model: latest.model,
          reasoningEffort: capability.effort,
        });
        return true;
      }
      if (capability.kind === 'none') {
        agent.model.select({
          provider: latest.provider,
          model: latest.model,
        });
        return true;
      }
      return false;
    }

    hostCtx.on('llm/adapters-updated', clearCache);
    hostCtx.on('llm/models-updated', clearProvider);
    hostCtx.on('app-boot/config-reload', warmDefault);
    hostCtx.on('settings/document-updated', warmDefault);
    hostCtx.on('agent/disposed', ({ agent }) => {
      if (agent) disposedAgents.add(agent);
    });

    hostCtx.on('agent/created', async ({ agent, source, signal }) => {
      if (agent?.session?.header?.origin === 'subagent' || disposedAgents.has(agent)) return;
      const initial = agent?.model?.current?.();
      if (!initial) return;
      // Preserve fresh blank sessions' ability to float with default-model changes
      // and never block startup creation waiting for cold catalog queries.
      if (source === 'startup' && agent.session?.header?.isSeeded !== true) {
        if (!capabilities.has(routeKey(initial))) {
          void resolveCapability(initial).catch(() => {});
        }
        return;
      }
      for (let attempt = 0; attempt < maxResolveAttempts; attempt += 1) {
        if (disposed || signal?.aborted || disposedAgents.has(agent)) return;
        const current = agent?.model?.current?.();
        if (!current) return;
        const key = routeKey(current);
        const cached = capabilities.get(key);
        if (cached) {
          if (needsRepair(current, cached)) {
            try {
              applyRepair(agent, current, cached, routeGeneration(current.provider));
            } catch (error) {
              hostCtx.logger?.warn?.(
                `model-effort-picker: failed to normalize model selection on session "${agent.id}": ${String(error)}`,
              );
            }
          }
          return;
        }
        let resolved;
        try {
          resolved = await resolveCapability(current, signal);
        } catch (error) {
          hostCtx.logger?.warn?.(
            `model-effort-picker: skipped model selection repair for ${current.provider}/${current.model}: ${String(error)}`,
          );
          return;
        }
        if (!resolved || disposed || signal?.aborted || disposedAgents.has(agent)) return;
        if (routeGeneration(current.provider) !== resolved.generation) continue;
        if (needsRepair(current, resolved.capability)) {
          try {
            applyRepair(agent, current, resolved.capability, resolved.generation);
          } catch (error) {
            hostCtx.logger?.warn?.(
              `model-effort-picker: failed to normalize model selection on session "${agent.id}": ${String(error)}`,
            );
          }
        }
        return;
      }
    });

    hostCtx.on('agent/inbox/inserted', ({ agent }) => {
      if (agent?.session?.header?.origin === 'subagent' || disposedAgents.has(agent)) return;
      const current = agent?.model?.current?.();
      if (!current) return;
      const key = routeKey(current);
      const cached = capabilities.get(key);
      if (cached) {
        if (needsRepair(current, cached)) {
          try {
            applyRepair(agent, current, cached, routeGeneration(current.provider));
          } catch (error) {
            hostCtx.logger?.warn?.(
              `model-effort-picker: failed to normalize model selection before turn on session "${agent.id}": ${String(error)}`,
            );
          }
        }
        return;
      }
      void resolveCapability(current).then((resolved) => {
        if (!resolved || disposed || disposedAgents.has(agent)) return;
        if (!needsRepair(current, resolved.capability)) return;
        try {
          applyRepair(agent, current, resolved.capability, resolved.generation);
        } catch (error) {
          hostCtx.logger?.warn?.(
            `model-effort-picker: failed to normalize model selection on session "${agent.id}": ${String(error)}`,
          );
        }
      }).catch(() => {});
    });

    if (typeof hostCtx.effect === 'function') {
      hostCtx.effect(() => () => {
        disposed = true;
        capabilities.clear();
        providerGenerations.clear();
      });
    }

    if (typeof hostCtx.inject === 'function') {
      hostCtx.inject(['agentDefaultModel'], () => {
        warmDefault();
      });
    }
    warmDefault();
  });
}
