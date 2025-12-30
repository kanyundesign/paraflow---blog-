# Paraflow 设计系统规范

> 本文档汇总了 Paraflow 首页的设计语言、规范和风格，供二级页面设计参考。

---

## 1. 品牌色彩系统

### 主色调
| 名称 | 色值 | 用途 |
|------|------|------|
| **Paraflow Green** | `#00C05C` | 主品牌色，用于强调、按钮、链接、hover 状态 |
| **Paraflow Green Light** | `#79F200` | 渐变辅助色，与主绿色组合形成品牌渐变 |

### 背景色
| 名称 | 色值 | 用途 |
|------|------|------|
| **Black** | `#0A0A0A` | 主背景色 |
| **Gray Dark** | `#1A1A1A` | 卡片背景、次级区域 |
| **Gray Medium** | `#2A2A2A` | 分隔线、边框 |
| **Gray Light** | `#888888` | 次要文字、禁用状态 |

### 文字色
| 名称 | 色值 | 用途 |
|------|------|------|
| **White** | `#FFFFFF` | 主标题、重要文字 |
| **Gray 300** | `#D1D5DB` | 副标题 |
| **Gray 400** | `#9CA3AF` | 正文、描述文字 |
| **Gray 500** | `#6B7280` | 次要信息 |
| **Gray 600** | `#4B5563` | 折叠/禁用状态 |
| **Gray 700** | `#374151` | 最弱化状态 |

### 品牌渐变
```css
/* 主渐变 - 用于按钮、文字强调 */
background: linear-gradient(135deg, #00C05C 0%, #79F200 100%);

/* 从左到右渐变 - 用于文字 */
background: linear-gradient(90deg, #00C05C 0%, #79F200 100%);

/* 锥形渐变 - 用于边框动画 */
background: conic-gradient(from 0deg, #00C05C, #79F200, #00C05C);
```

### 透明度规范
| 场景 | 透明度 |
|------|--------|
| 静态 icon/装饰元素 | 5% - 15% |
| Hover 后 icon | 10% - 20% |
| 边框默认 | 20% (`border-white/20`) |
| 边框 hover | 30% - 50% |
| 星星/粒子静态 | 15% - 40% |
| 星星/粒子高亮 | 80% - 100% |

---

## 2. 字体系统

### 字体家族
```css
/* 展示字体 - 用于大标题 */
font-family: 'Newsreader', Georgia, 'Times New Roman', serif;
/* 类名: font-display */

/* 正文字体 - 用于正文、按钮、标签 */
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### 字号规范

#### 标题 (font-display 衬线体)
| 场景 | 移动端 | 平板 | 桌面 | 大屏 |
|------|--------|------|------|------|
| Hero 主标题 | 48px (text-5xl) | 60px (text-6xl) | 72px (text-7xl) | 80-100px |
| 板块标题 | 24px | 32px | 40-46px | 46px |
| 序号 | 24px | 32px | 40-46px | 46px |

#### 正文 (Inter 无衬线体)
| 场景 | 字号 | 字重 |
|------|------|------|
| Hero 副标题 | 20px - 30px (text-xl ~ text-3xl) | 400 |
| 卡片标题 | 20px - 24px (text-xl ~ text-2xl) | 500-600 |
| 正文描述 | 14px - 16px (text-sm ~ text-base) | 400 |
| 标签/小字 | 10px - 12px (text-xs) | 500 |
| 按钮文字 | 14px (text-sm) | 500 |

### 行高
- 标题: `leading-[1.1]` 或 `leading-tight`
- 正文: `leading-relaxed` (1.625)
- 紧凑: `leading-snug` (1.375)

---

## 3. 间距系统

### 基础间距 (4px 为单位)
| 名称 | 值 | Tailwind |
|------|-----|----------|
| xs | 4px | `p-1`, `m-1` |
| sm | 8px | `p-2`, `m-2` |
| md | 12px | `p-3`, `m-3` |
| lg | 16px | `p-4`, `m-4` |
| xl | 24px | `p-6`, `m-6` |
| 2xl | 32px | `p-8`, `m-8` |
| 3xl | 48px | `p-12`, `m-12` |
| 4xl | 64px | `p-16`, `m-16` |

### 页面布局
```css
/* 内容最大宽度 */
max-width: 1400px;

