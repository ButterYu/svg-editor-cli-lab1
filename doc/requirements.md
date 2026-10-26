# 作业要求对照表

本表以 `phase_cli_1.md` 的章节为索引；背景 SVG 示例用于理解格式，不视为要求实现完整 SVG 标准。后续阶段 box 的说明不属于本阶段实现清单。

| 原文章节 / 要求 | 实现与交付物 | 验证方式 |
| --- | --- | --- |
| 1.1 全程 Git、远程、分步提交 | GitHub main 的工程/领域/命令/IO/CLI/修复/测试/示例/报告/格式化历史 | 查看 commits；远程 API 同步保留每步内容范围 |
| 1.1 最终 final 标签 | GitHub `final` | 查看 tags；截止时间未提供，不能证明是否按时 |
| 1.2 Markdown 报告路径 | `doc/README.md` | 文件位置与五节结构自查 |
| 架构：模块职责与 PlantUML 图 | 报告第一节、architecture.puml | 组件图、实际目录比较 |
| 架构：Command 模式 | EditCommand、具体 Command、History | 每条编辑命令独立对象、整体 undo 测试 |
| 架构：依赖方向 | 报告规则表、架构测试 | 核心层 import 检查与抽样 |
| 架构：变化点 | 报告变化点表 | 明确预留、未预留理由和插件重构项 |
| 过程记录 | 报告第二节 | 真实错误、修正与提交相对应，不虚构学生手工操作 |
| 一致性自查 | 报告第三节 | 模块比较、依赖自动检查 |
| 质量保证 | 报告第四节、verification.md | 编译、行为测试、真实进程测试、审计与格式检查 |
| 2 提示符、注释、双引号 | Main、Tokenizer | 真实 CLI；解析中文、空文本、未闭合引号 |
| 2 唯一且大小写敏感 id | Drawing、Shape | `R` 与 `r` 并存、重复 id 错误 |
| 2 外部 SVG 自动补 id 并警告 | SvgCodec | 预先收集现有 id，rect1 已占用则分配 rect2 |
| 2 浮点坐标 | Shape、Editor.number | 小数 stroke-width；所有数值拒绝 NaN/Infinity |
| 2 error 前缀、失败原子性 | Editor.execute、History | 错误消息为单行；文档及 redo 保留 |
| 2 成功回显 | 各 Command / IO 处理器 | 交互及示例 transcript |
| 2.1 TypeScript、OO、多态、封装、一类一文件 | domain/application 各类 | 编译、结构测试、私有字段与方法审查 |
| 2.1 仅两处名字分派且标待重构 | Editor.routes、ShapeFactory.types | 报告设计模式节；importText 使用多态 |
| 2.1 Composite 统一操作 | Shape、Group、Drawing | 递归 move/scale、group、delete、set 测试 |
| 2.1 与 AI 协作 | 本聊天及过程记录 | 不编造 AI 对话或人工发现 |
| 3 init 默认/自定义 | Editor init 路由 | 默认 800×600、示例 800×600、测试 300×200 |
| 3 read/save 与默认路径 | FileStore、DrawingCodec | UTF-8、往返、缺文件、不可写、save 无参数 |
| 3 canvas 查询/修改 | Editor canvas 路由 | 查询不影响历史；修改设置屏障 |
| 3 create 六种类型、in | CreateCommand、ShapeFactory | 各类型与嵌套容器测试 |
| 3 delete 含子孙 | DeleteCommand | 子树删除及单次 undo 恢复 |
| 3 move/scale/set | 对应 Command、Shape 方法 | 各形状几何字段、递归、白名单及非法数值 |
| 3 group/ungroup/addto | 对应 Command | 顺序、跨父级、原位置展开、循环拒绝 |
| 3 front/back | OrderCommand | 同级前景在 SVG 末尾，背景在开头 |
| 3 tree/show/help | TreeRenderer、Editor | 子树、父节点、属性、完整命令帮助 |
| 3 undo/redo | History | 编辑原子单元、undo 后新编辑清 redo |
| 4.1 默认样式不写属性 | ShapeFactory、SvgCodec | SVG 无 fill 的断言 |
| 4.1 set 白名单、text 内容 | Shape.set、Text | 非法属性拒绝、文本 XML 转义、空内容 |
| 4.2 重复/缺失 id、目标容器、未知类型 | Drawing、ShapeFactory | 精确错误或 error 前缀断言 |
| 4.2 容器与子孙同时收编 | GroupCommand | 精确拒绝消息、原文档不变 |
| 4.2 根级 g 不可 ungroup | UngroupCommand | 精确错误断言 |
| 4.2 scale 非正数、无文档、IO 失败 | ScaleCommand、Editor、NodeFileStore | 精确错误断言 |
| 4.3 IO 屏障 | History.barrier | init/read/save/canvas 修改后禁 undo/redo |
| 4.4 box 插件 | 明确排除 | create box 报 unknown shape type，不实现后续语义 |
| 5 tree/show 内容 | TreeRenderer | 结构线、几何字段、样式、父容器、文本；不要求固定列宽 |
| 6 典型会话、other.svg | examples/other.svg；功能测试组合覆盖 | read 后 warning、几何和层级读回 |
| 6.1 版本 A 两节点流程图 | examples/flowchart.txt、SVG、transcript | 真 stdin 回放、8 元素、undo 后节点 y=100 |
| 6.1 版本 B | 后续阶段示意 | 明确不作为本次必须实现的功能 |

注意：作业错误表中的“ungroup 复合图形”依赖尚未实现的 box 类型，本阶段不存在该领域对象，因此不伪造一个不可达功能来声称覆盖。
