# 选购/测评公众号发现（logicbuy）

为 logicbuy 双语选购/踩坑指南站搭建的**公众号发现**脚手架。参考 chinatravel 的成熟流水线
（`chinatravel/scripts/wechat/`），本目录**当前只落地「发现」环节**：把精选公众号名解析成
wxid、并按关键词发现更多候选，沉淀一份「粉丝多、更新勤、质量高」的名单，供**后续**的
采集→聚类→DeepSeek 合成双语原创→落库 Supabase→Pexels 配图流水线使用。

> ⚠️ 只在本地跑，绝不上 Vercel（数据中心 IP 会被采集源封）。凭证在 gitignored `.env`，勿提交。

## 前置

- Node 18+（零依赖，原生 fetch）。
- `cimidata/.env` — `CIMIDATA_APP_ID` / `CIMIDATA_APP_SECRET`（采集凭证，见 `cimidata/README.md`）。
- `.env` — `PEXELS_API_KEY`（配图，给文章插图用；发现环节不需要）。

## 用法

```bash
# 0) 精选公众号名 → wxid（一次性，含限频重试）。产物 accounts.json（提交入库）
node scripts/wechat/accounts.mjs
#    打开 accounts.json 人工核对，剔除错配/同名/低质号，必要时从 candidates 改 wxid

# 0') 关键词发现更多候选号，人工筛后补进 accounts.mjs 的 ACCOUNT_NAMES
node scripts/wechat/discover.mjs
node scripts/wechat/discover.mjs --keywords "扫地机,空气炸锅,降噪耳机"
```

## 公众号名单（accounts.mjs）

`ACCOUNT_NAMES` 是**人工精选**的选购/测评/避坑/数码家电/家居/母婴/个护号。
`searchAccounts` API 只返回 nickname/wxid/biz/description，**不返回粉丝数/更新频率**——
"粉丝多、更新勤、质量高"靠这份种子名单保证。**务必跑完 `accounts.json` 后人工核对**，
用 `discover.mjs` 关键词发现补充候选。

## 目录

```
scripts/wechat/
├── cimidata/            采集 API 客户端（零依赖，整目录从 chinatravel 复制）
├── lib/env.mjs          共享 .env 加载 + DATA_DIR + ACCOUNTS_FILE
├── accounts.mjs         0) 精选号 → 解析 wxid
├── discover.mjs         0') 关键词发现更多候选号
├── accounts.json        0) 产物（提交入库，供复核/CI）
└── data/                产物（gitignored）：discovered-accounts.json 等
```

## 下一轮（Deferred）

完整采集→合成→发布流水线移植（适配 Supabase `pitfallfree_guides`、双语、选购语境
prompt、Pexels 配图）。参考 `chinatravel/scripts/wechat/` 的 `1-crawl`/`2-cluster`/
`3-synthesize`/`4-publish` + `lib/`。
