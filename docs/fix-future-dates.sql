-- 修复未来 published_at：钳制到该行真实创建日期 created_at
-- 背景：414 行 published_at 为未来日期（最远 2026-10-28），导致 sitemap/JSON-LD
-- 出现“未来才发布”，损害 Google 信任、拖慢索引。created_at 均为过去（真实写入时间）。
-- 在 Supabase → SQL Editor 运行。
BEGIN;

UPDATE pitfallfree_guides
SET published_at = created_at,
    updated_at = now()
WHERE published_at::date > CURRENT_DATE;

-- 同步钳制任何未来的 lastmod（当前为 0，幂等保险）
UPDATE pitfallfree_guides
SET lastmod = created_at,
    updated_at = now()
WHERE lastmod IS NOT NULL
  AND lastmod::date > CURRENT_DATE;

COMMIT;
