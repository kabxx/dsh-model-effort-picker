# @kabxx/dsh-model-effort-picker

面向 DeepSeek Harness（`>= 0.2.2-rc.5`）Web 端的模型选择器插件，替换内置模型菜单并移除推理等级中的 `Default` 选项，在多档推理模型上要求显式选定等级后再发送消息。

- **输入框模型菜单**：无推理模型直接切换，单档模型自动选中唯一推理等级；多档模型先进入未选档状态并暂停发送，选定具体推理等级后再一并保存模型与等级。选定模型或推理等级后均返回上一级菜单，便于连续查看或调整同级选项。
- **`/model` 斜杠命令**：无推理与单档模型直接生效；多档模型自动弹出第二层命令菜单选择推理等级，按 `Esc` 或点击外部取消时保留原模型配置。
- **旧会话与目录变更迁移**：当历史会话缺少显式推理等级时，单档模型会在会话恢复或发送前自动为当前会话补齐唯一等级，模型关闭推理能力后的残留档位也会自动清理；多档模型以及已从目录移除的未选档模型在 Web 前端保持发送拦截，等待显式选择。

## 安装

需要 Node.js `>= 24.9.0`：

```bash
dsh plugin --profile web add @kabxx/dsh-model-effort-picker
```

也可在 DSH 插件管理器中选择「添加插件」并输入 `@kabxx/dsh-model-effort-picker`（若使用其他配置档案，将 `--profile web` 替换为对应档案名）。本地调试源码时，直接填入克隆后的仓库目录绝对路径或执行 `dsh plugin --profile web add .` 即可。

> 本插件包会通过 `cordis.patch.yml` 停用内置的 `ui-model-selection`。如需恢复 DSH 默认模型选择器，请在插件管理器中**停用或卸载整个插件包**（请勿仅单独关闭 `model-effort-picker` 行，否则会导致两个选择器同时停用）。

## 开发

无需构建步骤，直接运行语法检查与打包校验：

```bash
npm run check
npm pack --dry-run
```

## 项目结构

| 路径 | 内容 |
| --- | --- |
| [`src/index.js`](src/index.js) | Host 入口，监听模型目录与会话生命周期，为单档或关闭推理的旧会话自动修正显式等级 |
| [`src/client.js`](src/client.js) | Web 端替代模型选择器、`/model` 二级推理等级菜单、未选档发送拦截与 8 国语言词条 |
| [`locale/`](locale/) | 插件管理页中英文标题与描述 |

插件入口与注入配置见 [package.json](package.json) 和 [cordis.patch.yml](cordis.patch.yml)。