/* 水平内边距 */
padding-left: 24px;  /* px-6 */
padding-right: 24px;

/* 大屏水平内边距 */
@media (min-width: 1024px) {
  padding-left: 32px;  /* lg:px-8 */
  padding-right: 32px;
}
```

### 板块间距
- 板块垂直间距: `py-16` (64px) 到 `py-32` (128px)
- 标题与内容间距: `mb-8` (32px) 到 `mb-16` (64px)
- 卡片间隙: `gap-4` (16px) 到 `gap-8` (32px)

---

## 4. 组件规范

### 按钮

#### 主按钮 (渐变背景)
```jsx
<button className="w-[200px] px-5 py-2.5 rounded-[10px] 
  bg-gradient-to-r from-paraflow-green to-paraflow-green-light 
  text-white font-medium text-sm 
  hover:opacity-90 transition-all duration-300">
  Button Text
</button>
```

#### 次级按钮 (边框)
```jsx
<button className="w-[200px] px-5 py-2.5 rounded-[10px] 
  bg-black border border-white/20 
  text-white font-medium text-sm 
  hover:border-paraflow-green/50 hover:text-paraflow-green 
  transition-all duration-300">
  Button Text
</button>
```

#### 按钮规格
- 宽度: 固定 `200px` 或自适应
- 内边距: `px-5 py-2.5`
- 圆角: `rounded-[10px]` 或 `rounded-full`
- 字号: `text-sm` (14px)

### 卡片

#### 基础卡片
```jsx
<div className="relative bg-black border border-white/10 rounded-xl 
  hover:border-paraflow-green/30 transition-all duration-500 
  overflow-hidden group">
  {/* 内容 */}
</div>
```

#### 卡片悬停效果
- 边框变化: `border-white/10` → `border-paraflow-green/30`
- 背景光晕: `box-shadow: 0 0 60px rgba(0, 192, 92, 0.1)`
- 内容上移: `group-hover:-translate-y-1`
- 过渡时间: `duration-300` 到 `duration-500`

#### 卡片高度参考
| 场景 | 高度 |
|------|------|
| Audience 上排卡片 | 160px |
| Audience 下排卡片 | 200px |
| Workflow 卡片 | 自适应，内容区 pt-8 |

### 标签 (Tag)

#### 基础标签
```jsx
<span className="inline-flex items-center px-2 py-0.5 
  bg-white/5 border border-white/20 rounded-full 
  text-xs text-white font-medium tracking-wider 
  group-hover:bg-paraflow-green/10 group-hover:border-paraflow-green/30 
  group-hover:text-paraflow-green transition-all duration-300">
  Label
</span>
```

### 输入框/表单 (预留)
```jsx
<input className="w-full px-4 py-3 
  bg-paraflow-gray-dark border border-white/10 rounded-lg 
  text-white placeholder-gray-500 
  focus:border-paraflow-green/50 focus:outline-none 
  transition-colors duration-300" />
```

---

## 5. 动画与交互

### 过渡时间规范
| 场景 | 时长 | 曲线 |
|------|------|------|
| 快速反馈 (hover) | 300ms | `ease` |
| 标准过渡 | 500ms | `ease-out` |
| 慢速/强调 | 800ms - 1000ms | `ease-out` |
| 背景动画 | 3s - 10s | `linear` 或 `ease-in-out` |

### 预设动画
```css
/* 淡入 */
animation: fadeIn 0.6s ease-out forwards;

/* 上滑淡入 */
animation: slideUp 0.6s ease-out forwards;

/* 浮动 */
animation: float 6s ease-in-out infinite;

/* 闪烁 (星星) */
animation: twinkle 3s ease-in-out infinite;

