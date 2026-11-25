window.__ModuleLoader__.load({
  id: '@kabxx/dsh-model-effort-picker',
  factory(require) {
    'use strict';

    const React = require('react');
    const { createPortal } = require('react-dom');
    const {
      createElement: h,
      useCallback,
      useEffect,
      useId,
      useLayoutEffect,
      useMemo,
      useRef,
      useState,
      useSyncExternalStore,
    } = React;

    const namespace = 'model-effort-picker';
    const styleId = '@kabxx/dsh-model-effort-picker/ModelSelect.css';
    const modelSlot = 'conversation.input.model';
    const selectAction = 'session/selectModel';
    const menuRowsSelector = 'button[role="menuitem"]:not([disabled]), button[role="menuitemradio"]:not([disabled]), button[role="switch"]:not([disabled]), button.mep-retry:not([disabled])';

    const dictionaries = {
      zh: {
        'provider.account': 'DeepSeek 账号',
        'command.label': '模型',
        'command.description': '选择本会话使用的模型',
        'option.loadError': '目录加载失败：{message}',
        'trigger.fallback': '请选择模型',
        'trigger.loading': '正在加载模型…',
        'trigger.selectAria': '请选择模型',
        'trigger.aria': '选择模型，当前 {model}',
        'trigger.ariaEffort': '选择模型，当前 {model}，推理等级 {effort}',
        'trigger.ariaUnset': '选择模型，当前 {model}，推理等级未选择',
        'menu.aria': '模型与推理等级',
        'menu.model': '模型',
        'menu.effort': '推理等级',
        'effort.unset': '未选择',
        'status.loading': '正在刷新模型列表…',
        'error.action': '模型操作失败：{message}',
        'error.denied': '当前会话无法切换模型。',
        'error.busy': '正在保存模型选择…',
        'error.unavailable': '模型或推理等级已不可用，请重新选择。',
        'error.sessionInUse': '当前会话已被占用，可能是其他正在运行的 DSH 导致的（如其他 dsh web、桌面端），请退出其他正在运行的 DSH 后重试。',
        'action.reload': '重新加载',
        'retry': '重试',
        'warning.groupLoad': '{name} 加载失败：{message}',
        'search.placeholder': '搜索模型…',
        'search.effortPlaceholder': '搜索推理等级…',
        'search.clear': '清除搜索',
        'search.empty': '没有匹配的模型。',
        'search.effortEmpty': '没有匹配的推理等级。',
        'empty.models': '暂无可用模型',
        'empty.efforts': '当前模型未提供推理等级。',
      },
      en: {
        'provider.account': 'DeepSeek Account',
        'command.label': 'Model',
        'command.description': 'Select the model for this conversation',
        'option.loadError': 'Catalog failed to load: {message}',
        'trigger.fallback': 'Select model',
        'trigger.loading': 'Loading models…',
        'trigger.selectAria': 'Select model',
        'trigger.aria': 'Select model, current {model}',
        'trigger.ariaEffort': 'Select model, current {model}, reasoning effort {effort}',
        'trigger.ariaUnset': 'Select model, current {model}, reasoning effort not selected',
        'menu.aria': 'Model and reasoning effort',
        'menu.model': 'Model',
        'menu.effort': 'Effort',
        'effort.unset': 'Not selected',
        'status.loading': 'Refreshing model list…',
        'error.action': 'Model operation failed: {message}',
        'error.denied': 'Model selection is unavailable in this conversation.',
        'error.busy': 'Saving model selection…',
        'error.unavailable': 'This model or reasoning effort is no longer available. Choose another option.',
        'error.sessionInUse': 'This session is already in use, possibly by another running DSH instance (such as dsh web or the desktop app). Quit other running DSH instances and try again.',
        'action.reload': 'Reload',
        'retry': 'Retry',
        'warning.groupLoad': '{name} failed to load: {message}',
        'search.placeholder': 'Search models…',
        'search.effortPlaceholder': 'Search reasoning efforts…',
        'search.clear': 'Clear search',
        'search.empty': 'No matching models.',
        'search.effortEmpty': 'No matching reasoning efforts.',
        'empty.models': 'No models available.',
        'empty.efforts': 'This model provides no reasoning effort levels.',
      },
      ja: {
        'provider.account': 'DeepSeek アカウント',
        'command.label': 'モデル',
        'command.description': 'この会話で使用するモデルを選択',
        'option.loadError': 'カタログの読み込みに失敗しました: {message}',
        'trigger.fallback': 'モデルを選択',
        'trigger.loading': 'モデルを読み込み中…',
        'trigger.selectAria': 'モデルを選択',
        'trigger.aria': 'モデルを選択、現在 {model}',
        'trigger.ariaEffort': 'モデルを選択、現在 {model}、推論強度 {effort}',
        'trigger.ariaUnset': 'モデルを選択、現在 {model}、推論強度未選択',
        'menu.aria': 'モデルと推論強度',
        'menu.model': 'モデル',
        'menu.effort': '強度',
        'effort.unset': '未選択',
        'status.loading': 'モデル一覧を更新中…',
        'error.action': 'モデル操作に失敗しました: {message}',
        'error.denied': 'この会話ではモデルを切り替えられません。',
        'error.busy': 'モデル選択を保存中…',
        'error.unavailable': 'このモデルまたは推論強度は利用できません。別の項目を選択してください。',
        'error.sessionInUse': 'このセッションは既に使用中です。別の DSH インスタンス（dsh web やデスクトップアプリなど）が実行中の可能性があります。他の DSH インスタンスを終了してから再試行してください。',
        'action.reload': '再読み込み',
        'retry': '再試行',
        'warning.groupLoad': '{name} の読み込みに失敗しました: {message}',
        'search.placeholder': 'モデルを検索…',
        'search.effortPlaceholder': '推論強度を検索…',
        'search.clear': '検索をクリア',
        'search.empty': '一致するモデルがありません。',
        'search.effortEmpty': '一致する推論強度がありません。',
        'empty.models': '利用可能なモデルがありません。',
        'empty.efforts': 'このモデルには推論強度の設定がありません。',
      },
      es: {
        'provider.account': 'Cuenta DeepSeek',
        'command.label': 'Modelo',
        'command.description': 'Selecciona el modelo para esta conversación',
        'option.loadError': 'No se pudo cargar el catálogo: {message}',
        'trigger.fallback': 'Seleccionar modelo',
        'trigger.loading': 'Cargando modelos…',
        'trigger.selectAria': 'Seleccionar modelo',
        'trigger.aria': 'Seleccionar modelo, actual {model}',
        'trigger.ariaEffort': 'Seleccionar modelo, actual {model}, esfuerzo de razonamiento {effort}',
        'trigger.ariaUnset': 'Seleccionar modelo, actual {model}, esfuerzo de razonamiento sin seleccionar',
        'menu.aria': 'Modelo y esfuerzo de razonamiento',
        'menu.model': 'Modelo',
        'menu.effort': 'Esfuerzo',
        'effort.unset': 'Sin seleccionar',
        'status.loading': 'Actualizando lista de modelos…',
        'error.action': 'Error en la operación del modelo: {message}',
        'error.denied': 'No se puede cambiar de modelo en esta conversación.',
        'error.busy': 'Guardando selección de modelo…',
        'error.unavailable': 'Este modelo o esfuerzo de razonamiento ya no está disponible. Elige otra opción.',
        'error.sessionInUse': 'Esta sesión ya está en uso, posiblemente por otra instancia de DSH en ejecución (como dsh web o la aplicación de escritorio). Salga de otras instancias de DSH en ejecución y vuelva a intentarlo.',
        'action.reload': 'Recargar',
        'retry': 'Reintentar',
        'warning.groupLoad': '{name} no pudo cargar: {message}',
        'search.placeholder': 'Buscar modelos…',
        'search.effortPlaceholder': 'Buscar esfuerzos de razonamiento…',
        'search.clear': 'Borrar búsqueda',
        'search.empty': 'No hay modelos coincidentes.',
        'search.effortEmpty': 'No hay esfuerzos de razonamiento coincidentes.',
        'empty.models': 'No hay modelos disponibles.',
        'empty.efforts': 'Este modelo no proporciona niveles de esfuerzo de razonamiento.',
      },
      fr: {
        'provider.account': 'Compte DeepSeek',
        'command.label': 'Modèle',
        'command.description': 'Sélectionnez le modèle pour cette conversation',
        'option.loadError': 'Échec du chargement du catalogue : {message}',
        'trigger.fallback': 'Sélectionnez le modèle',
        'trigger.loading': 'Chargement des modèles…',
        'trigger.selectAria': 'Sélectionnez le modèle',
        'trigger.aria': 'Sélectionnez le modèle, actuel {model}',
        'trigger.ariaEffort': 'Sélectionnez le modèle, actuel {model}, effort de raisonnement {effort}',
        'trigger.ariaUnset': 'Sélectionnez le modèle, actuel {model}, effort de raisonnement non sélectionné',
        'menu.aria': 'Modèle et effort de raisonnement',
        'menu.model': 'Modèle',
        'menu.effort': 'Effort',
        'effort.unset': 'Non sélectionné',
        'status.loading': 'Actualisation de la liste des modèles…',
        'error.action': "Échec de l'opération du modèle : {message}",
        'error.denied': 'La sélection de modèle est indisponible dans cette conversation.',
        'error.busy': 'Enregistrement de la sélection du modèle…',
        'error.unavailable': 'Ce modèle ou ce niveau d’effort n’est plus disponible. Choisissez une autre option.',
        'error.sessionInUse': "Cette session est déjà utilisée, éventuellement par une autre instance DSH en cours d'exécution (telle que dsh web ou l'application de bureau). Quittez les autres instances DSH en cours d'exécution et réessayez.",
        'action.reload': 'Recharger',
        'retry': 'Réessayer',
        'warning.groupLoad': 'Échec du chargement de {name} : {message}',
        'search.placeholder': 'Rechercher des modèles…',
        'search.effortPlaceholder': 'Rechercher des niveaux d’effort…',
        'search.clear': 'Effacer la recherche',
        'search.empty': 'Aucun modèle correspondant.',
        'search.effortEmpty': 'Aucun niveau d’effort correspondant.',
        'empty.models': 'Aucun modèle disponible.',
        'empty.efforts': 'Ce modèle ne fournit aucun niveau d’effort de raisonnement.',
      },
      de: {
        'provider.account': 'DeepSeek-Konto',
        'command.label': 'Modell',
        'command.description': 'Wählen Sie das Modell für dieses Gespräch aus',
        'option.loadError': 'Katalog konnte nicht geladen werden: {message}',
        'trigger.fallback': 'Modell auswählen',
        'trigger.loading': 'Modelle werden geladen…',
        'trigger.selectAria': 'Modell auswählen',
        'trigger.aria': 'Modell auswählen, aktuell {model}',
        'trigger.ariaEffort': 'Modell auswählen, aktuell {model}, Argumentationsaufwand {effort}',
        'trigger.ariaUnset': 'Modell auswählen, aktuell {model}, Argumentationsaufwand nicht ausgewählt',
        'menu.aria': 'Modell- und Argumentationsaufwand',
        'menu.model': 'Modell',
        'menu.effort': 'Aufwand',
        'effort.unset': 'Nicht ausgewählt',
        'status.loading': 'Modellliste wird aktualisiert…',
        'error.action': 'Modellvorgang fehlgeschlagen: {message}',
        'error.denied': 'Die Modellauswahl ist in diesem Gespräch nicht verfügbar.',
        'error.busy': 'Modellauswahl wird gespeichert…',
        'error.unavailable': 'Dieses Modell oder dieser Aufwand ist nicht mehr verfügbar. Wählen Sie eine andere Option.',
        'error.sessionInUse': 'Diese Sitzung wird bereits verwendet, möglicherweise von einer anderen laufenden DSH-Instanz (z. B. dsh web oder der Desktop-App). Beenden Sie andere laufende DSH-Instanzen und versuchen Sie es erneut.',
        'action.reload': 'Neu laden',
        'retry': 'Erneut versuchen',
        'warning.groupLoad': '{name} konnte nicht geladen werden: {message}',
        'search.placeholder': 'Modelle suchen…',
        'search.effortPlaceholder': 'Aufwandsstufen suchen…',
        'search.clear': 'Suche löschen',
        'search.empty': 'Keine passenden Modelle.',
        'search.effortEmpty': 'Keine passenden Aufwandsstufen.',
        'empty.models': 'Keine Modelle verfügbar.',
        'empty.efforts': 'Dieses Modell liefert keine Argumentationsaufwandsstufen.',
      },
      ru: {
        'provider.account': 'DeepSeek Аккаунт',
        'command.label': 'Модель',
        'command.description': 'Выберите модель для этого разговора',
        'option.loadError': 'Не удалось загрузить каталог: {message}.',
        'trigger.fallback': 'Выберите модель',
        'trigger.loading': 'Загрузка моделей…',
        'trigger.selectAria': 'Выберите модель',
        'trigger.aria': 'Выберите модель, текущая {model}',
        'trigger.ariaEffort': 'Выберите модель, текущая {model}, уровень рассуждения {effort}',
        'trigger.ariaUnset': 'Выберите модель, текущая {model}, уровень рассуждения не выбран',
        'menu.aria': 'Модель и уровень рассуждения',
        'menu.model': 'Модель',
        'menu.effort': 'Усилие',
        'effort.unset': 'Не выбрано',
        'status.loading': 'Обновление списка моделей…',
        'error.action': 'Не удалось выполнить операцию модели: {message}.',
        'error.denied': 'Выбор модели недоступен в этой беседе.',
        'error.busy': 'Сохранение выбора модели…',
        'error.unavailable': 'Эта модель или уровень рассуждения больше недоступны. Выберите другой вариант.',
        'error.sessionInUse': 'Этот сеанс уже используется, возможно, другим работающим экземпляром DSH (например, dsh web или настольным приложением). Закройте другие работающие экземпляры DSH и повторите попытку.',
        'action.reload': 'Перезагрузить',
        'retry': 'Повторить',
        'warning.groupLoad': '{name} не удалось загрузить: {message}',
        'search.placeholder': 'Поиск моделей…',
        'search.effortPlaceholder': 'Поиск уровней рассуждения…',
        'search.clear': 'Очистить поиск',
        'search.empty': 'Нет подходящих моделей.',
        'search.effortEmpty': 'Нет подходящих уровней рассуждения.',
        'empty.models': 'Нет доступных моделей.',
        'empty.efforts': 'Эта модель не предоставляет уровней рассуждения.',
      },
      pt: {
        'provider.account': 'DeepSeek Conta',
        'command.label': 'Modelo',
        'command.description': 'Selecione o modelo para esta conversa',
        'option.loadError': 'Falha ao carregar o catálogo: {message}',
        'trigger.fallback': 'Selecione o modelo',
        'trigger.loading': 'Carregando modelos…',
        'trigger.selectAria': 'Selecione o modelo',
        'trigger.aria': 'Selecione o modelo, atual {model}',
        'trigger.ariaEffort': 'Selecione o modelo, atual {model}, esforço de raciocínio {effort}',
        'trigger.ariaUnset': 'Selecione o modelo, atual {model}, esforço de raciocínio não selecionado',
        'menu.aria': 'Modelo e esforço de raciocínio',
        'menu.model': 'Modelo',
        'menu.effort': 'Esforço',
        'effort.unset': 'Não selecionado',
        'status.loading': 'Atualizando lista de modelos…',
        'error.action': 'Falha na operação do modelo: {message}',
        'error.denied': 'A seleção de modelo não está disponível nesta conversa.',
        'error.busy': 'Salvando seleção de modelo…',
        'error.unavailable': 'Este modelo ou esforço de raciocínio não está mais disponível. Escolha outra opção.',
        'error.sessionInUse': 'Esta sessão já está em uso, possivelmente por outra instância DSH em execução (como dsh web ou aplicativo de desktop). Saia de outras instâncias DSH em execução e tente novamente.',
        'action.reload': 'Recarregar',
        'retry': 'Tentar novamente',
        'warning.groupLoad': '{name} falhou ao carregar: {message}',
        'search.placeholder': 'Pesquisar modelos…',
        'search.effortPlaceholder': 'Pesquisar esforços de raciocínio…',
        'search.clear': 'Limpar pesquisa',
        'search.empty': 'Não há modelos correspondentes.',
        'search.effortEmpty': 'Não há esforços de raciocínio correspondentes.',
        'empty.models': 'Nenhum modelo disponível.',
        'empty.efforts': 'Este modelo não fornece níveis de esforço de raciocínio.',
      },
    };

    class PickerError extends Error {
      constructor(message, { code, key, rawMessage } = {}) {
        super(message);
        this.name = 'PickerError';
        this.code = code;
        this.key = key;
        this.rawMessage = rawMessage;
      }
    }

    function createStore(snapshot) {
      const listeners = new Set();
      return {
        getSnapshot: () => snapshot,
        subscribe(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        set(value) {
          snapshot = value;
          for (const listener of [...listeners]) listener();
        },
      };
    }

    const messageOf = error => error instanceof Error ? error.message : String(error);
    const errorForKey = (key, t) => new PickerError(t(key), { key });
    const errorForRemote = (error, t) => error.code === 'session/writer-held'
      ? new PickerError(t('error.sessionInUse'), { code: error.code, rawMessage: error.message })
      : new PickerError(`${error.code}: ${error.message}`, { code: error.code, rawMessage: error.message });

    function toErrorInfo(error) {
      if (error instanceof PickerError) {
        return { code: error.code, key: error.key, message: error.rawMessage ?? error.message };
      }
      if (error && typeof error === 'object' && typeof error.code === 'string' && typeof error.message === 'string') {
        return { code: error.code, key: undefined, message: error.message };
      }
      return { code: undefined, key: undefined, message: messageOf(error) };
    }

    function formatError(info, t) {
      if (!info) return '';
      if (info.code === 'session/writer-held') return t('error.sessionInUse');
      if (info.key) return t(info.key);
      const detail = info.code ? `${info.code}: ${info.message}` : info.message;
      return t('error.action', { message: detail });
    }

    const routeKey = route => JSON.stringify([route.provider, route.model]);
    const sameRoute = (left, right) => Boolean(left && right && left.provider === right.provider && left.model === right.model);
    const sameSelection = (left, right) => (left == null && right == null)
      || (sameRoute(left, right) && left.reasoningEffort === right.reasoningEffort);
    const providerOrder = id => ['deepseek-account', 'deepseek-official'].indexOf(id) + 1 || 3;
    const providerLabel = (group, t) => group.id === 'deepseek-account' ? t('provider.account') : group.name;
    const effortFor = (choice, id) => choice?.efforts.find(level => level.id === id);

    function boundaryBonus(text, index) {
      return index === 0 || /[\s/._-]/.test(text.charAt(index - 1)) ? 2 : 0;
    }

    function alignScore(candidate, needle) {
      if (needle.length > candidate.length) return undefined;
      const negInf = Number.NEGATIVE_INFINITY;
      let prev = Array(candidate.length).fill(negInf);
      for (let i = 0; i < candidate.length; i += 1) {
        if (candidate.charAt(i) === needle.charAt(0)) prev[i] = 1 + boundaryBonus(candidate, i) - i;
      }
      for (let j = 1; j < needle.length; j += 1) {
        const next = Array(candidate.length).fill(negInf);
        let adjacent = negInf;
        let lagged = negInf;
        let bestGap = negInf;
        for (let i = 0; i < prev.length; i += 1) {
          const score = prev[i];
          if (lagged !== negInf) bestGap = Math.max(bestGap, lagged + i - 2);
          if (candidate.charAt(i) === needle.charAt(j)) {
            const bonus = 1 + boundaryBonus(candidate, i);
            let value = negInf;
            if (adjacent !== negInf) value = adjacent + bonus + 4;
            if (bestGap !== negInf) value = Math.max(value, bestGap + bonus + 1 - i);
            next[i] = value;
          }
          lagged = adjacent;
          adjacent = score;
        }
        prev = next;
      }
      let best = negInf;
      for (const score of prev) best = Math.max(best, score);
      return best === negInf ? undefined : best;
    }

    function rankByName(items, query) {
      const needle = query.trim().toLowerCase();
      if (!needle) return items;
      const matches = [];
      items.forEach((item, index) => {
        const names = item.label === undefined ? [item.name] : [item.name, item.label];
        let prefix = false;
        let score;
        for (const raw of names) {
          const text = raw.toLowerCase();
          const current = alignScore(text, needle);
          if (current !== undefined) {
            if (text.startsWith(needle)) prefix = true;
            score = score === undefined ? current : Math.max(score, current);
          }
        }
        if (score !== undefined) matches.push({ item, index, prefix, score });
      });
      matches.sort((a, b) => Number(b.prefix) - Number(a.prefix) || b.score - a.score || a.index - b.index);
      return matches.map(entry => entry.item);
    }

    function makeCatalog(remote) {
      const state = createStore({ status: 'idle', value: null, error: null, failed: false });
      let generation = 0;
      let inflight;
      let latest;
      function load() {
        const current = state.getSnapshot();
        if (current.status === 'ready' && current.value) return Promise.resolve(current.value);
        if (inflight) return inflight;
        const run = generation;
        const operation = (async () => {
          await Promise.resolve();
          if (run !== generation) return latest ?? load();
          const result = await remote.modelCatalog();
          if (run !== generation) return latest ?? load();
          if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
          const groups = [...result.value.groups].sort((a, b) => providerOrder(a.id) - providerOrder(b.id));
          const routes = new Map();
          for (const group of groups) {
            for (const model of group.models) {
              const route = { provider: group.id, model: model.id };
              routes.set(routeKey(route), { group, model, route, efforts: model.reasoning?.efforts ?? [] });
            }
          }
          // Retain metadata for temporarily failed providers without exposing stale options.
          const previous = state.getSnapshot().value;
          const failed = new Set(result.value.failures.map(failure => failure.id));
          const unavailableRoutes = new Map();
          for (const source of [previous?.unavailableRoutes, previous?.routes]) {
            for (const [id, choice] of source ?? []) {
              if (failed.has(choice.group.id)) unavailableRoutes.set(id, choice);
            }
          }
          const value = { ...result.value, groups, routes, unavailableRoutes };
          if (run !== generation) return latest ?? load();
          state.set({ status: 'ready', value, error: null, failed: false });
          return value;
        })().catch(error => {
          if (run !== generation) return latest ?? load();
          state.set({ ...state.getSnapshot(), status: 'error', error: messageOf(error), failed: true });
          throw error;
        }).finally(() => {
          if (inflight === operation) inflight = undefined;
        });
        inflight = operation;
        latest = operation;
        state.set({ ...current, status: 'loading', error: null });
        return operation;
      }
      function refresh(clear = false) {
        generation += 1;
        inflight = undefined;
        latest = undefined;
        const current = state.getSnapshot();
        state.set({
          status: 'idle',
          value: clear ? null : current.value,
          error: null,
          failed: clear ? false : current.failed,
        });
        return load();
      }
      return { state, load, refresh };
    }

    let pickerSeq = 0;

    class SessionPicker {
      constructor(binding, catalog, blocks, remote, t, conversationT) {
        this.id = ++pickerSeq;
        this.binding = binding;
        this.catalog = catalog;
        this.blocks = blocks;
        this.remote = remote;
        this.t = t;
        this.conversationT = conversationT;
        this.projection = binding.session.projections.faceOf('modelSelection');
        this.planProjection = typeof binding.session.projections?.faceOf === 'function'
          ? binding.session.projections.faceOf('plan')
          : null;
        this.sessionStore = typeof binding.session?.subscribe === 'function' ? binding.session : null;
        this.blockStore = blocks.storeFor(binding.sessionId);
        this.lastProjectedNext = this.projection.getSnapshot()?.next ?? null;
        this.state = createStore(this.snapshot());
        this.unsubscribers = [
          this.projection.subscribe(() => {
            const prevNext = this.lastProjectedNext;
            const next = this.projection.getSnapshot()?.next ?? null;
            if (!sameSelection(next, prevNext)) {
              const ownConfirmation = this.confirmed !== null && sameSelection(next, this.confirmed.selection);
              const settledInitialDefault = prevNext === null && next !== null && this.draft !== null && this.draftBaseline !== null
                && (sameSelection(next, this.draftBaseline)
                  || (sameRoute(next, this.draftBaseline)
                    && this.draftBaseline.reasoningEffort === undefined
                    && this.draftBaselineEffort !== undefined
                    && next.reasoningEffort === this.draftBaselineEffort));
              this.lastProjectedNext = next;
              if (!ownConfirmation && !settledInitialDefault && this.draft !== null) {
                this.draft = null;
                this.draftBaseline = null;
                this.draftBaselineEffort = undefined;
              }
            }
            this.update();
          }),
          catalog.state.subscribe(() => this.update()),
          this.blockStore.subscribe(() => this.syncBlock()),
          ...(this.planProjection ? [this.planProjection.subscribe(() => this.syncBlock())] : []),
          ...(this.sessionStore ? [this.sessionStore.subscribe(() => this.syncBlock())] : []),
        ];
      }

      views = 0;
      writable = false;
      disposed = false;
      draft = null;
      draftBaseline = null;
      draftBaselineEffort = undefined;
      operation = null;
      confirmed = null;
      ownBlock = undefined;
      failureListeners = new Set();

      clearConfirmed() {
        if (!this.confirmed) return;
        clearTimeout(this.confirmed.timer);
        this.confirmed = null;
      }

      setConfirmed(beforeNext, beforeCommitted, selection) {
        this.clearConfirmed();
        const entry = {
          beforeNext,
          beforeCommitted,
          selection,
          timer: setTimeout(() => {
            if (this.confirmed !== entry || this.disposed) return;
            this.confirmed = null;
            this.update();
          }, 2000),
        };
        this.confirmed = entry;
      }

      snapshot() {
        const catalog = this.catalog.state.getSnapshot();
        const projection = this.projection.getSnapshot();
        // Keep a successful RPC confirmation until projection.next either lands
        // with our selection or genuinely diverges from its post-commit baseline.
        if (this.confirmed && projection !== undefined) {
          const projectedNext = projection.next ?? null;
          if (sameSelection(projectedNext, this.confirmed.selection)) {
            this.clearConfirmed();
          } else if (!sameSelection(projectedNext, this.confirmed.beforeNext)) {
            const staleInitialHeader = this.confirmed.beforeNext === null
              && projectedNext !== null
              && sameSelection(projectedNext, projection.lastUsed ?? null)
              && sameRoute(projectedNext, this.confirmed.beforeCommitted);
            if (staleInitialHeader) {
              this.confirmed.beforeNext = projectedNext;
            } else {
              this.clearConfirmed();
            }
          }
        }
        const committed = this.confirmed?.selection ?? projection?.next ?? catalog.value?.default ?? null;
        const selection = this.draft ?? committed;
        const key = selection ? routeKey(selection) : undefined;
        const choice = catalog.value?.routes.get(key);
        const displayChoice = choice ?? catalog.value?.unavailableRoutes.get(key);
        const catalogFailed = catalog.status === 'error' || catalog.failed;
        const implicitSoleEffort = !this.draft
          && !catalogFailed
          && selection?.reasoningEffort === undefined
          && choice?.efforts.length === 1
          ? choice.efforts[0]
          : undefined;
        const effort = this.draft
          ? undefined
          : (effortFor(displayChoice, selection?.reasoningEffort) ?? implicitSoleEffort);
        const staleZeroEffort = Boolean(
          !this.draft
          && choice
          && choice.efforts.length === 0
          && selection?.reasoningEffort !== undefined,
        );
        const unknownEffort = Boolean(selection && catalog.value && !choice && selection.reasoningEffort === undefined);
        const catalogFailedWithoutEffort = Boolean(
          catalogFailed
          && (selection
            ? selection.reasoningEffort === undefined
            : (projection === undefined || projection.next === null || projection.next.reasoningEffort === undefined))
          && this.confirmed?.selection?.reasoningEffort === undefined,
        );
        const needsEffort = this.draft !== null
          || (Boolean(displayChoice?.efforts.length) && !effort)
          || staleZeroEffort
          || unknownEffort
          || catalogFailedWithoutEffort;
        const unavailable = Boolean(
          catalogFailedWithoutEffort
          || staleZeroEffort
          || (selection && catalog.value && (!choice || (this.draft && !choice.efforts.length))),
        );
        const initializing = (!catalog.value && !catalogFailedWithoutEffort)
          || (projection === undefined && !this.confirmed && !catalogFailedWithoutEffort);
        let blockKind = null;
        if (this.draft !== null) {
          blockKind = unavailable ? 'unavailable' : 'chooseEffort';
        } else if (catalogFailedWithoutEffort) {
          blockKind = 'unavailable';
        } else if (!initializing && needsEffort) {
          blockKind = unavailable ? 'unavailable' : 'chooseEffort';
        }
        return {
          catalog,
          committed,
          draft: this.draft,
          selection,
          choice,
          displayChoice,
          effort,
          needsEffort,
          unavailable,
          initializing,
          busy: this.operation !== null,
          pending: this.operation?.selection ?? null,
          writable: this.writable,
          blockKind,
        };
      }

      update() {
        if (this.disposed) return;
        const snapshot = this.snapshot();
        this.state.set(snapshot);
        this.syncBlock();
      }

      onFailure(listener) {
        this.failureListeners.add(listener);
        return () => this.failureListeners.delete(listener);
      }

      reportFailure(error) {
        if (this.disposed) return;
        const info = toErrorInfo(error);
        for (const listener of this.failureListeners) listener(info);
      }

      nativePlaceholder() {
        const session = typeof this.binding.session?.getSnapshot === 'function'
          ? this.binding.session.getSnapshot()
          : undefined;
        const plan = this.planProjection?.getSnapshot();
        const active = Boolean((session && !session.blank && !session.awaitingFirstTurn) || session?.running);
        const hero = Boolean(session && !active && !session.promptAttempted
          && (session.openState === 'open' || session.blank === true));
        const planActive = Boolean(plan && (plan.pending ? !plan.active : plan.active));
        const key = hero ? 'placeholder.hero' : planActive ? 'placeholder.plan' : 'placeholder.default';
        const text = typeof this.conversationT === 'function' ? this.conversationT(key) : '';
        return text && text !== key ? text : ' ';
      }

      syncBlock() {
        if (this.disposed) return;
        const state = this.state.getSnapshot();
        // Block sending only when an explicit reasoning effort is required and unset,
        // preserving DSH's native composer placeholder instead of overriding it.
        const shouldBlock = Boolean(this.views && state.writable && state.blockKind);
        const reason = shouldBlock
          ? (state.blockKind === 'unavailable'
            ? (state.catalog.error
              ? this.t('error.action', { message: state.catalog.error })
              : this.t('error.unavailable'))
            : this.nativePlaceholder())
          : undefined;
        const current = this.blockStore.getSnapshot();
        if (current && current !== this.ownBlock) return;
        if (!shouldBlock) {
          if (!current) return;
          this.ownBlock = undefined;
          this.blocks.set(this.binding.sessionId, undefined);
          return;
        }
        if (current && current === this.ownBlock && current.reason === reason) return;
        this.ownBlock = { reason };
        this.blocks.set(this.binding.sessionId, this.ownBlock);
      }

      mount() {
        this.views += 1;
        this.update();
        return () => {
          this.views -= 1;
          this.update();
        };
      }

      requireChoice(route) {
        if (this.disposed || !this.writable) throw errorForKey('error.denied', this.t);
        const choice = this.catalog.state.getSnapshot().value?.routes.get(routeKey(route));
        if (!choice) throw errorForKey('error.unavailable', this.t);
        return choice;
      }

      async pickModel(route) {
        const choice = this.requireChoice(route);
        if (this.operation) throw errorForKey('error.busy', this.t);
        if (choice.efforts.length < 2) return this.commit(route, choice.efforts[0]?.id);
        const current = this.state.getSnapshot();
        const { committed } = current;
        if (sameRoute(committed, route) && effortFor(choice, committed.reasoningEffort)) {
          this.draft = null;
          this.draftBaseline = null;
          this.draftBaselineEffort = undefined;
          this.update();
          return true;
        }
        this.draft = choice.route;
        this.draftBaseline = committed;
        this.draftBaselineEffort = current.effort?.id;
        this.update();
        return true;
      }

      async commit(route, reasoningEffort) {
        const choice = this.requireChoice(route);
        if (this.operation) throw errorForKey('error.busy', this.t);
        if (choice.efforts.length ? !effortFor(choice, reasoningEffort) : reasoningEffort !== undefined) {
          throw errorForKey('error.unavailable', this.t);
        }
        const selection = reasoningEffort === undefined ? choice.route : { ...choice.route, reasoningEffort };
        const current = this.state.getSnapshot();
        if (!current.initializing && sameSelection(selection, current.committed)) {
          this.draft = null;
          this.draftBaseline = null;
          this.draftBaselineEffort = undefined;
          this.update();
          return true;
        }
        const operation = { selection };
        this.operation = operation;
        this.update();
        try {
          const result = await this.remote.selectModel({ sessionId: this.binding.sessionId, ...selection });
          if (this.operation !== operation || this.disposed) return false;
          if (!result.ok) throw errorForRemote(result.error, this.t);
          const selected = result.value.selected;
          const projectedNext = this.projection.getSnapshot()?.next ?? null;
          if (sameSelection(projectedNext, selected)) {
            this.clearConfirmed();
          } else {
            this.setConfirmed(projectedNext, current.committed, selected);
          }
          this.draft = null;
          this.draftBaseline = null;
          this.draftBaselineEffort = undefined;
          return true;
        } catch (error) {
          if (this.operation !== operation || this.disposed) return false;
          throw error;
        } finally {
          if (this.operation === operation) {
            this.operation = null;
            this.update();
          }
        }
      }

      reset() {
        this.draft = null;
        this.draftBaseline = null;
        this.draftBaselineEffort = undefined;
        this.clearConfirmed();
        this.operation = null;
        this.lastProjectedNext = this.projection.getSnapshot()?.next ?? null;
        this.update();
      }

      dispose() {
        if (this.disposed) return;
        this.disposed = true;
        this.clearConfirmed();
        this.failureListeners.clear();
        for (const unsubscribe of this.unsubscribers) unsubscribe();
        if (this.ownBlock && this.blockStore.getSnapshot() === this.ownBlock) {
          this.blocks.set(this.binding.sessionId, undefined);
        }
      }
    }

    function installStyles() {
      if (typeof document === 'undefined') return () => {};
      let node = document.querySelector(`style[data-plugin-css=${JSON.stringify(styleId)}]`);
      if (!node) {
        node = document.createElement('style');
        node.setAttribute('data-plugin-css', styleId);
        document.head.appendChild(node);
      }
      node.textContent = styles;
      return () => {
        if (node?.isConnected) node.remove();
      };
    }

    function observeStickyGroups(viewport) {
      const entries = [...viewport.querySelectorAll(':scope > [data-menu-group]')].flatMap(section => {
        const heading = section.querySelector(':scope > [data-menu-group-heading]');
        const start = section.querySelector(':scope > [data-menu-group-start]');
        return heading && start
          ? [{ section, heading, start, atTop: false, above: false, topTime: -Infinity, aboveTime: -Infinity }]
          : [];
      });
      if (!entries.length || typeof IntersectionObserver === 'undefined' || typeof ResizeObserver === 'undefined') {
        return () => {};
      }
      const bySection = new Map(entries.map(entry => [entry.section, entry]));
      const byStart = new Map(entries.map(entry => [entry.start, entry]));
      let disposed = false;
      let sectionObserver;
      let lastHeight;
      const paint = entry => {
        const stuck = entry.atTop && entry.above;
        if (entry.heading.hasAttribute('data-stuck') !== stuck) entry.heading.toggleAttribute('data-stuck', stuck);
      };
      const startObserver = new IntersectionObserver(records => {
        if (disposed) return;
        for (const record of records) {
          const entry = byStart.get(record.target);
          if (!entry || record.rootBounds === null || record.time < entry.aboveTime) continue;
          entry.above = record.boundingClientRect.top < record.rootBounds.top;
          entry.aboveTime = record.time;
          paint(entry);
        }
      }, { root: viewport, threshold: [0, 1] });
      for (const entry of entries) startObserver.observe(entry.start);

      const resizeObserver = new ResizeObserver(records => {
        for (const record of records) {
          if (record.target !== viewport || record.contentRect.height === lastHeight) continue;
          lastHeight = record.contentRect.height;
          sectionObserver?.disconnect();
          const current = new IntersectionObserver(items => {
            if (disposed || sectionObserver !== current) return;
            for (const item of items) {
              const entry = bySection.get(item.target);
              if (!entry || item.rootBounds === null || item.time < entry.topTime) continue;
              const top = item.rootBounds.top;
              entry.atTop = item.isIntersecting
                && item.boundingClientRect.top <= top + 1
                && item.boundingClientRect.bottom > top;
              entry.topTime = item.time;
              paint(entry);
            }
          }, { root: viewport, rootMargin: `0px 0px -${Math.max(0, Math.floor(lastHeight - 1))}px 0px`, threshold: 0 });
          sectionObserver = current;
          for (const entry of entries) current.observe(entry.section);
        }
      });
      resizeObserver.observe(viewport);
      return () => {
        disposed = true;
        startObserver.disconnect();
        sectionObserver?.disconnect();
        resizeObserver.disconnect();
      };
    }

    function apply(ctx) {
      ctx.effect(() => installStyles(), 'model-effort-picker: styles');
      ctx.effect(() => ctx.locale.register(namespace, dictionaries), 'model-effort-picker: dictionaries');
      const t = ctx.locale.bind(namespace);
      const conversationT = ctx.locale.bind('conversation');
      const { sessions, commandUi, uiSession } = ctx;
      const remote = ctx.remote.session;
      const catalog = makeCatalog(remote);
      const pickers = new Map();
      const handoffs = new Set();
      const submitGuards = new Set();
      const popupSignals = new WeakMap();
      let refreshTimer = null;
      function cancelScheduledRefresh() {
        if (refreshTimer !== null) {
          clearTimeout(refreshTimer);
          refreshTimer = null;
        }
      }
      const reload = (force = false) => {
        const flush = force === true || refreshTimer !== null;
        if (flush) cancelScheduledRefresh();
        void (flush ? catalog.refresh() : catalog.load()).catch(() => {});
      };
      const scheduleRefresh = () => {
        cancelScheduledRefresh();
        refreshTimer = setTimeout(() => {
          refreshTimer = null;
          void catalog.refresh().catch(() => {});
        }, 60);
      };
      if (typeof ctx.locale.subscribe === 'function') {
        ctx.effect(() => ctx.locale.subscribe(() => {
          for (const entry of pickers.values()) entry.picker.syncBlock();
        }), 'model-effort-picker: locale sync');
      }

      function clearHandoffs(binding) {
        for (const entry of [...handoffs]) {
          if (binding !== undefined && entry.binding !== binding) continue;
          entry.cancel();
        }
      }

      function clearSubmitGuards(binding) {
        for (const guard of [...submitGuards]) {
          if (binding !== undefined && guard.binding !== binding) continue;
          guard.release();
        }
      }

      function resolvePopup(bindingCtx) {
        if (typeof commandUi.popupFor !== 'function') return null;
        try {
          const popup = commandUi.popupFor(bindingCtx);
          return popup && typeof popup.open === 'function' && typeof popup.state?.getSnapshot === 'function'
            ? popup
            : null;
        } catch {
          return null;
        }
      }

      function pickerFor(id) {
        const binding = sessions.binding(id);
        if (!binding || sessions.subagentAddress(id) !== undefined) return null;
        if (pickers.has(binding)) return pickers.get(binding).picker;
        const picker = new SessionPicker(binding, catalog, ctx.conversation.blocks, remote, t, conversationT);
        const releaseAccess = uiSession.whenAccess(id, selectAction, () => {
          picker.writable = true;
          picker.update();
          return () => {
            picker.writable = false;
            picker.update();
          };
        });
        const disposeScope = binding.ctx.effect(() => () => {
          clearHandoffs(binding);
          clearSubmitGuards(binding);
          pickers.delete(binding);
          picker.dispose();
          releaseAccess();
        }, 'model-effort-picker: session');
        pickers.set(binding, { picker, disposeScope });
        return picker;
      }

      function guardPopupSubmit(binding, popup, { blockKeys = true } = {}) {
        const isOurSubmit = snapshot => Boolean(snapshot?.open && snapshot.command === 'model' && snapshot.submitting);
        let leftActiveSubmit = !popup || !isOurSubmit(popup.state.getSnapshot());
        let released = false;
        let unsubPopup;
        const onKeyDown = event => {
          if (event.key !== 'Escape' && !(event.key === 'Tab' && event.shiftKey)) return;
          if (!isOurSubmit(popup?.state.getSnapshot())) return;
          event.preventDefault();
          event.stopPropagation();
        };
        if (popup && typeof popup.state?.subscribe === 'function') {
          unsubPopup = popup.state.subscribe(() => {
            if (!isOurSubmit(popup.state.getSnapshot())) leftActiveSubmit = true;
          });
        }
        if (blockKeys && popup && typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
          window.addEventListener('keydown', onKeyDown, true);
        }
        const guard = {
          binding,
          hasLeftPopup() {
            return leftActiveSubmit || !popup || !isOurSubmit(popup.state.getSnapshot());
          },
          release() {
            if (released) return;
            released = true;
            unsubPopup?.();
            unsubPopup = undefined;
            if (blockKeys && typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
              window.removeEventListener('keydown', onKeyDown, true);
            }
            submitGuards.delete(guard);
          },
        };
        submitGuards.add(guard);
        return guard;
      }

      async function commitFromCommand(picker, route, reasoningEffort, popup) {
        const guard = guardPopupSubmit(picker.binding, popup);
        try {
          await picker.commit(route, reasoningEffort);
        } catch (error) {
          if (guard.hasLeftPopup()) {
            picker.reportFailure(error);
          }
          throw error;
        } finally {
          guard.release();
        }
      }

      function schedulePopupHandoff(picker, session, buildSpec, fallback) {
        const popup = resolvePopup(picker.binding.ctx);
        if (!popup) {
          fallback?.();
          return;
        }
        clearHandoffs(picker.binding);
        const signal = popupSignals.get(session);
        let settled = false;
        let sawClosed = !popup.state.getSnapshot().open;
        let unsubPopup;
        const onKeyDown = event => {
          if (event.key === 'Escape') entry.cancel();
        };
        const onPointerDown = () => { entry.cancel(); };
        const detach = () => {
          unsubPopup?.();
          unsubPopup = undefined;
          if (typeof document !== 'undefined') {
            document.removeEventListener('keydown', onKeyDown, true);
            document.removeEventListener('pointerdown', onPointerDown, true);
          }
        };
        const entry = {
          binding: picker.binding,
          timer: null,
          cancel() {
            if (settled) return;
            settled = true;
            clearTimeout(entry.timer);
            detach();
            handoffs.delete(entry);
          },
        };
        if (typeof popup.state.subscribe === 'function') {
          unsubPopup = popup.state.subscribe(() => {
            const isOpen = popup.state.getSnapshot().open;
            if (!isOpen) {
              sawClosed = true;
            } else if (sawClosed) {
              entry.cancel();
            }
          });
        }
        if (typeof document !== 'undefined') {
          document.addEventListener('keydown', onKeyDown, true);
          document.addEventListener('pointerdown', onPointerDown, true);
        }
        entry.timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          detach();
          handoffs.delete(entry);
          if (signal?.aborted || sessions.binding(session.sessionId) !== picker.binding
            || !picker.writable || popup.state.getSnapshot().open) return;
          popup.open('model', buildSpec(popup), session, { via: 'enter', token: '' });
        }, 0);
        handoffs.add(entry);
      }

      function openModels(picker, session) {
        schedulePopupHandoff(picker, session, () => makeModelPopupUi(true));
      }

      function openEfforts(picker, route, session) {
        schedulePopupHandoff(
          picker,
          session,
          popup => ({
            searchMode: 'fuzzy-label',
            searchLabels: () => ({
              placeholder: t('search.effortPlaceholder'),
              empty: t('empty.efforts'),
              noResults: t('search.effortEmpty'),
            }),
            options: async () => {
              const choice = picker.requireChoice(route);
              const current = picker.state.getSnapshot().committed;
              return choice.efforts.map(level => ({
                id: level.id,
                label: level.name,
                group: { name: 'effort', label: choice.model.name },
                active: sameRoute(current, route) && current.reasoningEffort === level.id,
              }));
            },
            onSelect: async option => {
              await commitFromCommand(picker, route, option.id, popup);
            },
          }),
          () => { void picker.pickModel(route).catch(() => {}); },
        );
      }

      function makeModelPopupUi(skipPartialRefresh = false) {
        return {
          searchMode: 'fuzzy-label',
          searchLabels: () => ({
            placeholder: t('search.placeholder'),
            empty: t('empty.models'),
            noResults: t('search.empty'),
          }),
          async options(session, signal) {
            popupSignals.set(session, signal);
            const picker = pickerFor(session.sessionId);
            if (!picker?.writable) throw errorForKey('error.denied', t);
            const currentCatalog = catalog.state.getSnapshot();
            const hasPendingRefresh = refreshTimer !== null;
            if (hasPendingRefresh) cancelScheduledRefresh();
            const value = hasPendingRefresh
              || (!skipPartialRefresh
                && currentCatalog.status === 'ready'
                && currentCatalog.value?.failures.length)
              ? await catalog.refresh()
              : await catalog.load();
            const current = picker.state.getSnapshot().selection;
            return [
              ...Array.from(value.routes, ([id, choice]) => ({
                id,
                label: choice.model.name,
                group: { name: choice.group.id, label: providerLabel(choice.group, t) },
                active: sameRoute(current, choice.route),
              })),
              ...value.failures.map(failure => ({
                id: `failure:${failure.id}`,
                label: providerLabel(failure, t),
                detail: `${t('option.loadError', { message: failure.message })} · ${t('retry')}`,
              })),
            ];
          },
          async onSelect(option, session) {
            const picker = pickerFor(session.sessionId);
            if (!picker?.writable) throw errorForKey('error.denied', t);
            const popup = resolvePopup(picker.binding.ctx);
            if (option.id.startsWith('failure:')) {
              const providerId = option.id.slice('failure:'.length);
              const guard = guardPopupSubmit(picker.binding, popup, { blockKeys: false });
              let refreshed;
              try {
                cancelScheduledRefresh();
                refreshed = await catalog.refresh();
              } catch (error) {
                if (guard.hasLeftPopup()) picker.reportFailure(error);
                throw error;
              } finally {
                guard.release();
              }
              const stillFailed = refreshed.failures.find(failure => failure.id === providerId);
              if (stillFailed) {
                const err = new Error(t('option.loadError', { message: stillFailed.message }));
                if (guard.hasLeftPopup()) picker.reportFailure(err);
                throw err;
              }
              if (!guard.hasLeftPopup()) {
                openModels(picker, session);
              }
              return;
            }
            const choice = catalog.state.getSnapshot().value?.routes.get(option.id);
            if (!choice) throw option.detail ? new Error(option.detail) : errorForKey('error.unavailable', t);
            if (choice.efforts.length > 1) openEfforts(picker, choice.route, session);
            else await commitFromCommand(picker, choice.route, choice.efforts[0]?.id, popup);
          },
        };
      }

      ctx.effect(() => commandUi.register({
        name: 'model',
        label: () => t('command.label'),
        description: () => t('command.description'),
        icon: ModelIcon,
        available: session => pickerFor(session.sessionId)?.writable === true,
        ui: {
          kind: 'popupSelect',
          ...makeModelPopupUi(false),
        },
      }), 'model-effort-picker: /model contribution');

      ctx.slots.inject(modelSlot, () => ctx.slots.register({
        name: modelSlot,
        locale: namespace,
        children: {
          [`${modelSlot}.label`]: { kind: 'single', scope: 'session', inline: true },
          [`${modelSlot}.options`]: { kind: 'list', scope: 'session' },
        },
        inject: sessionId => ({
          picker: pickerFor(sessionId),
          reload,
          resolveText: text => ctx.locale.resolveText(text),
        }),
      }, Seat));

      ctx.on('connection/reset', () => {
        cancelScheduledRefresh();
        clearHandoffs();
        clearSubmitGuards();
        void catalog.refresh(true).catch(() => {});
        for (const { picker } of pickers.values()) picker.reset();
        commandUi.dismiss('model');
      });
      for (const event of [
        'llm/adapters-updated',
        'llm/models-updated',
        'settings/document-updated',
        'credentials/record-updated',
        'credentials/reference-updated',
      ]) {
        ctx.remote.$on(event, scheduleRefresh);
      }
      ctx.effect(() => {
        reload();
        return () => {
          cancelScheduledRefresh();
          clearHandoffs();
          clearSubmitGuards();
          commandUi.dismiss('model');
          for (const { picker, disposeScope } of pickers.values()) {
            picker.dispose();
            void disposeScope();
          }
          pickers.clear();
        };
      }, 'model-effort-picker: lifecycle');
    }

    function ModelIcon({ size = 16, className } = {}) {
      return h('svg', {
        className, width: size, height: size, viewBox: '0 0 16 16', fill: 'none', strokeWidth: 1, 'aria-hidden': true,
      },
      h('path', {
        fill: 'currentColor',
        d: 'M7.8667 0.349609C8.96906 0.349634 10.0601 0.481272 11.0317 0.735352C11.9973 0.987845 12.8453 1.362 13.4644 1.84766C14.0744 2.32629 14.507 2.95539 14.5161 3.69336H14.5171V8.53516C14.0843 8.32076 13.6108 8.17679 13.1108 8.11816C13.1831 7.96848 13.2162 7.82856 13.2163 7.70312V5.76758C12.6269 6.16618 11.8739 6.47995 11.0317 6.7002C10.0602 6.95423 8.96896 7.08494 7.8667 7.08496C6.76461 7.08493 5.67411 6.95415 4.70264 6.7002C3.85994 6.48006 3.10694 6.1662 2.51709 5.76758V7.70312L2.521 7.78418C2.56374 8.19554 2.93361 8.74414 3.91357 9.23145C4.9281 9.73585 6.35004 10.0371 7.8667 10.0371C8.26373 10.0371 8.6543 10.0141 9.03271 9.97461C8.75596 10.3799 8.54664 10.8349 8.42041 11.3232C8.23666 11.3313 8.0518 11.3369 7.8667 11.3369C6.20108 11.3369 4.57025 11.01 3.33447 10.3955C3.04163 10.2499 2.76658 10.0836 2.51709 9.90039V11.6738C2.51728 12.1379 2.88589 12.7556 3.92236 13.292C4.93457 13.8157 6.35342 14.1289 7.8667 14.1289C8.12318 14.1289 8.37694 14.1161 8.62646 14.0986C8.82021 14.5535 9.08999 14.9682 9.41943 15.3271C8.91285 15.3934 8.39149 15.4287 7.8667 15.4287C6.19761 15.4287 4.56379 15.0869 3.32568 14.4463C2.11244 13.8185 1.21649 12.8562 1.21631 11.6738V3.76367C1.21595 3.74853 1.21438 3.733 1.21436 3.71777C1.21436 2.96917 1.65103 2.33053 2.26807 1.84668C2.88747 1.36112 3.73675 0.987685 4.70264 0.735352C5.67413 0.481376 6.76457 0.349636 7.8667 0.349609ZM7.8667 1.65039C6.86269 1.65042 5.88326 1.77028 5.03076 1.99316C4.17183 2.2176 3.50421 2.52956 3.06982 2.87012C2.65043 3.19909 2.52622 3.48898 2.51709 3.69336V3.74414C2.52719 3.94845 2.65185 4.23772 3.06982 4.56543C3.50425 4.90601 4.17172 5.21795 5.03076 5.44238C5.88326 5.66527 6.8627 5.78513 7.8667 5.78516C8.8707 5.78513 9.85015 5.66525 10.7026 5.44238C11.5611 5.21787 12.2286 4.9049 12.6626 4.56445C13.0982 4.22252 13.2163 3.9231 13.2163 3.71777L13.2104 3.63574C13.1818 3.43623 13.044 3.16941 12.6626 2.87012C12.2286 2.52957 11.5614 2.21773 10.7026 1.99316C9.85009 1.77025 8.8708 1.65041 7.8667 1.65039Z',
      }),
      h('path', {
        stroke: 'currentColor',
        strokeMiterlimit: 10,
        d: 'M12.8936 10.0361L13.2061 10.5566C13.2296 10.5959 13.2651 10.6562 13.3027 10.707C13.3469 10.7666 13.4148 10.8431 13.5195 10.9023C13.6244 10.9617 13.725 10.9801 13.7988 10.9873C13.8619 10.9934 13.9318 10.9932 13.9775 10.9932H14.6162L14.8896 11.4502L14.5947 11.9443C14.5698 11.9859 14.5312 12.0483 14.5029 12.1084C14.4781 12.1611 14.4514 12.2312 14.4395 12.3164L14.4326 12.4072L14.4395 12.4971C14.4514 12.5825 14.4781 12.6532 14.5029 12.7061C14.5312 12.7661 14.5689 12.8287 14.5938 12.8701L14.8896 13.3633L14.6162 13.8213H13.9775C13.9318 13.8213 13.8619 13.821 13.7988 13.8271C13.7433 13.8326 13.6728 13.8442 13.5967 13.875L13.5195 13.9121C13.4148 13.9714 13.3469 14.0478 13.3027 14.1074C13.265 14.1583 13.2296 14.2186 13.2061 14.2578L12.8936 14.7783H12.3115L11.999 14.2578C11.9755 14.2186 11.9401 14.1583 11.9023 14.1074C11.8693 14.0628 11.823 14.0083 11.7578 13.959L11.6855 13.9121L11.6074 13.875C11.5316 13.8445 11.4615 13.8325 11.4062 13.8271C11.3432 13.821 11.2733 13.8213 11.2275 13.8213H10.5889L10.3135 13.3633L10.6104 12.8701C10.6352 12.8287 10.6739 12.7661 10.7021 12.7061C10.7352 12.6357 10.7724 12.534 10.7725 12.4072C10.7724 12.2804 10.7352 12.1788 10.7021 12.1084C10.6739 12.0483 10.6353 11.9859 10.6104 11.9443L10.3135 11.4502L10.5889 10.9932H11.2275C11.2733 10.9932 11.3432 10.9934 11.4062 10.9873C11.4801 10.9801 11.5808 10.9616 11.6855 10.9023C11.7903 10.843 11.8582 10.7666 11.9023 10.707C11.94 10.6562 11.9755 10.5959 11.999 10.5566L12.3115 10.0361H12.8936Z',
      }));
    }

    function ChevronDownIcon({ size = 14, className } = {}) {
      return h('svg', {
        className, width: size, height: size, viewBox: '0 0 16 16', fill: 'none', strokeWidth: 1, 'aria-hidden': true,
      }, h('path', {
        d: 'M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6',
        stroke: 'currentColor',
      }));
    }

    function ChevronLeftIcon({ size = 12, className } = {}) {
      return h('svg', {
        className, width: size, height: size, viewBox: '0 0 16 16', fill: 'none', strokeWidth: 1, 'aria-hidden': true,
      }, h('path', {
        d: 'M10 4L6.70711 7.29289C6.31658 7.68342 6.31658 8.31658 6.70711 8.70711L10 12',
        stroke: 'currentColor',
      }));
    }

    function ChevronRightIcon({ size = 12, className } = {}) {
      return h('svg', {
        className, width: size, height: size, viewBox: '0 0 16 16', fill: 'none', strokeWidth: 1, 'aria-hidden': true,
      }, h('path', {
        d: 'M6 12L9.29289 8.70711C9.68342 8.31658 9.68342 7.68342 9.29289 7.29289L6 4',
        stroke: 'currentColor',
      }));
    }

    function CheckIcon({ size = 14, className } = {}) {
      return h('svg', {
        className, width: size, height: size, viewBox: '0 0 16 16', fill: 'none', strokeWidth: 1, 'aria-hidden': true,
      }, h('path', {
        d: 'M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4',
        stroke: 'currentColor',
      }));
    }

    function CloseIcon({ size = 14, className } = {}) {
      return h('svg', {
        className, width: size, height: size, viewBox: '0 0 16 16', fill: 'none', strokeWidth: 1, 'aria-hidden': true,
      },
      h('path', { d: 'M3.5 3.5L12.5 12.5', stroke: 'currentColor' }),
      h('path', { d: 'M12.5 3.5L3.5 12.5', stroke: 'currentColor' }));
    }

    function WarningIcon({ size = 16, className } = {}) {
      return h('svg', {
        className, width: size, height: size, viewBox: '0 0 16 16', fill: 'none', strokeWidth: 1, 'aria-hidden': true,
      },
      h('path', { d: 'M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5Z', stroke: 'currentColor' }),
      h('path', { d: 'M8 4.29199V9.79199', stroke: 'currentColor' }),
      h('path', { d: 'M8 10.708V11.708', stroke: 'currentColor' }));
    }

    function BusySpinner({ size = 14, className } = {}) {
      return h('svg', {
        className: className ? `mep-spinner ${className}` : 'mep-spinner',
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        'aria-hidden': true,
      }, h('g', { className: 'mep-spinner-motion' },
        h('circle', { className: 'mep-spinner-track', cx: 12, cy: 12, r: 9.5 }),
        h('circle', { className: 'mep-spinner-arc', cx: 12, cy: 12, r: 9.5 })));
    }

    function Toast({ text, anchorRef, onDone }) {
      const doneRef = useRef(onDone);
      doneRef.current = onDone;
      const [centerX, setCenterX] = useState(null);

      useEffect(() => {
        const timer = setTimeout(() => { doneRef.current?.(); }, 4000);
        return () => clearTimeout(timer);
      }, []);

      useLayoutEffect(() => {
        const measure = () => {
          const anchor = anchorRef?.current?.closest('[data-composer-card]') ?? null;
          if (!anchor) {
            setCenterX(null);
            return;
          }
          const rect = anchor.getBoundingClientRect();
          setCenterX(rect.left + rect.width / 2);
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
      }, [anchorRef]);

      return createPortal(h('div', {
        className: 'mep-toast',
        role: 'alert',
        style: centerX === null ? undefined : { left: centerX },
      },
      h('span', { className: 'mep-toast-icon', 'aria-hidden': true }, h(WarningIcon)),
      h('span', { className: 'mep-toast-text' }, text)), document.body);
    }

    const supportsAnchor = () => typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
      && CSS.supports('anchor-name', '--mep-anchor')
      && CSS.supports('position-anchor', '--mep-anchor')
      && CSS.supports('top', 'anchor(top)')
      && CSS.supports('right', 'anchor(right)');
    const coarsePointer = () => typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(pointer: coarse)').matches;

    function placeMenuFallback(menu, trigger) {
      const rect = trigger.getBoundingClientRect();
      const viewport = window.visualViewport;
      const left = viewport?.offsetLeft ?? 0;
      const top = viewport?.offsetTop ?? 0;
      const width = viewport?.width ?? window.innerWidth;
      const height = viewport?.height ?? window.innerHeight;
      const computedTop = typeof getComputedStyle === 'function'
        ? Number.parseFloat(getComputedStyle(menu).scrollMarginTop)
        : Number.NaN;
      const overlayTop = Number.isFinite(computedTop) ? computedTop : 12;
      const safeTop = top + Math.max(12, overlayTop);
      const above = rect.top - safeTop - 8;
      const below = top + height - rect.bottom - 20;
      const opensAbove = above >= 160 || above >= below;
      const minimum = Math.min(240, width - 24);
      const rightEdge = Math.min(left + width - 12, Math.max(left + minimum + 12, rect.right));
      Object.assign(menu.style, {
        minWidth: `${minimum}px`,
        maxWidth: `${Math.min(420, rightEdge - left - 12)}px`,
        maxHeight: `${Math.max(48, Math.min(360, opensAbove ? above : below))}px`,
        right: `${window.innerWidth - rightEdge}px`,
        bottom: opensAbove ? `${window.innerHeight - rect.top + 8}px` : 'auto',
        top: opensAbove ? 'auto' : `${rect.bottom + 8}px`,
        left: 'auto',
      });
    }

    function Seat(props) {
      return props.picker ? h(ModelMenu, { ...props, key: props.picker.id }) : null;
    }

    function ModelMenu({ picker, locked, reload, resolveText, renderSlot, t }) {
      const state = useSyncExternalStore(picker.state.subscribe, picker.state.getSnapshot);
      const [pane, setPane] = useState(null);
      const [focusTick, setFocusTick] = useState(0);
      const [query, setQuery] = useState('');
      const [highlight, setHighlight] = useState(null);
      const [selectionFocus, setSelectionFocus] = useState(false);
      const [toast, setToast] = useState(null);
      const toastSeq = useRef(0);
      const rootRef = useRef(null);
      const triggerRef = useRef(null);
      const menuRef = useRef(null);
      const groupsRef = useRef(null);
      const searchRef = useRef(null);
      const focusRequest = useRef(null);
      const submittingRef = useRef(false);
      const submitSeq = useRef(0);
      const menuRevision = useRef(0);
      const pointerInMenuRef = useRef(false);
      const releasePointerRef = useRef(null);
      const composingRef = useRef(false);
      const composingUntilRef = useRef(0);
      const id = useId();
      const anchorStyle = useMemo(() => ({ '--dsh-model-anchor': `--dsh-model-${id.replace(/[^a-zA-Z0-9_-]/g, '')}` }), [id]);

      const open = pane !== null && !locked && state.writable;
      const hasChoice = state.displayChoice !== undefined;
      const value = state.catalog.value;
      const showSearch = (value?.routes.size ?? 0) > 4;
      const filteredGroups = useMemo(() => {
        if (pane !== 'model') return [];
        return (value?.groups ?? []).map(group => ({
          group,
          models: rankByName(group.models, showSearch ? query : ''),
        })).filter(entry => entry.models.length > 0);
      }, [pane, value, showSearch, query]);
      const visibleRoutes = useMemo(() => filteredGroups.flatMap(({ group, models }) =>
        models.map(model => ({ provider: group.id, model: model.id }))), [filteredGroups]);
      const currentVisibleIndex = visibleRoutes.findIndex(route => sameRoute(route, state.selection));
      const activeIndex = Math.min(highlight ?? Math.max(0, currentVisibleIndex), visibleRoutes.length - 1);

      const showToast = useCallback(text => {
        toastSeq.current += 1;
        setToast({ seq: toastSeq.current, text });
      }, []);

      useLayoutEffect(() => locked ? undefined : picker.mount(), [picker, locked]);
      useEffect(() => { picker.syncBlock(); }, [picker, t]);
      useEffect(() => picker.onFailure(info => showToast(formatError(info, t))), [picker, showToast, t]);
      useEffect(() => () => { releasePointerRef.current?.(); }, []);

      const triggerReload = useCallback(() => {
        menuRef.current?.focus({ preventScroll: true });
        reload(true);
      }, [reload]);

      function close(refocus = false) {
        releasePointerRef.current?.();
        composingRef.current = false;
        composingUntilRef.current = 0;
        menuRevision.current += 1;
        focusRequest.current = null;
        setPane(null);
        if (refocus) queueMicrotask(() => { triggerRef.current?.focus({ preventScroll: true }); });
      }

      function focusRow(element) {
        if (!element) return;
        element.focus({ preventScroll: true });
        if (element !== triggerRef.current && element !== menuRef.current && typeof element.scrollIntoView === 'function') {
          element.scrollIntoView({ block: 'nearest' });
        }
      }

      function isComposingKey(event) {
        const native = event.nativeEvent ?? event;
        return Boolean(
          native.isComposing
          || native.keyCode === 229
          || event.keyCode === 229
          || composingRef.current
          || Date.now() < composingUntilRef.current,
        );
      }

      useEffect(() => {
        if (pane !== null && !open) close();
        if (!open) {
          composingRef.current = false;
          composingUntilRef.current = 0;
        }
      }, [pane, open]);

      useLayoutEffect(() => {
        if (!showSearch) {
          setQuery('');
          setHighlight(null);
        }
      }, [showSearch]);

      useEffect(() => {
        if (!open) return;
        const closeOutside = event => {
          if (rootRef.current?.contains(event.target)) return;
          if (menuRef.current?.contains(event.target)) return;
          close();
        };
        document.addEventListener('mousedown', closeOutside);
        return () => document.removeEventListener('mousedown', closeOutside);
      }, [open]);

      useLayoutEffect(() => {
        const menu = menuRef.current;
        const trigger = triggerRef.current;
        if (!open || !menu || !trigger || supportsAnchor()) return;
        const position = () => placeMenuFallback(menu, trigger);
        position();
        window.addEventListener('resize', position);
        window.addEventListener('scroll', position, true);
        window.visualViewport?.addEventListener('resize', position);
        window.visualViewport?.addEventListener('scroll', position);
        return () => {
          window.removeEventListener('resize', position);
          window.removeEventListener('scroll', position, true);
          window.visualViewport?.removeEventListener('resize', position);
          window.visualViewport?.removeEventListener('scroll', position);
        };
      }, [open, pane, picker]);

      useEffect(() => {
        const viewport = groupsRef.current;
        if (!open || pane !== 'model' || !viewport) return;
        return observeStickyGroups(viewport);
      }, [open, pane, filteredGroups]);

      const previousShowSearch = useRef(showSearch);
      // InputBar refocuses its draft editor when a block clears; run on the
      // next frame so menu focus survives returning to the root pane.
      useEffect(() => {
        const changedSearchMode = previousShowSearch.current !== showSearch;
        previousShowSearch.current = showSearch;
        if (changedSearchMode && open && pane === 'model' && focusRequest.current === null) {
          focusRequest.current = 'drill';
        }
        if (!open || !focusRequest.current) return;
        const frame = requestAnimationFrame(() => {
          const menu = menuRef.current;
          const request = focusRequest.current;
          if (!menu || !request) return;
          focusRequest.current = null;
          if (request === 'drill') {
            if (pane === 'model' && showSearch && !coarsePointer()) {
              searchRef.current?.focus({ preventScroll: true });
              return;
            }
            const checked = menu.querySelector('[role="menuitemradio"][aria-checked="true"]:not([disabled])');
            const firstOption = menu.querySelector('[role="menuitemradio"]:not([disabled])');
            const first = menu.querySelector(menuRowsSelector);
            focusRow(checked ?? firstOption ?? first ?? triggerRef.current);
            return;
          }
          const cell = menu.querySelector(`[data-mep-cell="${request}"]:not([disabled])`);
          focusRow(cell ?? menu.querySelector(menuRowsSelector) ?? triggerRef.current);
        });
        return () => cancelAnimationFrame(frame);
      }, [open, pane, showSearch, state.busy, focusTick]);

      useLayoutEffect(() => {
        if (open && pane === 'model' && activeIndex >= 0) {
          menuRef.current?.querySelector(`[data-mep-model="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
        }
      }, [open, pane, activeIndex, visibleRoutes]);

      function drill(next) {
        menuRevision.current += 1;
        focusRequest.current = 'drill';
        setQuery('');
        setHighlight(null);
        setPane(next);
        setFocusTick(tick => tick + 1);
      }

      function parent(from) {
        menuRevision.current += 1;
        focusRequest.current = from === 'effort' ? 'effort' : 'model';
        setPane('root');
        setFocusTick(tick => tick + 1);
      }

      function submit(operation, { silentToast = false } = {}) {
        if (state.busy || submittingRef.current) return;
        const revision = ++menuRevision.current;
        const submitId = ++submitSeq.current;
        const from = pane;
        submittingRef.current = true;
        setSelectionFocus(true);
        triggerRef.current?.focus({ preventScroll: true });
        void operation().then(settled => {
          if (submitSeq.current === submitId) submittingRef.current = false;
          if (settled === false || !menuRef.current || menuRevision.current !== revision) return;
          const next = picker.state.getSnapshot();
          const target = from === 'model' && next.needsEffort && next.choice?.efforts.length
            ? 'effort'
            : from === 'root'
              ? (next.choice?.efforts.length ? 'effort' : 'model')
              : from;
          parent(target);
        }, failure => {
          if (submitSeq.current === submitId) submittingRef.current = false;
          if (!silentToast) showToast(formatError(toErrorInfo(failure), t));
          if (!menuRef.current || menuRevision.current !== revision) return;
          if (from === 'model' && showSearch && !coarsePointer()) {
            searchRef.current?.focus({ preventScroll: true });
            return;
          }
          const target = from === 'root'
            ? (menuRef.current.querySelector('.mep-retry:not([disabled])')
              ?? menuRef.current.querySelector('[data-mep-cell="effort"]:not([disabled])')
              ?? menuRef.current.querySelector(menuRowsSelector))
            : (menuRef.current.querySelector('[aria-checked="true"]:not([disabled]), [role="menuitemradio"]:not([disabled])')
              ?? menuRef.current.querySelector(menuRowsSelector));
          if (target) {
            focusRow(target);
          } else {
            setSelectionFocus(false);
            triggerRef.current?.focus({ preventScroll: true });
          }
        });
      }

      function onMenuMouseDown() {
        releasePointerRef.current?.();
        pointerInMenuRef.current = true;
        const release = () => {
          pointerInMenuRef.current = false;
          releasePointerRef.current = null;
          window.removeEventListener('mouseup', release, true);
          window.removeEventListener('pointerup', release, true);
          window.removeEventListener('blur', release);
          const active = document.activeElement;
          if (menuRef.current && !rootRef.current?.contains(active) && !menuRef.current.contains(active)) {
            menuRef.current.focus({ preventScroll: true });
          }
        };
        releasePointerRef.current = release;
        window.addEventListener('mouseup', release, true);
        window.addEventListener('pointerup', release, true);
        window.addEventListener('blur', release);
      }

      function onRootBlur(event) {
        if (focusRequest.current !== null || submittingRef.current || pointerInMenuRef.current) return;
        if (event.relatedTarget instanceof Node && (
          rootRef.current?.contains(event.relatedTarget)
          || menuRef.current?.contains(event.relatedTarget)
        )) return;
        close();
      }

      function onRootKeyDown(event) {
        if (!open || isComposingKey(event)) return;
        const { key, shiftKey } = event;
        if (key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          if (pane !== 'root' && hasChoice) parent(pane);
          else close(true);
          return;
        }
        if (pane === 'model' && showSearch && (key === 'ArrowDown' || key === 'ArrowUp')) {
          event.preventDefault();
          if (!state.busy && visibleRoutes.length) {
            const delta = key === 'ArrowDown' ? 1 : -1;
            setHighlight((activeIndex + delta + visibleRoutes.length) % visibleRoutes.length);
            searchRef.current?.focus({ preventScroll: true });
          }
          return;
        }
        if (pane === 'model' && showSearch && event.target === searchRef.current && (key === 'Enter' || (key === 'Tab' && !shiftKey))) {
          if (key === 'Tab' && !visibleRoutes.length) return;
          event.preventDefault();
          const route = visibleRoutes[activeIndex];
          if (!state.busy && route) submit(() => picker.pickModel(route));
          return;
        }
        if (key === 'Tab') {
          if (shiftKey) {
            event.preventDefault();
            if (pane !== 'root' && hasChoice) parent(pane);
            else close(true);
            return;
          }
          const rows = Array.from(menuRef.current?.querySelectorAll(menuRowsSelector) ?? []);
          const focused = document.activeElement;
          if (focused instanceof HTMLButtonElement && rows.includes(focused)) {
            event.preventDefault();
            focused.click();
            return;
          }
          if (focused !== triggerRef.current && focused !== menuRef.current) return;
          event.preventDefault();
          if (pane === 'model' && showSearch) {
            setHighlight(null);
            searchRef.current?.focus({ preventScroll: true });
            return;
          }
          const checked = menuRef.current?.querySelector('[role="menuitemradio"][aria-checked="true"]:not([disabled])');
          const firstOption = menuRef.current?.querySelector('[role="menuitemradio"]:not([disabled])');
          focusRow(checked ?? firstOption ?? rows[0]);
          return;
        }
        if (key === 'ArrowDown' || key === 'ArrowUp') {
          event.preventDefault();
          const rows = Array.from(menuRef.current?.querySelectorAll(menuRowsSelector) ?? []);
          if (!rows.length) return;
          const active = rows.indexOf(document.activeElement);
          const delta = key === 'ArrowDown' ? 1 : -1;
          const next = active < 0 ? (delta > 0 ? 0 : rows.length - 1) : (active + delta + rows.length) % rows.length;
          focusRow(rows[next]);
        }
      }

      const waiting = !hasChoice && state.catalog.status === 'loading';
      const modelLabel = waiting
        ? t('trigger.loading')
        : state.displayChoice?.model.name ?? t('trigger.fallback');
      const effortText = state.effort?.name;
      const triggerTitle = state.blockKind === 'chooseEffort'
        ? `${modelLabel} · ${t('effort.unset')}`
        : state.blockKind === 'unavailable'
          ? `${modelLabel} · ${state.catalog.error ? t('error.action', { message: state.catalog.error }) : t('error.unavailable')}`
          : effortText === undefined
            ? modelLabel
            : `${modelLabel} · ${effortText}`;
      const triggerAria = waiting
        ? t('trigger.loading')
        : !hasChoice
          ? t('trigger.selectAria')
          : state.needsEffort
            ? t('trigger.ariaUnset', { model: modelLabel })
            : effortText === undefined
              ? t('trigger.aria', { model: modelLabel })
              : t('trigger.ariaEffort', { model: modelLabel, effort: effortText });

      function renderModelLabel(choice, placement, selected) {
        if (!choice) return modelLabel;
        const { group, model } = choice;
        const provider = { id: group.id, name: providerLabel(group, t) };
        const badge = model.badge
          ? h('span', { className: 'mep-tag mep-badge', 'data-tone': model.badge.tone ?? 'outline' }, resolveText(model.badge.text))
          : null;
        return h('span', { 'data-provider-id': provider.id, 'data-model-id': model.id },
          renderSlot(`${modelSlot}.label`, { provider, model, placement, selected }, {
            fallback: badge ? h('span', { className: 'mep-badged-name' },
              placement === 'trigger' && badge,
              placement === 'trigger' && ' ',
              h('span', { className: 'mep-badged-name-text' }, model.name),
              placement !== 'trigger' && ' ',
              placement !== 'trigger' && badge) : model.name,
          }));
      }

      const showEffortRow = Boolean(state.choice?.efforts.length || state.displayChoice?.efforts.length);
      let modelIndex = 0;

      const menu = open ? createPortal(h('div', {
        ref: menuRef,
        id: `${id}-menu`,
        tabIndex: -1,
        className: 'mep-menu',
        style: anchorStyle,
        'data-menu-material': 'translucent',
        role: pane === 'model' ? 'group' : 'menu',
        'aria-label': t('menu.aria'),
        'aria-busy': state.catalog.status === 'loading' || state.busy,
        onMouseDown: onMenuMouseDown,
      },
      h('div', { className: 'mep-material', 'aria-hidden': true }),
      pane === 'root' && h(React.Fragment, null,
        h('button', {
          type: 'button',
          role: 'menuitem',
          className: 'mep-cell',
          'data-mep-cell': 'model',
          disabled: state.busy,
          onClick: () => drill('model'),
        },
        h('span', { className: 'mep-cell-label' }, t('menu.model')),
        h('span', { className: 'mep-cell-value' }, renderModelLabel(state.displayChoice, 'menu', true)),
        h(ChevronRightIcon, { className: 'mep-cell-chevron' })),
        showEffortRow && h('button', {
          type: 'button',
          role: 'menuitem',
          className: 'mep-cell',
          'data-mep-cell': 'effort',
          'data-needs-effort': state.blockKind === 'chooseEffort' ? '' : undefined,
          'aria-label': state.needsEffort ? `${t('menu.effort')} · ${t('effort.unset')}` : undefined,
          disabled: state.busy || !state.choice?.efforts.length,
          onClick: () => drill('effort'),
        },
        h('span', { className: 'mep-cell-label' }, t('menu.effort')),
        h('span', { className: 'mep-cell-value' }, effortText ?? ''),
        h(ChevronRightIcon, { className: 'mep-cell-chevron' })),
        state.catalog.error !== null && h('div', { className: 'mep-error', role: 'alert' },
          h('span', null, t('error.action', { message: state.catalog.error })),
          h('button', { type: 'button', className: 'mep-retry', onClick: triggerReload }, t('action.reload'))),
        state.unavailable && state.catalog.error === null && h('div', { className: 'mep-warning', role: 'status' },
          h('span', null, t('error.unavailable')),
          h('button', { type: 'button', className: 'mep-retry', onClick: triggerReload }, t('retry'))),
        renderSlot(`${modelSlot}.options`, {
          locked: locked || state.busy,
          dismiss: () => {
            close();
            triggerRef.current?.focus();
          },
          reportFailure: showToast,
        })),
      pane === 'model' && h(React.Fragment, null,
        hasChoice && h('button', {
          type: 'button',
          className: 'mep-back',
          tabIndex: -1,
          disabled: state.busy,
          onClick: () => parent('model'),
        }, h(ChevronLeftIcon, { className: 'mep-back-chevron' }), h('span', null, t('menu.model'))),
        showSearch && h('div', { className: 'mep-search-row' },
          h('div', { className: query ? 'mep-search mep-search-with-query' : 'mep-search' },
            h('input', {
              ref: searchRef,
              className: 'mep-search-input',
              type: 'text',
              role: 'searchbox',
              'aria-label': t('search.placeholder'),
              'aria-controls': `${id}-models`,
              'aria-activedescendant': activeIndex < 0 ? undefined : `${id}-model-${activeIndex}`,
              placeholder: t('search.placeholder'),
              value: query,
              readOnly: state.busy,
              onCompositionStart: () => {
                composingRef.current = true;
              },
              onCompositionEnd: () => {
                composingRef.current = false;
                composingUntilRef.current = Date.now() + 10;
              },
              onChange: event => {
                setQuery(event.target.value);
                setHighlight(0);
              },
            })),
          query !== '' && h('button', {
            type: 'button',
            className: 'mep-search-clear',
            'aria-label': t('search.clear'),
            disabled: state.busy,
            onClick: () => {
              setQuery('');
              setHighlight(null);
              searchRef.current?.focus({ preventScroll: true });
            },
          }, h(CloseIcon))),
        state.catalog.status === 'loading' && h('div', { className: 'mep-status' }, t('status.loading')),
        state.catalog.error !== null && h('div', { className: 'mep-error', role: 'alert' },
          h('span', null, t('error.action', { message: state.catalog.error })),
          h('button', { type: 'button', className: 'mep-retry', onClick: triggerReload }, t('action.reload'))),
        (value?.failures ?? []).map(failure => h('div', { className: 'mep-warning', key: failure.id },
          h('span', null, t('warning.groupLoad', { name: providerLabel(failure, t), message: failure.message })),
          h('button', { type: 'button', className: 'mep-retry', onClick: triggerReload }, t('retry')))),
        h('div', {
          ref: groupsRef,
          id: `${id}-models`,
          className: 'mep-groups scrollable',
          role: 'menu',
          'aria-label': t('menu.model'),
          hidden: filteredGroups.length === 0,
        }, filteredGroups.map(({ group, models }) => {
          const headingId = `${id}-group-${group.id}`;
          return h('section', {
            key: group.id,
            role: 'group',
            'aria-labelledby': headingId,
            'data-menu-group': '',
            className: 'mep-group',
          },
          h('span', { 'aria-hidden': true, 'data-menu-group-start': '', className: 'mep-group-start' }),
          h('div', { id: headingId, 'data-menu-group-heading': '', className: 'mep-group-heading' }, providerLabel(group, t)),
          models.map(model => {
            const route = { provider: group.id, model: model.id };
            const key = routeKey(route);
            const index = modelIndex++;
            const selected = sameRoute(state.selection, route);
            const active = index === activeIndex;
            const pendingRow = sameRoute(state.pending, route);
            return h('button', {
              key: model.id,
              type: 'button',
              role: 'menuitemradio',
              'aria-checked': selected,
              id: `${id}-model-${index}`,
              tabIndex: showSearch ? -1 : 0,
              'data-mep-model': index,
              'data-highlighted': active ? '' : undefined,
              className: `mep-option mep-model-option${selected ? ' mep-selected' : ''}${active ? ' mep-option-active' : ''}`,
              title: model.name,
              disabled: state.busy,
              onFocus: () => setHighlight(index),
              onMouseMove: state.busy || active ? undefined : () => {
                if (showSearch) setHighlight(index);
                else menuRef.current?.querySelector(`[data-mep-model="${index}"]`)?.focus({ preventScroll: true });
              },
              onClick: () => submit(() => picker.pickModel(route)),
            },
            h('span', { className: 'mep-option-copy' },
              h('span', { className: 'mep-model-name' }, renderModelLabel(value.routes.get(key), 'option', selected))),
            h('span', { className: 'mep-check' },
              pendingRow ? h(BusySpinner) : selected ? h(CheckIcon) : null));
          }));
        })),
        state.catalog.status === 'ready' && filteredGroups.length === 0 && h('div', { className: 'mep-empty', role: 'status' },
          t(value?.routes.size ? 'search.empty' : 'empty.models'))),
      pane === 'effort' && h(React.Fragment, null,
        hasChoice && h('button', {
          type: 'button',
          className: 'mep-back',
          tabIndex: -1,
          disabled: state.busy,
          onClick: () => parent('effort'),
        }, h(ChevronLeftIcon, { className: 'mep-back-chevron' }), h('span', null, t('menu.effort'))),
        state.catalog.error !== null && h('div', { className: 'mep-error', role: 'alert' },
          h('span', null, t('error.action', { message: state.catalog.error })),
          h('button', { type: 'button', className: 'mep-retry', onClick: triggerReload }, t('action.reload'))),
        state.unavailable && state.catalog.error === null && h('div', { className: 'mep-warning', role: 'status' },
          h('span', null, t('error.unavailable')),
          h('button', { type: 'button', className: 'mep-retry', onClick: triggerReload }, t('retry'))),
        h('div', { className: 'mep-groups scrollable' },
          state.choice?.efforts.length
            ? state.choice.efforts.map(level => {
              const checked = level.id === state.effort?.id;
              const pendingRow = state.pending !== null
                && sameRoute(state.pending, state.choice.route)
                && state.pending.reasoningEffort === level.id;
              return h('button', {
                key: level.id,
                type: 'button',
                role: 'menuitemradio',
                'aria-checked': checked,
                className: checked ? 'mep-option mep-selected' : 'mep-option',
                disabled: state.busy,
                onClick: () => submit(() => picker.commit(state.choice.route, level.id)),
              },
              h('span', { className: 'mep-option-copy' }, h('span', { className: 'mep-model-name' }, level.name)),
              h('span', { className: 'mep-check' }, pendingRow ? h(BusySpinner) : checked ? h(CheckIcon) : null));
            })
            : state.unavailable || state.catalog.error !== null
              ? null
              : state.catalog.status === 'loading'
                ? h('div', { className: 'mep-status' }, t('status.loading'))
                : h('div', { className: 'mep-empty' }, t('empty.efforts'))))), document.body) : null;

      return h('div', {
        ref: rootRef,
        className: 'mep-root',
        onKeyDown: onRootKeyDown,
        onBlur: onRootBlur,
        onMouseDown: event => {
          if (event.target instanceof Element && event.target.closest('button') !== null) event.preventDefault();
        },
      },
      h('button', {
        ref: triggerRef,
        type: 'button',
        className: 'mep-trigger',
        style: anchorStyle,
        'aria-label': triggerAria,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? `${id}-menu` : undefined,
        title: triggerTitle,
        'aria-busy': state.busy,
        'data-selection-focus': selectionFocus ? '' : undefined,
        'data-needs-effort': state.blockKind === 'chooseEffort' ? '' : undefined,
        'data-unavailable': state.blockKind === 'unavailable' ? '' : undefined,
        onBlur: () => setSelectionFocus(false),
        disabled: locked || !state.writable,
        onClick: () => {
          if (open) {
            close(true);
          } else {
            setSelectionFocus(false);
            triggerRef.current?.focus({ preventScroll: true });
            menuRevision.current += 1;
            setQuery('');
            setHighlight(null);
            focusRequest.current = hasChoice ? null : 'drill';
            setPane(hasChoice ? 'root' : 'model');
            if (!hasChoice) setFocusTick(tick => tick + 1);
            reload();
          }
        },
      },
      h('span', { className: 'mep-trigger-icon-wrap', 'aria-hidden': true },
        h(ModelIcon, { className: 'mep-trigger-icon', size: 16 }),
        (state.blockKind === 'chooseEffort' || state.blockKind === 'unavailable')
          && h('span', { className: 'mep-trigger-dot', 'aria-hidden': true })),
      h('span', { className: 'mep-trigger-label' },
        state.displayChoice ? renderModelLabel(state.displayChoice, 'trigger', true) : modelLabel),
      effortText !== undefined
        ? h('span', { className: 'mep-trigger-effort' }, effortText)
        : state.blockKind === 'chooseEffort'
          ? h('span', { className: 'mep-trigger-effort mep-trigger-unset' }, t('effort.unset'))
          : null,
      state.busy
        ? h(BusySpinner)
        : h(ChevronDownIcon, { className: open ? 'mep-chevron mep-chevron-open' : 'mep-chevron' })),
      menu,
      toast !== null && h(Toast, {
        key: toast.seq,
        text: toast.text,
        anchorRef: rootRef,
        onDone: () => setToast(null),
      }));
    }

    const styles = `
      .mep-root {
        position: relative;
        min-width: 0;
      }

      .mep-trigger {
        anchor-name: var(--dsh-model-anchor);
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
        max-width: 360px;
        height: 28px;
        padding: 0 4px 0 8px;
        border: none;
        border-radius: var(--dsw-radius-sm);
        outline: none;
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        font-family: inherit;
        font-size: 13px;
        line-height: 20px;
        font-weight: 400;
        cursor: pointer;
      }

      @media (hover: hover) {
        .mep-trigger:hover:not(:disabled) {
          background: var(--dsw-alias-interactive-bg-hover);
        }
      }

      .mep-trigger:focus-visible:not([data-selection-focus]) {
        box-shadow: 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
      }

      .mep-trigger:disabled {
        color: var(--dsw-alias-label-dimmed);
        cursor: default;
      }

      .mep-trigger-label {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mep-trigger-effort {
        flex-shrink: 1000;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--dsw-alias-label-caption);
      }

      .mep-trigger-unset {
        color: var(--dsw-alias-state-warn-label);
      }

      .mep-trigger[data-needs-effort]:not(:disabled),
      .mep-trigger[data-unavailable]:not(:disabled) {
        background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 10%, transparent);
      }

      @media (hover: hover) {
        .mep-trigger[data-needs-effort]:hover:not(:disabled),
        .mep-trigger[data-unavailable]:hover:not(:disabled) {
          background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 16%, transparent);
        }
      }

      .mep-trigger[data-needs-effort] .mep-trigger-icon,
      .mep-trigger[data-needs-effort] .mep-chevron,
      .mep-trigger[data-unavailable] .mep-trigger-icon,
      .mep-trigger[data-unavailable] .mep-chevron {
        color: var(--dsw-alias-state-warn-label);
      }

      .mep-trigger-icon-wrap {
        position: relative;
        display: var(--dsh-composer-model-icon-display, none);
        flex: 0 0 auto;
        width: 16px;
        height: 16px;
      }

      .mep-trigger-icon {
        display: block;
      }

      .mep-trigger-dot {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 6px;
        height: 6px;
        border-radius: 999px;
        background: var(--dsw-alias-state-warn-primary);
        box-shadow: 0 0 0 1.5px var(--dsw-alias-bg-layer-1);
        pointer-events: none;
      }

      .mep-trigger-label,
      .mep-trigger-effort {
        display: var(--dsh-composer-model-text-display, block);
      }

      .mep-chevron {
        flex: 0 0 auto;
        color: var(--dsw-alias-label-caption);
        transition: transform 120ms ease;
      }

      .mep-chevron-open {
        transform: rotate(180deg);
      }

      .mep-menu {
        box-sizing: border-box;
        position: fixed;
        margin: 0;
        z-index: 1100;
        display: flex;
        flex-direction: column;
        width: fit-content;
        height: fit-content;
        min-width: min(240px, calc(100vw - 24px));
        max-width: min(420px, calc(100vw - 24px));
        max-height: min(360px, calc(100dvh - 96px));
        overflow: hidden;
        padding: 4px;
        scroll-margin-top: max(12px, var(--dsh-frame-overlay-top, 12px));
        border: 0;
        outline: none;
        border-radius: var(--dsw-radius-lg);
        --dsw-elevation-stroke-color: var(--dsw-alias-border-l1);
        box-shadow: var(--dsw-elevation-prominent);
        color: var(--dsw-alias-label-primary);
        isolation: isolate;
        --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);
        --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);
      }

      @supports (anchor-name: --mep-anchor) and (position-anchor: --mep-anchor) and (top: anchor(top)) and (right: anchor(right)) {
        .mep-menu {
          position-anchor: var(--dsh-model-anchor);
          top: max(12px, var(--dsh-frame-overlay-top, 12px));
          left: 12px;
          right: anchor(right);
          bottom: calc(anchor(top) + 8px);
          align-self: safe end;
          justify-self: safe end;
          position-try-fallbacks: --mep-window, --mep-below, --mep-wide-below, --mep-viewport;
        }
      }

      @position-try --mep-window {
        top: max(12px, var(--dsh-frame-overlay-top, 12px));
        bottom: max(12px, calc(anchor(top) + 8px));
        left: 12px;
        right: 12px;
        align-self: safe end;
        justify-self: safe end;
      }

      @position-try --mep-below {
        top: max(12px, calc(anchor(bottom) + 8px));
        bottom: 12px;
        left: 12px;
        right: anchor(right);
        align-self: start;
        justify-self: safe end;
      }

      @position-try --mep-wide-below {
        top: max(12px, calc(anchor(bottom) + 8px));
        bottom: 12px;
        left: 12px;
        right: 12px;
        align-self: start;
        justify-self: safe end;
      }

      @position-try --mep-viewport {
        inset: max(12px, var(--dsh-frame-overlay-top, 12px)) 12px 12px;
        align-self: safe start;
        justify-self: safe end;
      }

      .mep-material {
        position: absolute;
        inset: 0;
        z-index: -1;
        border-radius: inherit;
        background: var(--dsw-menu-surface-fill, var(--dsw-alias-bg-layer-1));
        backdrop-filter: var(--dsw-menu-backdrop-filter);
        -webkit-backdrop-filter: var(--dsw-menu-backdrop-filter);
        pointer-events: none;
      }

      html[data-platform='darwin'] .mep-material {
        background: var(--dsw-specific-menu, var(--dsw-alias-bg-layer-1));
      }

      @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
        .mep-material {
          background: var(--dsw-alias-bg-layer-1);
        }
      }

      .mep-status,
      .mep-empty {
        padding: 8px;
        color: var(--dsw-alias-label-tertiary);
        font-size: 12px;
        line-height: 18px;
      }

      .mep-error,
      .mep-warning {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 6px;
        margin-bottom: 3px;
        padding: 6px 7px;
        border-radius: var(--dsw-radius-md);
        background: var(--dsw-alias-interactive-bg-hover-danger);
        color: var(--dsw-alias-state-error-primary);
        font-size: 11px;
        line-height: 16px;
      }

      .mep-warning {
        background: var(--dsw-alias-bg-module-platform);
        color: var(--dsw-alias-state-warn-label);
      }

      .mep-retry {
        flex: 0 0 auto;
        padding: 0;
        border: none;
        border-radius: var(--dsw-radius-sm);
        background: transparent;
        color: inherit;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }

      .mep-retry:focus-visible {
        outline: 1.5px solid currentColor;
        outline-offset: 2px;
      }

      .mep-search-row {
        position: relative;
        flex-shrink: 0;
        margin: 2px 0 3px;
      }

      .mep-search {
        display: flex;
        height: auto;
        padding: 5px 7px;
        border: 0 solid transparent;
        border-radius: var(--dsw-radius-md);
        background: transparent;
      }

      .mep-search-with-query {
        padding-right: 34px;
      }

      .mep-search-input {
        flex: 1;
        min-width: 0;
        padding: 0;
        border: none;
        outline: none;
        background: transparent;
        color: var(--dsw-alias-label-primary);
        font-family: inherit;
        font-size: 12px;
        line-height: normal;
      }

      @media (pointer: coarse) {
        .mep-search-input {
          font-size: 16px;
        }
      }

      .mep-search-input::placeholder {
        color: var(--dsw-alias-label-caption);
      }

      .mep-search-clear {
        position: absolute;
        top: 50%;
        right: 4px;
        transform: translateY(-50%);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        padding: 0;
        border: none;
        border-radius: 50%;
        corner-shape: round;
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        cursor: pointer;
      }

      .mep-search-clear:focus-visible {
        outline: none;
        background: var(--dsw-alias-interactive-bg-hover);
      }

      @media (hover: hover) {
        .mep-search-clear:hover {
          outline: none;
          background: var(--dsw-alias-interactive-bg-hover);
        }
      }

      .mep-groups:not([hidden]) {
        min-height: 0;
        overflow-x: hidden;
        overflow-y: auto;
      }

      .mep-group {
        position: relative;
      }

      .mep-group + .mep-group {
        margin-top: 3px;
      }

      .mep-group-start {
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
      }

      .mep-group-heading {
        position: sticky;
        top: 0;
        z-index: 1;
        padding: 4px 7px 2px;
        background: transparent;
        color: var(--dsw-alias-label-tertiary);
        font-size: 11px;
        line-height: 16px;
        font-weight: 500;
      }

      .mep-group-heading[data-stuck] {
        background: var(--dsw-alias-menu-group-header-fill);
      }

      html:not([data-platform='darwin']) .mep-group-heading {
        border-radius: var(--dsw-radius-md);
      }

      .mep-option {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        gap: 6px;
        width: auto;
        min-width: 100%;
        min-height: 34px;
        padding: 5px 7px;
        border: none;
        border-radius: var(--dsw-radius-md);
        outline: none;
        background: transparent;
        color: inherit;
        font-family: inherit;
        text-align: left;
        cursor: pointer;
      }

      .mep-option:focus-visible,
      .mep-option-active:not(:disabled) {
        background: var(--dsw-alias-interactive-bg-hover);
      }

      .mep-model-option {
        max-width: 100%;
      }

      @media (hover: hover) {
        .mep-option:not(.mep-model-option):hover:not(:disabled) {
          background: var(--dsw-alias-interactive-bg-hover);
        }
      }

      .mep-selected {
        background: transparent;
      }

      .mep-option:disabled {
        color: var(--dsw-alias-label-dimmed);
        cursor: default;
      }

      .mep-option-copy {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-width: 0;
      }

      .mep-model-name {
        overflow: hidden;
        color: inherit;
        font-size: 13px;
        line-height: 18px;
        font-weight: 400;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mep-badged-name {
        display: inline-flex;
        align-items: center;
        max-width: 100%;
        gap: 4px;
        vertical-align: baseline;
        white-space: nowrap;
      }

      .mep-badged-name-text {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .mep-tag {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        corner-shape: round;
        padding: 1px 8px;
        font-size: 11px;
        line-height: 17px;
        font-weight: 500;
        white-space: nowrap;
      }

      .mep-tag[data-tone='outline'] {
        border: 0.5px solid var(--dsw-alias-border-l4);
        color: var(--dsw-alias-label-tertiary);
      }

      .mep-tag[data-tone='solid'] {
        background: var(--dsw-alias-label-primary);
        color: var(--dsw-alias-bg-layer-3);
      }

      .mep-tag[data-tone='neutral'] {
        background: var(--dsw-alias-bg-module-platform);
        color: var(--dsw-alias-label-secondary);
      }

      .mep-tag[data-tone='quiet'] {
        color: var(--dsw-alias-label-tertiary);
      }

      .mep-tag[data-tone='success'] {
        background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 10%, transparent);
        color: var(--dsw-alias-state-success-primary);
      }

      .mep-tag[data-tone='info'] {
        background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 10%, transparent);
        color: var(--dsw-alias-state-business-primary);
      }

      .mep-tag[data-tone='warning'] {
        background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 12%, transparent);
        color: var(--dsw-alias-state-warn-primary);
      }

      .mep-tag[data-tone='danger'] {
        background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);
        color: var(--dsw-alias-state-error-primary);
      }

      .mep-badge {
        flex: none;
      }

      .mep-check {
        display: grid;
        place-items: center;
        flex: 0 0 14px;
        color: var(--dsw-alias-label-primary);
      }

      .mep-check svg {
        width: 14px;
        height: 14px;
      }

      .mep-cell {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        gap: 6px;
        width: auto;
        min-width: 100%;
        height: 34px;
        padding: 0 8px;
        border: none;
        border-radius: var(--dsw-radius-md);
        background: transparent;
        color: var(--dsw-alias-label-primary);
        font-family: inherit;
        font-size: 13px;
        line-height: 20px;
        cursor: pointer;
        text-align: left;
        outline: none;
      }

      .mep-cell:focus-visible {
        background: var(--dsw-alias-interactive-bg-hover);
      }

      @media (hover: hover) {
        .mep-cell:hover:not(:disabled) {
          background: var(--dsw-alias-interactive-bg-hover);
        }
      }

      .mep-cell[data-needs-effort]:not(:disabled) {
        background: var(--dsw-alias-interactive-bg-hover);
      }

      .mep-back {
        box-sizing: border-box;
        flex: none;
        display: flex;
        align-items: center;
        gap: 4px;
        width: auto;
        min-width: 100%;
        height: 28px;
        margin-bottom: 2px;
        padding: 0 7px;
        border: none;
        border-radius: var(--dsw-radius-md);
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        font-family: inherit;
        font-size: 12px;
        line-height: 18px;
        font-weight: 500;
        cursor: pointer;
        text-align: left;
        outline: none;
      }

      @media (hover: hover) {
        .mep-back:hover:not(:disabled) {
          background: var(--dsw-alias-interactive-bg-hover);
        }
      }

      .mep-back:disabled {
        color: var(--dsw-alias-label-dimmed);
        cursor: default;
      }

      .mep-back-chevron {
        flex: 0 0 auto;
        width: 12px;
        height: 12px;
        color: var(--dsw-alias-menu-icon);
      }

      .mep-cell:disabled {
        color: var(--dsw-alias-label-dimmed);
        cursor: default;
      }

      .mep-cell-label {
        flex: 0 0 auto;
        white-space: nowrap;
      }

      .mep-cell-value {
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: right;
        color: var(--dsw-alias-label-tertiary);
      }

      .mep-cell-chevron {
        flex: 0 0 auto;
        width: 12px;
        height: 12px;
        color: var(--dsw-alias-menu-icon);
      }

      .mep-spinner {
        flex: none;
        color: var(--dsw-alias-label-tertiary);
      }

      .mep-spinner-motion {
        transform-origin: center;
        animation: mep-state-dot-spin 1.5s linear infinite;
      }

      .mep-spinner-track,
      .mep-spinner-arc {
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
      }

      .mep-spinner-track {
        opacity: 0.25;
      }

      .mep-spinner-arc {
        stroke-dasharray: 12 150;
        animation: mep-state-dot-dash 1.5s ease-in-out infinite;
      }

      @keyframes mep-state-dot-spin {
        to { transform: rotate(360deg); }
      }

      @keyframes mep-state-dot-dash {
        0% { stroke-dasharray: 12 150; stroke-dashoffset: 0; }
        50% { stroke-dasharray: 24 150; stroke-dashoffset: -6; }
        to { stroke-dasharray: 12 150; stroke-dashoffset: 0; }
      }

      @media (prefers-reduced-motion: reduce) {
        .mep-spinner-motion,
        .mep-spinner-arc {
          animation: none;
        }
        .mep-spinner-arc {
          stroke-dasharray: 18 150;
          stroke-dashoffset: -3;
        }
      }

      .mep-toast {
        position: fixed;
        top: 40px;
        left: 50%;
        z-index: 1100;
        pointer-events: none;
        display: flex;
        align-items: center;
        gap: 10px;
        width: max-content;
        max-width: min(640px, calc(100vw - 48px));
        padding: 12px 16px;
        border-radius: var(--dsw-radius-lg);
        background: var(--dsw-alias-toast-bg);
        color: var(--dsw-alias-toast-label);
        font-size: 14px;
        line-height: 22px;
        box-shadow: var(--dsw-shadow-lv3);
        transform: translate(-50%);
        animation: mep-toast-in 0.16s ease-out, mep-toast-fade 1s ease 3s forwards;
      }

      .mep-toast-icon {
        display: grid;
        place-items: center;
        flex: none;
        color: var(--dsw-alias-state-warn-label);
      }

      .mep-toast-text {
        min-width: 0;
      }

      @keyframes mep-toast-in {
        0% { opacity: 0; transform: translate(-50%, -6px); }
        to { opacity: 1; transform: translate(-50%); }
      }

      @keyframes mep-toast-fade {
        to { opacity: 0; visibility: hidden; }
      }

      @media (prefers-reduced-motion: reduce) {
        .mep-toast {
          animation: none;
        }
      }
    `;

    return {
      name: 'model-effort-picker',
      inject: ['commandUi', 'conversation', 'locale', 'remote', 'remote.session', 'sessions', 'slots', 'uiSession'],
      apply,
    };
  },
});
