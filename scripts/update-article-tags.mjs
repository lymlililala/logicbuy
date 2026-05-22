#!/usr/bin/env node
/**
 * update-article-tags.mjs
 *
 * 按照新的 8 大品类分类体系，批量更新数据库中 58 篇文章的 tags。
 * tags 格式: [大类slug, 子类slug, ...额外关键词]
 *
 * Usage:
 *   node scripts/update-article-tags.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tixgzezefjjsyuzgdhcd.supabase.co'
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

/**
 * 新分类体系 tags 格式: [大类, 子类, 细分]
 *
 * 大类 slugs:
 *   tech-electronics       💻 数码与电子产品
 *   home-appliances        🏠 智能家电
 *   home-renovation        🛋️ 家居与硬装建材
 *   skincare-personal-care 🧴 科学护肤与个护
 *   pet-care               🐾 科学养宠
 *   baby-maternity         🍼 母婴与育儿
 *   outdoors-fitness       🏕️ 户外与运动
 *   life-decisions         📋 生活决策与避坑清单
 *
 * 子类 slugs:
 *   computers-peripherals / home-audio-video / mobile-wearables
 *   cleaning-appliances / kitchen-appliances / climate-control
 *   furniture / building-materials / bath-hardware
 *   skincare-science / personal-care-devices
 *   pet-diet / pet-supplies
 *   travel-gear / feeding-sleeping
 *   outdoor-gear / home-gym
 *   renting / used-goods
 */

