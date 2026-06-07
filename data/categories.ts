export interface SubCategory {
  slug: string
  labelZh: string
  labelEn: string
}

export interface Category {
  slug: string
  icon: string
  labelZh: string
  labelEn: string
  descZh: string
  descEn: string
  color: string
  border: string
  iconBg: string
  subcategories: SubCategory[]
}

export const CATEGORIES: Category[] = [
  {
    slug: 'tech-electronics',
    icon: '💻',
    labelZh: '数码与电子',
    labelEn: 'Tech & Electronics',
    descZh: '芯片架构 · 面板技术 · 接口协议',
    descEn: 'Chips · Panels · Protocols',
    color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    subcategories: [
      { slug: 'computers-peripherals', labelZh: '电脑与外设', labelEn: 'Computers & Peripherals' },
      { slug: 'monitors', labelZh: '显示器', labelEn: 'Monitors' },
      { slug: 'laptops', labelZh: '笔记本电脑', labelEn: 'Laptops' },
      { slug: 'mechanical-keyboards', labelZh: '机械键盘', labelEn: 'Mechanical Keyboards' },
      { slug: 'home-audio-video', labelZh: '家庭影音', labelEn: 'Home Audio & Video' },
      { slug: 'televisions', labelZh: '电视', labelEn: 'Televisions' },
      { slug: 'projectors', labelZh: '投影仪', labelEn: 'Projectors' },
      { slug: 'audio-systems', labelZh: '音响系统', labelEn: 'Audio Systems' },
      { slug: 'anc-headphones', labelZh: '降噪耳机', labelEn: 'ANC Headphones' },
      { slug: 'mobile-wearables', labelZh: '移动与穿戴', labelEn: 'Mobile & Wearables' },
      { slug: 'smartphones', labelZh: '智能手机', labelEn: 'Smartphones' },
      { slug: 'smartwatches', labelZh: '智能手表', labelEn: 'Smartwatches' },
      { slug: 'tablets', labelZh: '平板电脑', labelEn: 'Tablets' },
      { slug: 'cameras', labelZh: '相机', labelEn: 'Cameras' },
      { slug: 'gaming', labelZh: '游戏外设', labelEn: 'Gaming' },
    ],
  },
  {
    slug: 'home-appliances',
    icon: '🏠',
    labelZh: '智能家电',
    labelEn: 'Home Appliances',
    descZh: '电机类型 · 工作原理 · 能效比',
    descEn: 'Motor · Mechanism · Efficiency',
    color: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    subcategories: [
      { slug: 'cleaning-appliances', labelZh: '清洁电器', labelEn: 'Cleaning Appliances' },
      { slug: 'robot-vacuums', labelZh: '扫地机器人', labelEn: 'Robot Vacuums' },
      { slug: 'air-purifiers', labelZh: '空气净化器', labelEn: 'Air Purifiers' },
      {
        slug: 'dehumidifiers-humidifiers',
        labelZh: '除湿/加湿器',
        labelEn: 'Dehumidifiers & Humidifiers',
      },
      { slug: 'kitchen-appliances', labelZh: '厨房电器', labelEn: 'Kitchen Appliances' },
      { slug: 'refrigerators', labelZh: '冰箱', labelEn: 'Refrigerators' },
      { slug: 'dishwashers', labelZh: '洗碗机', labelEn: 'Dishwashers' },
      { slug: 'coffee-makers', labelZh: '咖啡机', labelEn: 'Coffee Makers' },
      { slug: 'climate-control', labelZh: '环境电器', labelEn: 'Climate Control' },
      { slug: 'air-conditioners', labelZh: '空调', labelEn: 'Air Conditioners' },
      { slug: 'fresh-air-systems', labelZh: '新风系统', labelEn: 'Fresh Air Systems' },
      { slug: 'water-purifiers', labelZh: '净水器', labelEn: 'Water Purifiers' },
      { slug: 'personal-care-devices', labelZh: '个护仪器', labelEn: 'Personal Care Devices' },
      { slug: 'hair-dryers', labelZh: '吹风机', labelEn: 'Hair Dryers' },
      { slug: 'oral-care', labelZh: '口腔护理', labelEn: 'Oral Care' },
      { slug: 'beauty-devices', labelZh: '美容仪器', labelEn: 'Beauty Devices' },
    ],
  },
  {
    slug: 'home-renovation',
    icon: '🛋️',
    labelZh: '家居与硬装',
    labelEn: 'Home & Renovation',
    descZh: '材质密度 · 环保等级 · 人体工学',
    descEn: 'Materials · Eco Standards · Ergonomics',
    color: 'from-yellow-50 to-lime-50 dark:from-yellow-900/20 dark:to-lime-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/40',
    subcategories: [
      { slug: 'furniture', labelZh: '核心家具', labelEn: 'Furniture' },
      { slug: 'sofas', labelZh: '沙发', labelEn: 'Sofas' },
      { slug: 'mattresses', labelZh: '床垫', labelEn: 'Mattresses' },
      { slug: 'ergonomic-chairs', labelZh: '人体工学椅', labelEn: 'Ergonomic Chairs' },
      { slug: 'building-materials', labelZh: '硬装建材', labelEn: 'Building Materials' },
      { slug: 'flooring', labelZh: '地板', labelEn: 'Flooring' },
      { slug: 'windows-doors', labelZh: '门窗', labelEn: 'Windows & Doors' },
      { slug: 'paints-adhesives', labelZh: '涂料与胶水', labelEn: 'Paints & Adhesives' },
      { slug: 'bath-hardware', labelZh: '卫浴五金', labelEn: 'Bath & Hardware' },
      { slug: 'showerheads', labelZh: '花洒', labelEn: 'Showerheads' },
      { slug: 'smart-toilets', labelZh: '智能马桶', labelEn: 'Smart Toilets' },
    ],
  },
  {
    slug: 'skincare-personal-care',
    icon: '🧴',
    labelZh: '科学护肤',
    labelEn: 'Skincare & Care',
    descZh: '化学成分 · 浓度百分比 · 物理作用力',
    descEn: 'Ingredients · Concentration · Mechanism',
    color: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
    border: 'border-pink-200 dark:border-pink-800',
    iconBg: 'bg-pink-100 dark:bg-pink-900/40',
    subcategories: [
      { slug: 'skincare-science', labelZh: '护肤成分学', labelEn: 'Skincare Science' },
      { slug: 'sunscreen', labelZh: '防晒', labelEn: 'Sunscreen' },
      { slug: 'anti-aging', labelZh: '抗衰老', labelEn: 'Anti-Aging' },
      { slug: 'retinol', labelZh: '维A酸/视黄醇', labelEn: 'Retinol' },
      { slug: 'brightening', labelZh: '美白提亮', labelEn: 'Brightening' },
      { slug: 'peptides', labelZh: '多肽成分', labelEn: 'Peptides' },
      { slug: 'protein-ingredients', labelZh: '蛋白质成分', labelEn: 'Protein Ingredients' },
    ],
  },
  {
    slug: 'pet-care',
    icon: '🐾',
    labelZh: '科学养宠',
    labelEn: 'Pet Care',
    descZh: '营养成分 · 原料溯源 · 安全性',
    descEn: 'Nutrition · Ingredients · Safety',
    color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    border: 'border-green-200 dark:border-green-800',
    iconBg: 'bg-green-100 dark:bg-green-900/40',
    subcategories: [
      { slug: 'pet-diet', labelZh: '宠物食品', labelEn: 'Pet Diet' },
      { slug: 'cat-food', labelZh: '猫粮', labelEn: 'Cat Food' },
      { slug: 'dog-food', labelZh: '狗粮', labelEn: 'Dog Food' },
      { slug: 'treats-freeze-dried', labelZh: '零食冻干', labelEn: 'Treats & Freeze-Dried' },
      { slug: 'pet-supplies', labelZh: '宠物用品', labelEn: 'Pet Supplies' },
      { slug: 'cat-litter', labelZh: '猫砂', labelEn: 'Cat Litter' },
      { slug: 'smart-litter-boxes', labelZh: '智能猫厕所', labelEn: 'Smart Litter Boxes' },
    ],
  },
  {
    slug: 'baby-maternity',
    icon: '🍼',
    labelZh: '母婴与育儿',
    labelEn: 'Baby & Maternity',
    descZh: '国际认证 · 材质无毒 · 骨骼发育',
    descEn: 'Certifications · Non-toxic · Development',
    color: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    subcategories: [
      { slug: 'travel-gear', labelZh: '出行装备', labelEn: 'Travel Gear' },
      { slug: 'strollers', labelZh: '婴儿推车', labelEn: 'Strollers' },
      { slug: 'car-seats', labelZh: '安全座椅', labelEn: 'Car Seats' },
      { slug: 'feeding-sleeping', labelZh: '喂养与睡眠', labelEn: 'Feeding & Sleeping' },
      { slug: 'baby-bottles', labelZh: '奶瓶', labelEn: 'Baby Bottles' },
      { slug: 'baby-mattresses', labelZh: '婴儿床垫', labelEn: 'Baby Mattresses' },
      { slug: 'feeding-tools', labelZh: '辅食工具', labelEn: 'Feeding Tools' },
    ],
  },
  {
    slug: 'outdoors-fitness',
    icon: '🏕️',
    labelZh: '户外与运动',
    labelEn: 'Outdoors & Fitness',
    descZh: '面料科技 · 机械结构 · 防护等级',
    descEn: 'Fabric Tech · Mechanics · Protection',
    color: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
    border: 'border-teal-200 dark:border-teal-800',
    iconBg: 'bg-teal-100 dark:bg-teal-900/40',
    subcategories: [
      { slug: 'outdoor-gear', labelZh: '户外装备', labelEn: 'Outdoor Gear' },
      { slug: 'hardshell-jackets', labelZh: '冲锋衣', labelEn: 'Hardshell Jackets' },
      { slug: 'tents-sleeping-bags', labelZh: '帐篷与睡袋', labelEn: 'Tents & Sleeping Bags' },
      { slug: 'backpacks-luggage', labelZh: '背包与行李箱', labelEn: 'Backpacks & Luggage' },
      { slug: 'home-gym', labelZh: '居家健身', labelEn: 'Home Gym' },
      { slug: 'treadmills', labelZh: '跑步机', labelEn: 'Treadmills' },
      { slug: 'gym-equipment', labelZh: '健身器材', labelEn: 'Gym Equipment' },
      { slug: 'yoga-mats', labelZh: '瑜伽垫', labelEn: 'Yoga Mats' },
    ],
  },
  {
    slug: 'life-decisions',
    icon: '📋',
    labelZh: '生活决策清单',
    labelEn: 'Life Decisions',
    descZh: '合同陷阱 · 隐形消费 · 流程规范',
    descEn: 'Contracts · Hidden Costs · Checklists',
    color: 'from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20',
    border: 'border-slate-200 dark:border-slate-800',
    iconBg: 'bg-slate-100 dark:bg-slate-900/40',
    subcategories: [
      { slug: 'renting', labelZh: '租房与看房', labelEn: 'Renting' },
      { slug: 'used-goods', labelZh: '二手交易', labelEn: 'Used Goods' },
      { slug: 'used-car', labelZh: '二手车', labelEn: 'Used Cars' },
      { slug: 'secondhand-trading', labelZh: '闲置交易', labelEn: 'Secondhand Trading' },
      { slug: 'inspection-checklist', labelZh: '验收清单', labelEn: 'Inspection Checklist' },
    ],
  },
]

/** 根据 slug 查找大类 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

/** 根据子类 slug 找到所属大类 */
export function getCategoryBySubSlug(subSlug: string): Category | undefined {
  return CATEGORIES.find((c) => c.subcategories.some((s) => s.slug === subSlug))
}

/** 从文章 tags 推断所属大类（优先匹配大类 slug，其次匹配子类的父类） */
export function getCategoryForTags(tags: string[] | null | undefined): Category | undefined {
  if (!tags || tags.length === 0) return undefined
  for (const t of tags) {
    const c = getCategoryBySlug(t)
    if (c) return c
  }
  for (const t of tags) {
    const c = getCategoryBySubSlug(t)
    if (c) return c
  }
  return undefined
}

/** 获取大类 label */
export function getCategoryLabel(slug: string, locale: string): string {
  const cat = getCategoryBySlug(slug)
  if (!cat) return slug
  return locale === 'zh' ? cat.labelZh : cat.labelEn
}

/** 获取子类 label */
export function getSubcategoryLabel(subSlug: string, locale: string): string {
  for (const cat of CATEGORIES) {
    const sub = cat.subcategories.find((s) => s.slug === subSlug)
    if (sub) return locale === 'zh' ? sub.labelZh : sub.labelEn
  }
  return subSlug
}
