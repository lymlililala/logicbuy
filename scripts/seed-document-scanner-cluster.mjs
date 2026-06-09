#!/usr/bin/env node
/**
 * seed-document-scanner-cluster.mjs
 *
 * 文档扫描仪内容簇（3 篇双语），围绕主文 document-scanner-buying-guide 建主题权威。
 * GSC 信号：document scanners / scanner for documents / which printer 等，194 展示但排名靠后。
 * tags 与主文一致 → RelatedGuides 自动互链。每篇含 FAQ。差异化角度，避免与主文/打印机文蚕食。
 * upsert onConflict 'slug,locale'，幂等。
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-document-scanner-cluster.mjs --dry-run
 *   node --env-file=.env.local scripts/seed-document-scanner-cluster.mjs
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tixgzezefjjsyuzgdhcd.supabase.co'
const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
if (!KEY) {
  console.error('缺少 SUPABASE_SECRET_KEY（请用 node --env-file=.env.local 运行）')
  process.exit(1)
}
const sb = createClient(SUPABASE_URL, KEY)
const DRY = process.argv.includes('--dry-run')
const DATE = '2026-06-09'
const TAGS = ['tech', 'scanner', 'office', 'productivity', 'buying-guide', 'tech-electronics']
const HUB_EN = '/en/guides/document-scanner-buying-guide'
const HUB_ZH = '/zh/guides/document-scanner-buying-guide'

const articles = [
  {
    slug: 'document-scanner-ocr-paperless-workflow',
    en: {
      title: 'OCR & Paperless Workflow: Turning a Scanner Into a Searchable Archive',
      summary:
        'A scanner only goes paperless if the files are searchable and organized. This guide explains OCR, searchable PDFs, the right scan resolution, and a workflow that turns paper into a findable digital archive.',
      content: `# OCR & Paperless Workflow

Buying a document scanner is the easy part. Going truly paperless depends on what happens after the scan — whether your files are searchable, named, and organized, or just a folder of unsearchable images.

## What OCR Actually Does

OCR (Optical Character Recognition) converts the text in a scanned image into real, selectable, searchable characters. Without it, a scanned contract is just a picture; with it, you can search for a clause, copy a number, or let your computer index the document. A "searchable PDF" stores the original image with an invisible OCR text layer behind it — the best of both.

## The Right Scan Settings

For text documents, **300 DPI** is the sweet spot: high enough for accurate OCR, low enough to keep files small. Scan in black-and-white for plain text, color only when needed. Save as searchable PDF rather than JPEG so the OCR layer travels with the file.

## Batch and Duplex Scanning

A reliable automatic document feeder (ADF) with duplex (double-sided) scanning is what makes large stacks practical. This is where dedicated scanners beat all-in-one printers — see our [scanner vs all-in-one comparison](/en/guides/document-scanner-vs-all-in-one-printer).

## A Workflow That Stays Organized

Scan → OCR to searchable PDF → consistent naming (date + type + party) → archive into a cloud-synced folder structure. The discipline of naming and foldering at scan time is what separates a usable archive from a digital junk drawer.

For choosing the scanner itself, see our [document scanner buying guide](${HUB_EN}).

## FAQ

### What is OCR and why do I need it for a paperless office?
OCR converts scanned images into searchable, selectable text. Without it your scans are just pictures you can't search; with it you can find any document by its contents — essential for a paperless archive.

### What scan resolution should I use for documents?
300 DPI is ideal for text documents: accurate enough for OCR while keeping file sizes manageable. Higher DPI mainly benefits photos, not text.

### What is a searchable PDF?
A searchable PDF stores the scanned image with an invisible OCR text layer behind it, so the page looks like the original but its text can be searched, selected, and copied.`,
    },
    zh: {
      title: 'OCR 与无纸化工作流：把扫描仪变成可搜索的数字档案',
      summary:
        '扫描仪要真正实现无纸化，关键在扫描之后——文件是否可搜索、有条理。本文讲清 OCR、可搜索 PDF、合适的扫描分辨率，以及把纸张变成可检索数字档案的工作流。',
      content: `# OCR 与无纸化工作流

买扫描仪是简单的部分。真正实现无纸化，取决于扫描之后发生了什么——你的文件是可搜索、有命名、有归类的，还是只是一堆无法搜索的图片。

## OCR 到底做了什么

OCR（光学字符识别）把扫描图像里的文字转成真正可选、可搜索的字符。没有它，扫描的合同只是一张图；有了它，你能搜索某个条款、复制某个数字，或让电脑索引这份文档。「可搜索 PDF」把原始图像和背后一层隐形 OCR 文字一起存储——两全其美。

## 正确的扫描设置

文字文档，**300 DPI** 是甜点位：足够 OCR 准确识别，又能让文件保持小巧。纯文字用黑白扫描，必要时才用彩色。存成可搜索 PDF 而非 JPEG，让 OCR 文字层随文件一起走。

## 批量与双面扫描

可靠的自动进纸器（ADF）加双面扫描，才让扫整叠文件变得实际可行。这正是专用扫描仪胜过一体机之处——见我们的[扫描仪 vs 一体机对比](/zh/guides/document-scanner-vs-all-in-one-printer)。

## 保持有条理的工作流

扫描 → OCR 转可搜索 PDF → 统一命名（日期+类型+对象）→ 归入云同步的文件夹结构。扫描时就命名和归类的纪律，是「可用档案」与「数字杂物抽屉」的分水岭。

挑选扫描仪本身，见我们的[文件扫描仪选购指南](${HUB_ZH})。

## 常见问题

### OCR 是什么，无纸化办公为什么需要它？
OCR 把扫描图像转成可搜索、可选的文字。没有它，扫描件只是搜不了的图片；有了它，你能按内容找到任何文档——这是无纸化档案的关键。

### 文档该用多少扫描分辨率？
文字文档 300 DPI 最理想：足够 OCR 准确，又能控制文件大小。更高 DPI 主要利于照片，对文字意义不大。

### 可搜索 PDF 是什么？
可搜索 PDF 把扫描图像和背后一层隐形 OCR 文字一起存储，页面看起来和原件一样，但文字可被搜索、选中和复制。`,
    },
  },
  {
    slug: 'photo-scanner-buying-guide',
    en: {
      title: 'Photo Scanner Buying Guide: Digitizing Photos, Negatives & Slides',
      summary:
        'Scanning old photos needs different specs than documents — much higher resolution, color depth, and often film support. This guide covers how to choose a photo scanner and digitize prints, negatives, and slides.',
      content: `# Photo Scanner Buying Guide

Scanning photographs is a different job from scanning documents. The specs that matter, and the mistakes to avoid, are not the same — using a document scanner for treasured prints usually disappoints.

## Why Photos Need Different Specs

Documents scan fine at 300 DPI; photos need far more. For prints, **600 DPI** is a practical minimum and 1200 DPI lets you reprint larger. For **negatives and slides**, you need 2400–4800 DPI because you're enlarging a tiny original. Color depth (48-bit) and dynamic range also matter far more than for text.

## Flatbed vs Dedicated Photo Scanner

A good flatbed scans prints well and, with a transparency unit, can handle film. Dedicated photo/film scanners produce higher quality for negatives and slides but cost more and are slower. For a box of old prints, a flatbed with an automatic feeder or a fast photo scanner saves hours.

## Film, Negatives and Slides

To scan negatives or slides you need a scanner with a **transparency adapter** (backlight) — a normal flatbed that only lights from below cannot do film properly. Check the film formats supported (35mm, medium format) before buying.

## Restoration Features

Look for dust and scratch removal (hardware-based, like Digital ICE, works better than software), color restoration for faded prints, and batch scanning to get through large collections.

For text and paperwork instead, see our [document scanner buying guide](${HUB_EN}) and [OCR & paperless workflow](/en/guides/document-scanner-ocr-paperless-workflow).

## FAQ

### What resolution do I need to scan old photos?
For prints, 600 DPI is a practical minimum and 1200 DPI allows larger reprints. For negatives and slides you need 2400–4800 DPI because you're enlarging a very small original.

### Can a regular document scanner scan negatives?
No. Negatives and slides require a scanner with a transparency adapter (a backlight). A standard flatbed that only lights from below cannot scan film properly — check for film support before buying.

### What's the difference between a photo scanner and a document scanner?
Photo scanners offer much higher resolution, better color depth and dynamic range, and often film support and dust/scratch removal. Document scanners prioritize speed and OCR at lower resolution.`,
    },
    zh: {
      title: '照片扫描仪选购指南：数字化照片、底片与幻灯片',
      summary:
        '扫老照片和扫文档需要的参数完全不同——更高的分辨率、色彩深度，常常还要支持底片。本文讲清如何选照片扫描仪，以及数字化相片、底片和幻灯片。',
      content: `# 照片扫描仪选购指南

扫照片和扫文档是两回事。重要的参数、要避开的坑都不一样——用文档扫描仪扫珍贵的相片，结果往往令人失望。

## 为什么照片需要不同参数

文档 300 DPI 就够；照片需要高得多。相片，**600 DPI** 是实用下限，1200 DPI 能让你放大重印。**底片和幻灯片**则需要 2400–4800 DPI，因为你是在放大一个极小的原件。色彩深度（48 位）和动态范围也远比扫文字重要。

## 平板式 vs 专用照片扫描仪

好的平板扫描仪扫相片不错，配上透扫单元还能扫胶片。专用照片/胶片扫描仪在底片和幻灯片上质量更高，但更贵也更慢。面对一盒老照片，带自动进纸的平板或快速照片扫描仪能省下几小时。

## 胶片、底片与幻灯片

要扫底片或幻灯片，需要带**透扫适配器**（背光）的扫描仪——只从下方打光的普通平板无法正确扫胶片。购买前确认支持的胶片格式（135、120 中画幅）。

## 修复功能

留意除尘除划痕（硬件级的如 Digital ICE 比软件更好）、褪色相片的色彩还原、以及批量扫描以应对大量收藏。

要扫文字和办公文档，见我们的[文件扫描仪选购指南](${HUB_ZH})和[OCR 与无纸化工作流](/zh/guides/document-scanner-ocr-paperless-workflow)。

## 常见问题

### 扫老照片需要多少分辨率？
相片 600 DPI 是实用下限，1200 DPI 可放大重印。底片和幻灯片需要 2400–4800 DPI，因为是在放大极小的原件。

### 普通文档扫描仪能扫底片吗？
不能。底片和幻灯片需要带透扫适配器（背光）的扫描仪。只从下方打光的普通平板无法正确扫胶片——购买前先确认是否支持胶片。

### 照片扫描仪和文档扫描仪有什么区别？
照片扫描仪分辨率高得多、色彩深度和动态范围更好，常支持胶片和除尘除划痕。文档扫描仪以较低分辨率换取速度和 OCR。`,
    },
  },
  {
    slug: 'document-scanner-vs-all-in-one-printer',
    en: {
      title: 'Dedicated Scanner vs All-in-One Printer: Which Do You Actually Need?',
      summary:
        'Your printer can scan — so do you need a dedicated scanner? This guide compares all-in-one scanning to dedicated document scanners on speed, reliability, and software, and explains when each makes sense.',
      content: `# Dedicated Scanner vs All-in-One Printer

Most all-in-one printers can scan, so a dedicated scanner can feel redundant. For occasional use it often is — but for regular scanning the difference is large enough to matter.

## Where All-in-One Scanning Falls Short

All-in-one printers scan fine for the occasional page, but their scanning is usually slow, their automatic document feeders (if present) are small and jam-prone, and the bundled software is basic. For a few pages a month, that's perfectly fine.

## What a Dedicated Scanner Adds

Dedicated document scanners are built around throughput: fast duplex scanning, reliable ADFs that handle large stacks, and better bundled OCR software. If you scan regularly or are digitizing an archive, they save real time and frustration.

## When Each Makes Sense

- **All-in-one is enough:** you scan a few pages a month, already own a capable printer, and don't need fast batch scanning.
- **Get a dedicated scanner:** you scan regularly, want a paperless workflow, or need reliable double-sided batch scanning with good OCR.

## Don't Forget Photos

Neither a basic all-in-one nor a document scanner is ideal for photos — those need higher resolution and film support. See our [photo scanner guide](/en/guides/photo-scanner-buying-guide).

For the full scanner decision, see our [document scanner buying guide](${HUB_EN}); for printers, our [home printer buying guide](/en/guides/home-printer-buying-guide).

## FAQ

### Do I need a dedicated scanner if my printer already scans?
For a few pages a month, an all-in-one printer is fine. But if you scan regularly or want a paperless workflow, a dedicated document scanner is far faster, has a more reliable document feeder, and includes better OCR software.

### Why is a dedicated document scanner faster than an all-in-one?
Dedicated scanners are built for throughput — fast duplex (double-sided) scanning and reliable automatic document feeders that handle large stacks, whereas all-in-one feeders are typically small and slower.

### Can an all-in-one printer scan double-sided?
Some can, but many entry-level all-in-ones either can't or do it slowly via a small feeder. Dedicated document scanners handle duplex batches far more reliably.`,
    },
    zh: {
      title: '专用扫描仪 vs 一体机：你到底需要哪个？',
      summary:
        '打印机也能扫描——那还需要专用扫描仪吗？本文从速度、可靠性、软件对比一体机扫描与专用文档扫描仪，讲清各自适合什么场景。',
      content: `# 专用扫描仪 vs 一体机

多数一体机都能扫描，所以专用扫描仪会显得多余。偶尔用确实如此——但经常扫描时，差距大到值得在意。

## 一体机扫描的短板

一体机扫偶尔的几页没问题，但扫描通常慢、自动进纸器（如果有）小且易卡纸、附带软件简陋。每月扫几页，这完全够用。

## 专用扫描仪多给了什么

专用文档扫描仪是围绕吞吐量设计的：快速双面扫描、能处理大叠纸的可靠 ADF、更好的附带 OCR 软件。如果你经常扫描或在数字化一批档案，它能省下实实在在的时间和烦恼。

## 各自适合谁

- **一体机就够：** 每月扫几页、已有一台能用的打印机、不需要快速批量扫描。
- **上专用扫描仪：** 经常扫描、想要无纸化工作流、或需要可靠的双面批量扫描加好用的 OCR。

## 别忘了照片

基础一体机和文档扫描仪扫照片都不理想——照片需要更高分辨率和胶片支持。见我们的[照片扫描仪指南](/zh/guides/photo-scanner-buying-guide)。

完整的扫描仪决策见[文件扫描仪选购指南](${HUB_ZH})；打印机见[家用打印机选购指南](/zh/guides/home-printer-buying-guide)。

## 常见问题

### 打印机已经能扫描，还需要专用扫描仪吗？
每月扫几页，一体机就够。但如果你经常扫描或想要无纸化工作流，专用文档扫描仪快得多、进纸器更可靠、附带的 OCR 软件也更好。

### 为什么专用文档扫描仪比一体机快？
专用扫描仪为吞吐量而生——快速双面扫描和能处理大叠纸的可靠自动进纸器，而一体机的进纸器通常又小又慢。

### 一体机能双面扫描吗？
有些能，但很多入门一体机要么不能、要么靠小进纸器慢慢扫。专用文档扫描仪处理双面批量可靠得多。`,
    },
  },
]

let ok = 0,
  fail = 0
for (const a of articles) {
  for (const locale of ['en', 'zh']) {
    const d = a[locale]
    const row = {
      slug: a.slug,
      locale,
      title: d.title,
      summary: d.summary,
      tags: TAGS,
      layout: 'PostLayout',
      authors: ['default'],
      published_at: DATE,
      lastmod: DATE,
      draft: false,
      content: d.content,
    }
    if (DRY) {
      console.log(`[dry] ${locale} ${a.slug}`)
      continue
    }
    const { error } = await sb
      .from('pitfallfree_guides')
      .upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: 'slug,locale' })
    if (error) {
      console.log(`ERR ${locale} ${a.slug}: ${error.message}`)
      fail++
    } else {
      console.log(`OK  ${locale} ${a.slug}`)
      ok++
    }
  }
}
if (!DRY) console.log(`\n完成：成功 ${ok}，失败 ${fail}`)
