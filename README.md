# SVG 编辑器 CLI · Phase 1

TypeScript 面向对象课程项目。架构与作业报告见 [doc/README.md](doc/README.md)。

原 26 个提交的构建与测试回放见 [逐提交核验](doc/history-audit/README.md)，本次新增提交的实际 CI 见 [CI 对照](doc/follow-up-ci.md)。这是事后补做，原提交及失败记录均保留。

## 运行

需要 Node.js 22、npm。执行 `npm ci`，然后 `npm run cli`。输入 `help` 查看命令，Ctrl+D（Windows 可用 Ctrl+Z 后回车）结束。

执行 `npm run check` 完成编译、测试和格式检查。执行 `npm run cli < examples/flowchart.txt` 可回放示例（PowerShell 使用 `Get-Content examples/flowchart.txt | npm run cli`）。

本阶段支持 rect、circle、ellipse、line、text、g；box 为后续阶段目标。
