-- logicbuy_wx_sources：公众号源文池。nightly 每轮把抓到的源文（标题级）落库，
-- 聚类改为读「库内最近 N 天」的源文池（跨号跨天，簇质量更高）。正文懒加载：
-- 某源文首次被选中合成时才拉正文并回填 body_text，下次复用、不重复读取。
-- 表名带 logicbuy_ 前缀，避免与共用 Supabase 项目里其他站点的表撞名。内部表、不对外公开。

CREATE TABLE IF NOT EXISTS logicbuy_wx_sources (
  sn            TEXT          PRIMARY KEY,   -- 公众号文章 URL 里的 sn（唯一标识）
  account       TEXT,                        -- 来源公众号昵称
  wxid          TEXT,                        -- 公众号 wxid
  title         TEXT,                        -- 源文标题
  content_url   TEXT,                        -- 文章链接
  published_at  TEXT,                        -- cimidata 原始发布时间（provenance）
  body_text     TEXT,                        -- 正文纯文本（懒加载，首次合成时回填）
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()  -- 入库时间，用于「最近 N 天」窗口
);

CREATE INDEX IF NOT EXISTS idx_logicbuy_wx_sources_created_at
  ON logicbuy_wx_sources (created_at DESC);

-- 内部表：开启 RLS 且不建任何 anon 策略 → 匿名读不到；service role 绕过 RLS 正常读写。
ALTER TABLE logicbuy_wx_sources ENABLE ROW LEVEL SECURITY;
