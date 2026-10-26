# 验证记录

验证日期：2026-10-26（Asia/Shanghai）。执行者：AI 助手。课程截止时间未提供。

## 本地验证结果

| 检查                | 实际结果     | 说明                                                                                    |
| ------------------- | ------------ | --------------------------------------------------------------------------------------- |
| 全新依赖安装        | 通过         | 在独立工作目录复制 package.json/package-lock.json，执行 npm ci，未复用项目 node_modules |
| TypeScript 严格编译 | 通过         | tsc；strict 与 noUncheckedIndexedAccess 开启                                            |
| 自动化测试          | 11/11 通过   | 领域、CLI 行为、历史、错误、SVG、文件系统、真实 stdin 子进程、核心依赖方向              |
| 格式检查            | 通过         | Prettier 检查 src、test、doc、根 README 和配置                                          |
| 依赖审计            | 0 个已知漏洞 | npm audit --audit-level=low；该结果是验证时的注册表结果                                 |
| 流程图回放          | 通过         | 保存 8 个元素，中文内容为“处理数据 v2”，undo 后右节点 y=100                             |
| 图形可读性          | 已检查       | SVG 栅格预览检查节点、文字和位置；PlantUML 图补白色背景并分行，避免深色背景下文字不可读 |

11 项测试可通过 `npm test` 查看名称。它们包括多条断言，不能把 11 误写成 11 条命令或 11 个功能。

## 环境与可复现说明

本机实际 Node 为 v24.22.1；项目面向 Node 22，GitHub CI 使用 Node 22 与 Ubuntu。环境没有全局 npm，因此使用临时 npm 10.9.2 工具调用同一脚本，并把缓存放在工作区。项目依赖只包含 XML 解析器、TypeScript、Prettier 与 Node 类型声明；临时 npm 工具不进入锁文件。

隔离安装执行的核心命令与普通机器一致：

```sh
npm ci
npm run check
npm audit --audit-level=low
```

图示渲染用 PlantUML 官方服务生成 SVG，源文件与结果均提交；运行 CLI 不需要该服务。交付包不含 node_modules 和 dist，依赖安装后通过 tsc 生成 dist。

## 审查提示

- 先阅读 doc/README.md 的依赖方向，再查看 domain、application、infrastructure、cli。
- 编辑命令在候选文档上执行；检查失败时是否可能改变原树及 redo。
- group 与 addto 需要拒绝循环；ungroup 的根级限制来自作业，并非遗漏。
- 检查最终 GitHub Actions 运行和 final 标签，不把本地通过误称为远程通过。
- 本项目的外部 SVG 支持范围和历史快照性能限制已在报告列明。
