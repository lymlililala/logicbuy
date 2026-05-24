-- ============================================================
-- LogicBuy — 表结构迁移：添加 locale 多语言支持
-- 在 Supabase SQL Editor 执行:
--   https://supabase.com/dashboard/project/tixgzezefjjsyuzgdhcd/sql/new
-- ============================================================

-- Step 1: 添加 locale 列（默认 'zh'，避免现有行报错）
ALTER TABLE pitfallfree_guides
  ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'zh';

-- Step 2: 将已有的英文文章（从 MDX 文件上传的）更新为 locale='en'
-- 这些 slug 对应原有的两篇英文文章
UPDATE pitfallfree_guides
SET locale = 'en'
WHERE slug IN (
  'how-to-choose-mattress-specs',
  'how-to-choose-robot-vacuum-specs'
);

-- Step 3: 删除旧的单列唯一约束
ALTER TABLE pitfallfree_guides
  DROP CONSTRAINT IF EXISTS pitfallfree_guides_slug_key;

-- Step 4: 添加复合唯一约束 (slug, locale)
ALTER TABLE pitfallfree_guides
  ADD CONSTRAINT pitfallfree_guides_slug_locale_key
  UNIQUE (slug, locale);

-- Step 5: 更新索引
DROP INDEX IF EXISTS idx_pitfallfree_guides_slug;
CREATE UNIQUE INDEX IF NOT EXISTS idx_pitfallfree_guides_slug_locale
  ON pitfallfree_guides (slug, locale);

-- 添加 locale 过滤索引
CREATE INDEX IF NOT EXISTS idx_pitfallfree_guides_locale
  ON pitfallfree_guides (locale);

-- Step 6: 验证
SELECT slug, locale, title, published_at
FROM pitfallfree_guides
ORDER BY locale, published_at
LIMIT 20;
