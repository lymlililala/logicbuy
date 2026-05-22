-- ============================================================
-- PitfallFree — 建表 SQL
-- 在 Supabase SQL Editor 执行:
--   https://supabase.com/dashboard/project/tixgzezefjjsyuzgdhcd/sql/new
--
-- 说明:
--   表名前缀 pitfallfree_ 避免与其他项目（如 tools_articles）重名
-- ============================================================

-- 1. 创建 pitfallfree_guides 表
CREATE TABLE IF NOT EXISTS pitfallfree_guides (
  id            BIGSERIAL     PRIMARY KEY,
  slug          TEXT          NOT NULL UNIQUE,  -- URL slug，例如: how-to-choose-mattress-specs
  title         TEXT          NOT NULL,
  summary       TEXT          NOT NULL DEFAULT '',
  tags          TEXT[]        NOT NULL DEFAULT '{}',
  layout        TEXT          NOT NULL DEFAULT 'PostLayout',
  published_at  DATE          NOT NULL,
  lastmod       DATE,
  draft         BOOLEAN       NOT NULL DEFAULT false,
  authors       TEXT[]        NOT NULL DEFAULT '{default}',
  content       TEXT          NOT NULL,          -- MDX 正文（去除 frontmatter）
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- 2. 索引
CREATE INDEX IF NOT EXISTS idx_pitfallfree_guides_slug
  ON pitfallfree_guides (slug);

CREATE INDEX IF NOT EXISTS idx_pitfallfree_guides_tags
  ON pitfallfree_guides USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_pitfallfree_guides_published_at
  ON pitfallfree_guides (published_at DESC);

-- 3. 开启行级安全
ALTER TABLE pitfallfree_guides ENABLE ROW LEVEL SECURITY;

-- 4. 允许匿名读取（公开博客）
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'pitfallfree_guides'
      AND policyname = 'pitfallfree_guides_public_read'
  ) THEN
    CREATE POLICY pitfallfree_guides_public_read
      ON pitfallfree_guides FOR SELECT TO anon USING (true);
  END IF;
END $$;

-- 5. 验证（建表后可选执行）
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pitfallfree_guides'
ORDER BY ordinal_position;