const ARTICLE_TAGS = {
  // ── 💻 数码与电子产品 ────────────────────────────────────────────────────
  'monitor-panel-guide-ips-va-oled': [
    'tech-electronics', 'computers-peripherals', 'monitors', 'display-panels',
  ],
  'laptop-performance-tdp-guide': [
    'tech-electronics', 'computers-peripherals', 'laptops', 'performance',
  ],
  'mechanical-keyboard-switch-guide': [
    'tech-electronics', 'computers-peripherals', 'mechanical-keyboards', 'switches',
  ],
  'tv-buying-guide-miniled-oled': [
    'tech-electronics', 'home-audio-video', 'televisions', 'display-panels',
  ],
  'projector-guide-light-source-brightness': [
    'tech-electronics', 'home-audio-video', 'projectors', 'light-source',
  ],
  'home-audio-theater-buying-guide': [
    'tech-electronics', 'home-audio-video', 'audio-systems', 'home-theater',
  ],
  'smartphone-guide-processor-battery-charging': [
    'tech-electronics', 'mobile-wearables', 'smartphones', 'battery-charging',
  ],
  'phone-screen-eye-care-pwm-dc-dimming': [
    'tech-electronics', 'mobile-wearables', 'smartphones', 'eye-care',
  ],
  'noise-cancelling-headphone-anc-audio-guide': [
    'tech-electronics', 'mobile-wearables', 'anc-headphones', 'audio-codec',
  ],
  'smartwatch-guide-fitness-health-monitoring': [
    'tech-electronics', 'mobile-wearables', 'smartwatches', 'health-monitoring',
  ],
  'gaming-monitor-peripherals-guide': [
    'tech-electronics', 'computers-peripherals', 'monitors', 'gaming',
  ],
  'digital-camera-guide-sensor-lens-mount': [
    'tech-electronics', 'mobile-wearables', 'cameras', 'sensor-lens',
  ],
  'kids-learning-tablet-buying-guide': [
    'tech-electronics', 'mobile-wearables', 'tablets', 'kids',
  ],

  // ── 🏠 智能家电 ──────────────────────────────────────────────────────────
  'robot-vacuum-navigation-guide': [
    'home-appliances', 'cleaning-appliances', 'robot-vacuums', 'navigation',
  ],
  'floor-washer-buying-guide': [
    'home-appliances', 'cleaning-appliances', 'wet-dry-vacuums', 'floor-washer',
  ],
  'refrigerator-buying-guide-cooling-system': [
    'home-appliances', 'kitchen-appliances', 'refrigerators', 'cooling-system',
  ],
  'water-purifier-guide-ro-ultrafiltration': [
    'home-appliances', 'kitchen-appliances', 'water-purifiers', 'ro-filter',
  ],
  'espresso-machine-guide-pump-pid': [
    'home-appliances', 'kitchen-appliances', 'coffee-makers', 'pump-pid',
  ],
  'dishwasher-buying-guide': [
    'home-appliances', 'kitchen-appliances', 'dishwashers', 'wash-performance',
  ],
  'air-conditioner-guide-energy-efficiency-refrigerant': [
    'home-appliances', 'climate-control', 'air-conditioners', 'energy-efficiency',
  ],
  'dehumidifier-humidifier-buying-guide': [
    'home-appliances', 'climate-control', 'dehumidifiers-humidifiers', 'humidity',
  ],
  'air-purifier-guide-cadr-hepa': [
    'home-appliances', 'climate-control', 'air-purifiers', 'cadr-hepa',
  ],
  'fresh-air-system-guide-heat-exchange-filter': [
    'home-appliances', 'climate-control', 'fresh-air-systems', 'heat-exchange',
  ],
  'electric-toothbrush-water-flosser-guide': [
    'home-appliances', 'cleaning-appliances', 'oral-care', 'vibration-frequency',
  ],

  // ── 🛋️ 家居与硬装建材 ────────────────────────────────────────────────────
  'mattress-guide-spring-comfort-layer': [
    'home-renovation', 'furniture', 'mattresses', 'spring-comfort-layer',
  ],
  'sofa-guide-foam-density-frame': [
    'home-renovation', 'furniture', 'sofas', 'foam-density',
  ],
  'ergonomic-chair-buying-guide': [
    'home-renovation', 'furniture', 'ergonomic-chairs', 'lumbar-support',
  ],
  'flooring-guide-four-materials-compared': [
    'home-renovation', 'building-materials', 'flooring', 'material-comparison',
  ],
  'window-door-guide-profile-glass': [
    'home-renovation', 'building-materials', 'windows-doors', 'profile-glass',
  ],
  'interior-paint-guide-voc-mold': [
    'home-renovation', 'building-materials', 'paints-adhesives', 'voc-mold',
  ],
  'smart-toilet-seat-buying-guide': [
    'home-renovation', 'bath-hardware', 'smart-toilets', 'heating-flushing',
  ],
  'shower-head-guide-valve-thermostatic': [
    'home-renovation', 'bath-hardware', 'showerheads', 'thermostatic-valve',
  ],

  // ── 🧴 科学护肤与个护 ────────────────────────────────────────────────────
  'retinol-anti-aging-guide-concentration': [
    'skincare-personal-care', 'skincare-science', 'anti-aging', 'retinol',
  ],
  'hyaluronic-acid-peptide-skincare-guide': [
    'skincare-personal-care', 'skincare-science', 'anti-aging', 'peptides',
  ],
  'skin-whitening-guide-niacinamide-vitamin-c': [
    'skincare-personal-care', 'skincare-science', 'brightening', 'niacinamide',
  ],
  'sunscreen-guide-physical-chemical': [
    'skincare-personal-care', 'skincare-science', 'sunscreen', 'uv-filters',
  ],
  'beauty-device-guide-rf-led-microcurrent': [
    'skincare-personal-care', 'personal-care-devices', 'beauty-devices', 'rf-led',
  ],
  'high-speed-hair-dryer-buying-guide': [
    'skincare-personal-care', 'personal-care-devices', 'hair-dryers', 'brushless-motor',
  ],

  // ── 🐾 科学养宠 ──────────────────────────────────────────────────────────
  'cat-food-ingredients-nutrition-guide': [
    'pet-care', 'pet-diet', 'cat-food', 'protein-ingredients',
  ],
  'dog-food-ingredients-guide': [
    'pet-care', 'pet-diet', 'dog-food', 'protein-ingredients',
  ],
  'pet-freeze-dried-treat-buying-guide': [
    'pet-care', 'pet-diet', 'treats-freeze-dried', 'freeze-drying',
  ],
  'cat-litter-guide-four-materials': [
    'pet-care', 'pet-supplies', 'cat-litter', 'dust-clumping',
  ],
  'smart-litter-box-buying-guide': [
    'pet-care', 'pet-supplies', 'smart-litter-boxes', 'safety-sensors',
  ],

  // ── 🍼 母婴与育儿 ────────────────────────────────────────────────────────
  'child-car-seat-buying-guide': [
    'baby-maternity', 'travel-gear', 'car-seats', 'isofix-certification',
  ],
  'baby-stroller-buying-guide': [
    'baby-maternity', 'travel-gear', 'strollers', 'suspension-frame',
  ],
  'baby-bottle-guide-material-anti-colic': [
    'baby-maternity', 'feeding-sleeping', 'baby-bottles', 'anti-colic',
  ],
  'baby-mattress-buying-guide': [
    'baby-maternity', 'feeding-sleeping', 'baby-mattresses', 'firmness-safety',
  ],
  'baby-food-tool-buying-guide': [
    'baby-maternity', 'feeding-sleeping', 'feeding-tools', 'food-processor',
  ],

  // ── 🏕️ 户外与运动 ────────────────────────────────────────────────────────
  'hardshell-jacket-waterproof-breathable-guide': [
    'outdoors-fitness', 'outdoor-gear', 'hardshell-jackets', 'waterproof-breathable',
  ],
  'camping-sleeping-bag-tent-guide': [
    'outdoors-fitness', 'outdoor-gear', 'tents-sleeping-bags', 'fill-power',
  ],
  'backpack-luggage-buying-guide': [
    'outdoors-fitness', 'outdoor-gear', 'backpacks-luggage', 'material-structure',
  ],
  'treadmill-guide-horsepower-cushioning': [
    'outdoors-fitness', 'home-gym', 'treadmills', 'continuous-horsepower',
  ],
  'yoga-mat-guide-material-thickness': [
    'outdoors-fitness', 'home-gym', 'yoga-mats', 'material-grip',
  ],
  'gym-equipment-guide-dumbbell-exercise-bike': [
    'outdoors-fitness', 'home-gym', 'gym-equipment', 'dumbbells-exercise-bike',
  ],

  // ── 📋 生活决策与避坑清单 ────────────────────────────────────────────────
  'apartment-rental-pitfall-guide': [
    'life-decisions', 'renting', 'rental-checklist', 'contract-pitfalls',
  ],
  'used-car-inspection-complete-guide': [
    'life-decisions', 'used-goods', 'used-car', 'inspection-checklist',
  ],
  'used-phone-inspection-complete-guide': [
    'life-decisions', 'used-goods', 'used-electronics', 'inspection-checklist',
  ],
  'secondhand-trading-scam-prevention-guide': [
    'life-decisions', 'used-goods', 'secondhand-trading', 'scam-prevention',
  ],
}

