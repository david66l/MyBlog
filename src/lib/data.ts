import type { Article, Category, Project, Topic } from "./types";

export const siteConfig = {
  name: "Louis.dev",
  tagline: "Personal area — AI, space, and biology.",
  author: "Louis",
  email: "hello@louis.dev",
};

export const stats = [
  { value: "16+", label: "文章" },
  { value: "9", label: "专题" },
  { value: "3", label: "开源项目" },
];

export const topics: Topic[] = [
  {
    slug: "astrobiology",
    icon: "🧬",
    title: "天体生物学",
    description: "生命起源、地外生命探测与宇宙中的宜居环境",
  },
  {
    slug: "exoplanets",
    icon: "🪐",
    title: "系外行星",
    description: "宜居带、大气光谱与生物特征信号",
  },
  {
    slug: "extremophiles",
    icon: "🦠",
    title: "极端微生物",
    description: "热泉、冰下海洋与火星类比环境",
  },
  {
    slug: "ai-agent",
    icon: "🤖",
    title: "AI Agent 框架",
    description: "LangChain、CrewAI、AutoGen 实战",
  },
  {
    slug: "llm",
    icon: "🧠",
    title: "大模型应用",
    description: "RAG、Function Call、Prompt Engineering",
  },
  {
    slug: "toolchain",
    icon: "⚙️",
    title: "工具链",
    description: "MCP、向量数据库、Agent 工具开发",
  },
  {
    slug: "engineering",
    icon: "🔧",
    title: "工程实践",
    description: "架构设计、部署、监控",
  },
  {
    slug: "reading",
    icon: "📖",
    title: "读书笔记",
    description: "技术书籍精读与思考",
  },
  {
    slug: "thoughts",
    icon: "💭",
    title: "随笔思考",
    description: "对 AI 行业的观察",
  },
];

export const categoryFilters: { slug: Category | "all"; label: string }[] = [
  { slug: "all", label: "全部" },
  { slug: "ai-agent", label: "AI Agent" },
  { slug: "llm", label: "大模型" },
  { slug: "engineering", label: "工程实践" },
  { slug: "reading", label: "读书笔记" },
  { slug: "thoughts", label: "随笔" },
  { slug: "astrobiology", label: "天体生物学" },
  { slug: "exoplanets", label: "系外行星" },
  { slug: "extremophiles", label: "极端微生物" },
];

