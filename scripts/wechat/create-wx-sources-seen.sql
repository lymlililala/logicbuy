-- logicbuy_wx_sources_seen：记录已被 nightly 流水线「消费过」的公众号源文 sn，用于跨轮去重，
-- 避免重复读取/重复从同一篇源文合成。仅内部使用（service role 读写），不对外公开。
-- 表名带 logicbuy_ 前缀，避免与共用 Supabase 项目里其他站点的表撞名。

CREATE TABLE IF NOT EXISTS logicbuy_wx_sources_seen (
  sn            TEXT          PRIMARY KEY,   -- 公众号文章 URL 里的 sn（唯一标识）
  account       TEXT,                        -- 来源公众号昵称
  title         TEXT,                        -- 源文标题（备查/合规）
  used_in_slug  TEXT,                        -- 被合成进了哪篇成品（provenance）
  first_seen    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logicbuy_wx_sources_seen_first_seen
  ON logicbuy_wx_sources_seen (first_seen DESC);

-- 内部表：开启 RLS 且不建任何 anon 策略 → 匿名读不到；service role 绕过 RLS 正常读写。
ALTER TABLE logicbuy_wx_sources_seen ENABLE ROW LEVEL SECURITY;