/* 慢速旋转 */
animation: spin 12s linear infinite;
```

### 交互效果

#### 光标跟随 (Hero)
- 范围: 直径 180px
- 效果: 范围内星星变为绿色
- 颜色: `rgba(0, 192, 92, 0.8)`

#### 星座效果 (ConstellationIcon)
- 静态: 星星分散，微弱闪烁和漂移
- Hover: 星星汇聚成图标，颜色变绿，连线出现
- 星星数量: 核心点 + 10-15 颗装饰星
- 连线粗细: 1-1.5px

### 视差与滚动
- 入场动画: 滚动触发，淡入 + 上移 40px
- 延迟分组: `delay-100` 到 `delay-500` (0.1s - 0.5s)

---

## 6. 图标风格

### 星座图标 (ConstellationIcon)
- 构成: 星点 + 连接线
- 静态颜色: `rgba(255, 255, 255, 0.15)`
- Hover 颜色: `rgba(0, 192, 92, 1)`
- 星点大小: 2-4px，关键点更大更亮
- 支持类型: `link`, `palette`, `code`, `rocket`, `building`, `flowchart`, `monitor`, `linechart`

### Lucide 图标
- 默认大小: `w-4 h-4` 到 `w-7 h-7`
- 默认颜色: `text-white` 或 `text-gray-400`
- Hover 颜色: `text-paraflow-green`
- 常用图标: `ArrowRight`, `Link2`, `Palette`, `Code2`, `Rocket`, `Building2`

---

## 7. 布局模式

### 响应式断点
| 名称 | 宽度 | 说明 |
|------|------|------|
| sm | 640px | 小屏手机 |
| md | 768px | 平板 |
| lg | 1024px | 小型桌面 |
| xl | 1280px | 标准桌面 |
| 2xl | 1536px | 大屏 |

### 网格系统
```jsx
/* 两列 (桌面) / 单列 (移动) */
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

/* 三列 */
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

/* 四列 (2x2 移动端) */
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
```

### Flexbox 常用模式
```jsx
/* 居中 */
<div className="flex items-center justify-center">

/* 两端对齐 */
<div className="flex items-center justify-between">

/* 垂直排列居中 */
<div className="flex flex-col items-center">
```

---

## 8. 特殊效果

### 渐变文字
```jsx
<span className="bg-gradient-to-r from-paraflow-green to-paraflow-green-light 
  bg-clip-text text-transparent">
  Gradient Text
</span>
```

### 绿色光晕
```css
.glow-green {
  box-shadow: 
    0 0 20px rgba(0, 192, 92, 0.3),
    0 0 40px rgba(0, 192, 92, 0.2),
    0 0 60px rgba(0, 192, 92, 0.1);
}
```

### 边框渐变旋转 (标签)
- 使用 `conic-gradient` 创建旋转光带
- Hover 触发旋转动画
- 类名: `.tag-border-rotate`

### 图片效果
- 默认: `grayscale` 或 `bg-black/20` 蒙层
- Hover: `grayscale-0`，蒙层消失
- 缩放: 静态 `scale-[1.2]`，hover `scale-110`

---

## 9. CSS 变量汇总

```css
:root {
  /* 品牌色 */
  --paraflow-green: #00C05C;
  --paraflow-green-light: #79F200;
  
  /* 背景色 */
  --paraflow-black: #0A0A0A;
  --paraflow-gray-dark: #1A1A1A;
  --paraflow-gray-medium: #2A2A2A;
  --paraflow-gray-light: #888888;
  
  /* 渐变 */
  --paraflow-gradient: linear-gradient(135deg, #00C05C 0%, #79F200 100%);
  
  /* 圆角 */
  --radius: 0.5rem;
}
```

---

## 10. 设计原则

### 视觉层次
1. **主标题** - 最大字号 + 衬线体 + 白色
2. **副标题** - 中等字号 + 无衬线体 + 灰色
3. **正文** - 小字号 + 高行高 + 更淡灰色
4. **强调** - 绿色渐变 + 动画效果

### 交互反馈
- 所有可交互元素都有 hover 状态
- 过渡动画平滑自然 (300-500ms)
- 使用颜色变化 + 位移/缩放组合

### 空间感
- 大量留白，避免拥挤
- 深色背景 + 发光效果营造深邃感
- 星空/粒子效果增加层次

### 一致性
- 全站使用相同的色彩系统
- 组件样式统一
- 动画时长和曲线保持一致

---

*文档版本: design-v2 | 更新日期: 2024-12-30*