export const articles: Article[] = [
  {
    slug: "multi-agent-orchestration",
    title: "多 Agent 协作编排：从理论到生产实践",
    excerpt:
      "深入探讨 Multi-Agent 系统的架构模式、通信协议与故障恢复策略，附带 CrewAI 与 LangGraph 对比。",
    category: "ai-agent",
    categoryLabel: "AI Agent",
    date: "2025-05-28",
    readTime: "12 min",
    coverGradient: "from-blue-950/80 via-slate-900 to-black",
    content: `## 为什么需要多 Agent

单一 Agent 在处理复杂任务时容易陷入上下文膨胀与能力边界。Multi-Agent 通过角色分工，将「规划」「执行」「验证」解耦。

\`\`\`python
from crewai import Agent, Task, Crew

researcher = Agent(
    role="Research Analyst",
    goal="Gather accurate technical information",
    backstory="Expert in AI systems architecture",
)

writer = Agent(
    role="Technical Writer",
    goal="Produce clear, actionable documentation",
    backstory="Specializes in developer-facing content",
)
\`\`\`

## 编排模式

1. **Sequential** — 流水线式，适合有明确依赖的任务链
2. **Hierarchical** — Manager Agent 分配子任务
3. **Parallel** — 独立子任务并发执行，最后聚合

## 生产环境考量

- 超时与重试策略
- Agent 间状态持久化
- 可观测性：trace 每个 Agent 的 token 消耗与决策路径`,
  },
  {
    slug: "rag-production-guide",
    title: "RAG 生产级部署完整指南",
    excerpt:
      "向量检索、重排序、混合搜索与评估框架的系统化梳理，帮你避开 90% 的 RAG 踩坑。",
    category: "llm",
    categoryLabel: "大模型",
    date: "2025-05-20",
    readTime: "18 min",
    coverGradient: "from-indigo-950/80 via-slate-900 to-black",
    content: `## RAG 不是「Embedding + 向量库」那么简单

生产级 RAG 需要完整的检索链路：query rewrite → hybrid search → rerank → context compression。

\`\`\`typescript
const results = await vectorStore.similaritySearch(query, {
  k: 20,
  filter: { tenantId: user.tenant },
});

const reranked = await reranker.rerank(query, results, { topK: 5 });
\`\`\`

## 评估指标

| 指标 | 含义 |
|------|------|
| Recall@K | 检索阶段是否找到相关文档 |
| Faithfulness | 生成内容是否忠于检索上下文 |
| Answer Relevance | 回答是否解决用户问题 |`,
  },
  {
    slug: "mcp-tool-development",
    title: "MCP 协议与 Agent 工具开发实战",
    excerpt:
      "Model Context Protocol 如何让 LLM 安全、标准化地调用外部工具，附完整 MCP Server 示例。",
    category: "toolchain",
    categoryLabel: "工具链",
    date: "2025-05-12",
    readTime: "15 min",
    coverGradient: "from-cyan-950/80 via-slate-900 to-black",
    content: `## MCP 是什么

MCP（Model Context Protocol）是 Anthropic 推出的开放协议，让 AI 应用以统一方式连接数据源与工具。

\`\`\`json
{
  "name": "search_docs",
  "description": "Search internal documentation",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" }
    }
  }
}
\`\`\`

## 设计原则

- 工具粒度：一个工具做一件事
- 输入 schema 要精确，减少 LLM 幻觉
- 返回结构化数据，便于 Agent 解析`,
  },
  {
    slug: "agent-observability",
    title: "Agent 系统可观测性：Trace、Metrics、Eval",
    excerpt:
      "如何为 Agent 应用建立完整的监控体系，从 LangSmith 到自建 OpenTelemetry 方案。",
    category: "engineering",
    categoryLabel: "工程实践",
    date: "2025-05-05",
    readTime: "10 min",
    coverGradient: "from-emerald-950/80 via-slate-900 to-black",
    content: `## 为什么 Agent 比普通 API 更难监控

Agent 的执行路径是非确定性的。同一个输入可能走完全不同的 tool call 链路。

## 三层可观测性

1. **Trace** — 完整调用链，含 LLM 输入输出
2. **Metrics** — latency、token 消耗、tool 成功率
3. **Eval** — 离线评估集 + 在线 A/B 对比`,
  },
  {
    slug: "designing-data-intensive-apps-notes",
    title: "《Designing Data-Intensive Applications》精读笔记",
    excerpt: "第三章：Storage and Retrieval — 从 B-Tree 到 LSM-Tree 的存储引擎演进。",
    category: "reading",
    categoryLabel: "读书笔记",
    date: "2025-04-28",
    readTime: "8 min",
    coverGradient: "from-amber-950/80 via-slate-900 to-black",
    content: `## 核心观点

数据系统的三个根本需求：**Reliability**、**Scalability**、**Maintainability**。

存储引擎的选择取决于读写模式：OLTP 偏向 B-Tree，写密集型场景 LSM-Tree 更优。`,
  },
  {
    slug: "ai-agent-market-2025",
    title: "2025：Agent 元年的冷静观察",
    excerpt: "框架大战、垂直 Agent 与平台化趋势 — 一些不那么 hype 的行业思考。",
    category: "thoughts",
    categoryLabel: "随笔",
    date: "2025-04-15",
    readTime: "6 min",
    coverGradient: "from-violet-950/80 via-slate-900 to-black",
    content: `## 框架会收敛，场景不会

LangChain、CrewAI、AutoGen 各有拥趸，但真正的壁垒在**领域数据**与**工作流设计**，不在框架选型。

## 我的判断

- 通用 Agent 平台 → 基础设施层竞争
- 垂直 Agent → 产品层机会更大
- MCP 会成为工具集成的 HTTP`,
  },
  {
    slug: "astrobiology-field-guide",
    title: "天体生物学入门：我们在宇宙里找什么",
    excerpt:
      "从 Drake 方程到「生命需要什么」—— 天体生物学如何把化学、地质与观测串成一条可检验的推理链。",
    category: "astrobiology",
    categoryLabel: "天体生物学",
    date: "2025-05-30",
    readTime: "11 min",
    coverGradient: "from-zinc-950/80 via-slate-900 to-black",
    content: `## 天体生物学在问什么

它不是科幻，而是一组可证伪的问题：**生命能否在地球以外产生？若产生，会留下什么可观测痕迹？**

核心假设是：地球上的生命遵循同样的物理化学规律，因此在类似条件下，生命或前生命化学有可能重复出现。

## 三条研究主线

1. **起源** — 从简单分子到自复制系统的过渡
2. **演化** — 极端环境下的适应与代谢多样性
3. **分布** — 太阳系天体与系外行星上的宜居性与生物特征

## 为什么和 AI 同站

太空生物学产生海量光谱、图像与文献；RAG 与 Agent 正在变成整理假设、比对观测数据的日常工具 — 这也是本站把 orbit、biology 与 engineering 放在一起的原因。`,
  },
  {
    slug: "europa-subsurface-ocean",
    title: "木卫二冰下海洋：太阳系最诱人的生物实验室",
    excerpt:
      "潮汐加热、冰壳厚度与 plume 观测 — 为什么 Europa Clipper 任务可能改写我们对地外生命的预期。",
    category: "astrobiology",
    categoryLabel: "天体生物学",
    date: "2025-05-22",
    readTime: "14 min",
    coverGradient: "from-slate-950/80 via-zinc-900 to-black",
    content: `## 冰下不是死寂

木卫二（Europa）表面是裂缝纵横的冰壳，底下却可能藏着**全球性的咸水海洋**。潮汐力来自木星引力，持续为内部提供热量。

## 关键科学问题

- 冰壳有多厚？是否允许 ocean 与表面交换物质？
- 海底是否存在热液活动，类似地球深海热泉？
- 羽流（plume）能否被飞掠任务采样到有机分子？

## 任务时间线

NASA **Europa Clipper** 已启程，目标不是「找到外星人」，而是判断：**这个环境是否具备已知生命所需的化学与能量条件**。

若检测到复杂有机分子与氧化还原梯度共存，木卫二将从「有趣」升级为「必须优先跟进」。`,
  },
  {
    slug: "exoplanet-biosignatures-jwst",
    title: "系外行星生物特征：JWST 时代的新窗口",
    excerpt:
      "O₂、CH₄、PH₃ 的组合为何需要地质背景 — 用传输光谱区分「真生命信号」与「假阳性」。",
    category: "exoplanets",
    categoryLabel: "系外行星",
    date: "2025-05-18",
    readTime: "13 min",
    coverGradient: "from-neutral-950/80 via-slate-900 to-black",
    content: `## 生物特征 ≠ 单一气体

早期媒体爱说「发现氧气就是生命」。天体生物学更谨慎：**任何生物特征都必须与行星地质、恒星活动一起解释**。

## 经典组合与陷阱

| 信号 | 可能来源 |
|------|------|
| O₂ + CH₄ | 生命代谢（需排除非生物光化学） |
| 仅 O₂ | 水分解、失控温室 |
| PH₃ | 厌氧生态（地球上有，金星上争议大） |

## JWST 改变了什么

对近距 M 矮星周围 rocky 行星，**传输光谱**分辨率足以分辨 CO₂、H₂O、CH₄ 等吸收线。下一步是时间序列：季节变化、恒星耀斑后的大气响应。

系外行星研究正在从「数行星」进入「读大气化学」阶段。`,
  },
  {
    slug: "extremophiles-mars-analogs",
    title: "极端微生物与火星类比站点：在地球上预演外星生命",
    excerpt:
      "Atacama、McMurdo 干谷、深海热泉 — 这些「不像地球」的地方如何约束火星与 icy moon 上的 habitability。",
    category: "extremophiles",
    categoryLabel: "极端微生物",
    date: "2025-05-10",
    readTime: "10 min",
    coverGradient: "from-stone-950/80 via-slate-900 to-black",
    content: `## 极端不是边缘案例

嗜盐菌、嗜热菌、辐射耐受菌证明：**生命需要的不是「地球平均环境」，而是局部稳定的化学梯度**。

## 常用 Mars-analog 场地

- **Atacama Desert** — 极低湿度，测试「几乎无水仍能否检测到微生物」
- **Rio Tinto / 酸性热泉** — 高铁酸性水体，类比早期火星表面化学
- **Antarctic dry valleys** — 低温、高 UV，类似火星中纬度

## 对任务设计的意义

若类比站点能在「公认不宜居」条件下仍发现活跃代谢，则探测器灵敏度与采样策略必须重新校准 — **阴性结果才更有说服力**。

极端微生物研究是连接实验室化学与深空任务的桥梁。`,
  },
];

