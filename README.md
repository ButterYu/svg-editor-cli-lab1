# SVG 编辑器 CLI · Phase 1

TypeScript 面向对象课程项目。架构与作业报告见 [doc/README.md](doc/README.md)。

## 运行

需要 Node.js 22、npm。执行 `npm ci`，然后 `npm run cli`。输入 `help` 查看命令，Ctrl+D（Windows 可用 Ctrl+Z 后回车）结束。

执行 `npm run check` 完成编译、测试和格式检查。执行 `npm run cli < examples/flowchart.txt` 可回放示例（PowerShell 使用 `Get-Content examples/flowchart.txt | npm run cli`）。

本阶段支持 rect、circle、ellipse、line、text、g；box 为后续阶段目标。