async function main() {
  console.log('🏷️  Updating article tags with new category system...\n')
  console.log(`   Total mappings: ${Object.keys(ARTICLE_TAGS).length}\n`)

  let successCount = 0
  let errorCount = 0
  let notFoundCount = 0

  for (const [slug, tags] of Object.entries(ARTICLE_TAGS)) {
    const { data, error } = await supabase
      .from('pitfallfree_guides')
      .update({ tags, updated_at: new Date().toISOString() })
      .eq('slug', slug)
      .eq('locale', 'zh')
      .select('slug')

    if (error) {
      console.error(`  ❌ ${slug}: ${error.message}`)
      errorCount++
    } else if (!data || data.length === 0) {
      console.warn(`  ⚠️  ${slug}: not found in DB`)
      notFoundCount++
    } else {
      const mainCat = tags[0]
      const subCat = tags[1]
      console.log(`  ✅ ${slug}`)
      console.log(`       [${mainCat}] > [${subCat}]`)
      successCount++
    }
  }

  console.log('\n' + '─'.repeat(60))
  console.log('🎉 Done!')
  console.log(`   ✅ Updated   : ${successCount}`)
  console.log(`   ⚠️  Not found : ${notFoundCount}`)
  console.log(`   ❌ Errors    : ${errorCount}`)

  // 验证
  const { data: sample } = await supabase
    .from('pitfallfree_guides')
    .select('slug, tags')
    .eq('locale', 'zh')
    .limit(3)

  if (sample) {
    console.log('\n📊 Sample verification:')
    for (const row of sample) {
      console.log(`   ${row.slug}: [${row.tags.join(', ')}]`)
    }
  }
}

main().catch((err) => {
  console.error('💥 Fatal:', err.message)
  process.exit(1)
})