export const projects: Project[] = [
  {
    name: "agent-kit",
    description: "轻量级 Multi-Agent 编排框架，支持 LangGraph 与 CrewAI 互操作",
    stars: 342,
    url: "https://github.com",
    tags: ["Python", "LangGraph", "Agent"],
  },
  {
    name: "mcp-toolshed",
    description: "常用 MCP Server 集合：GitHub、Notion、PostgreSQL、Slack",
    stars: 128,
    url: "https://github.com",
    tags: ["TypeScript", "MCP"],
  },
  {
    name: "rag-eval",
    description: "RAG 评估工具包，内置 Recall/Faithfulness/Relevance 指标",
    stars: 89,
    url: "https://github.com",
    tags: ["Python", "RAG", "Eval"],
  },
];

export const skills = [
  "LangChain",
  "LangGraph",
  "CrewAI",
  "RAG",
  "MCP",
  "Python",
  "TypeScript",
  "Next.js",
  "Vector DB",
  "Prompt Engineering",
];

export const currentlyLearning = [
  "Multi-Agent 系统的形式化验证",
  "Agent 记忆架构（长期 / 工作记忆分离）",
  "OpenTelemetry for LLM Applications",
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

/** @deprecated Use `@/lib/api` — kept for api seed script only */
export function getArticlesByCategory(category: Category | "all"): Article[] {
  if (category === "all") return articles;
  return articles.filter((a) => a.category === category);
}

export function getAdjacentArticles(slug: string): {
  prev: Article | null;
  next: Article | null;
} {
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? articles[index - 1] : null,
    next: index < articles.length - 1 ? articles[index + 1] : null,
  };
}
