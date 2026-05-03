# VIMS 2026 Premium UI/UX Redesign
## Complete Design System & Implementation Guide

---

## 1. GLOBAL DESIGN SYSTEM

### 1.1 COLOR PALETTE

#### Primary Colors
```
Primary Blue (Brand): #0066FF
  - Light: #E6F0FF
  - Dark: #0052CC
  - Accent: #0052CC

Secondary Purple: #7C3AED
  - Light: #F3E8FF
  - Accents: #6D28D9

Neutral Base:
  - White: #FFFFFF
  - Off-White: #F8F9FB (Light mode background)
  - Gray-50: #F9FAFB
  - Gray-100: #F3F4F6
  - Gray-200: #E5E7EB
  - Gray-300: #D1D5DB
  - Gray-400: #9CA3AF
  - Gray-600: #4B5563
  - Gray-700: #374151
  - Gray-800: #1F2937
  - Gray-900: #111827
  - Black: #000000

Dark Mode Background:
  - Surface-0 (Darkest): #0A0E27
  - Surface-1 (Cards): #111829
  - Surface-2 (Elevated): #1A1F3A
  - Surface-3 (Hover): #2D3748

Semantic Colors:
  - Success: #10B981 (Green)
  - Warning: #F59E0B (Amber)
  - Error: #EF4444 (Red)
  - Info: #3B82F6 (Blue)
  - Pending: #F59E0B (Amber/Yellow)
  
Stage-Specific Colors (Vehicle Lifecycle):
  - Shipment: #3B82F6 (Blue)
  - Customs: #8B5CF6 (Purple)
  - RMV: #06B6D4 (Cyan)
  - Delivered: #10B981 (Green)
  - Delayed: #EF4444 (Red)
```

#### Dark Mode Override
```
Text Primary: #FFFFFF
Text Secondary: #D1D5DB
Text Tertiary: #9CA3AF
Border: #374151
Hover Background: #2D3748
```

---

### 1.2 TYPOGRAPHY SCALE

```
Font Family: 'Inter' (system: -apple-system, BlinkMacSystemFont, 'Segoe UI')

Scale:
  - Display XL: 48px / 56px (bold) - Page titles
  - Display L: 36px / 44px (bold) - Section headers
  - Heading XL: 28px / 36px (bold) - Major sections
  - Heading L: 24px / 32px (semi-bold) - Card titles
  - Heading M: 20px / 28px (semi-bold) - Subsections
  - Heading S: 18px / 26px (semi-bold) - Small headers
  - Body XL: 16px / 24px (regular) - Primary body text
  - Body L: 15px / 24px (regular) - Standard text
  - Body M: 14px / 20px (regular) - Secondary text
  - Body S: 13px / 19px (regular) - Helper text
  - Caption: 12px / 16px (regular) - Timestamps, badges
  - Mono Code: 12px / 16px (monospace) - Code, IDs

Font Weights:
  - Regular: 400
  - Medium: 500
  - Semi-bold: 600
  - Bold: 700
```

---

### 1.3 SPACING SYSTEM

```
Base Unit: 4px

Scale (Multiples of 4px):
  - xs: 4px
  - sm: 8px
  - md: 12px
  - lg: 16px
  - xl: 24px
  - 2xl: 32px
  - 3xl: 48px
  - 4xl: 64px

Usage:
  - Padding (internal): lg, xl, 2xl
  - Margin (external): lg, xl, 2xl
  - Gaps (flex/grid): md, lg, xl
  - Small elements: sm, md
```

---

### 1.4 BORDER RADIUS

```
Sharp: 0px (rare)
Subtle: 6px (input fields, tags)
Standard: 8px (cards, modals)
Large: 12px (sections, large components)
Full: 9999px (pills, avatars, badges)
```

---

### 1.5 SHADOWS

```
Level 1 (Subtle): 
  Light: 0 1px 2px 0 rgba(0,0,0,0.05)
  Dark: 0 1px 2px 0 rgba(0,0,0,0.2)

Level 2 (Standard):
  Light: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)
  Dark: 0 4px 6px -1px rgba(0,0,0,0.3)

Level 3 (Elevated):
  Light: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)
  Dark: 0 10px 15px -3px rgba(0,0,0,0.4)

Level 4 (Modal):
  Light: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)
  Dark: 0 20px 25px -5px rgba(0,0,0,0.5)

Glassmorphism Overlay:
  backdrop-filter: blur(10px)
  background: rgba(255,255,255,0.7) [Light]
  background: rgba(15,23,42,0.6) [Dark]
  border: 1px solid rgba(0,0,0,0.1) [Light]
  border: 1px solid rgba(255,255,255,0.1) [Dark]
```

---

### 1.6 BUTTON STYLES

#### Primary Button
```
State: Default
  Background: #0066FF
  Text: #FFFFFF
  Height: 40px
  Padding: 10px 16px
  Border Radius: 8px
  Font: Body L, Semi-bold
  Shadow: Level 2
  
State: Hover
  Background: #0052CC (10% darker)
  Shadow: Level 3
  
State: Active/Pressed
  Background: #003D99
  Scale: 0.98
  
State: Disabled
  Background: #D1D5DB
  Text: #9CA3AF
  Cursor: not-allowed
  Opacity: 0.6

State: Loading
  Show spinner inline
  Disabled state applied
```

#### Secondary Button
```
State: Default
  Background: #F3F4F6
  Text: #374151
  Border: 1px solid #D1D5DB
  Height: 40px
  Padding: 10px 16px
  
State: Hover
  Background: #E5E7EB
  Border: 1px solid #9CA3AF
  
Dark Mode:
  Background: #2D3748
  Text: #E5E7EB
  Border: 1px solid #4B5563
```

#### Ghost Button
```
State: Default
  Background: transparent
  Text: #0066FF
  Border: none
  
State: Hover
  Background: rgba(0,102,255,0.1)
  
Dark Mode:
  Background: transparent
  Text: #3B82F6
```

#### Destructive Button
```
Background: #EF4444
Text: #FFFFFF
Hover: #DC2626
```

#### Icon Button
```
Width: 40px
Height: 40px
Border Radius: 8px
Background: transparent
Hover: rgba(0,0,0,0.05)
Dark Hover: rgba(255,255,255,0.1)
```

---

### 1.7 INPUT FIELDS

#### Text Input / Textarea
```
State: Default
  Background: #FFFFFF
  Border: 1px solid #E5E7EB
  Border Radius: 8px
  Height: 40px (input), auto (textarea)
  Padding: 10px 12px
  Font: Body L
  Color: #374151
  Placeholder: #9CA3AF
  
State: Hover
  Border: 1px solid #D1D5DB
  Background: #F9FAFB
  
State: Focus
  Border: 2px solid #0066FF
  Background: #FFFFFF
  Box-shadow: 0 0 0 3px rgba(0,102,255,0.1)
  
State: Disabled
  Background: #F3F4F6
  Border: 1px solid #E5E7EB
  Color: #9CA3AF
  
State: Error
  Border: 2px solid #EF4444
  Box-shadow: 0 0 0 3px rgba(239,68,68,0.1)

Dark Mode:
  Background: #1A1F3A
  Border: 1px solid #374151
  Color: #E5E7EB
  Placeholder: #9CA3AF
  Focus Border: #3B82F6
  Focus Box-shadow: 0 0 0 3px rgba(59,130,246,0.1)
```

#### Select Dropdown
```
Same as Text Input
Show chevron icon on right
Open state: shows menu with level 3 shadow
Menu background: same as input
Menu items: 40px height, padding 12px
Selected item: light blue background (#E6F0FF)
Hover item: light gray (#F3F4F6)
```

#### Checkbox
```
Size: 20px × 20px
Border Radius: 6px
Border: 2px solid #D1D5DB
Checked: background #0066FF, border #0066FF
Checked icon: white checkmark
Focus: box-shadow 0 0 0 3px rgba(0,102,255,0.1)
Dark: border #4B5563, checked #3B82F6
```

#### Radio Button
```
Size: 20px × 20px
Border Radius: 9999px
Border: 2px solid #D1D5DB
Checked: border #0066FF, inner circle #0066FF
Size of inner circle: 8px
```

---

### 1.8 CARD COMPONENTS

#### Standard Card
```
Background: #FFFFFF
Border: 1px solid #E5E7EB
Border Radius: 12px
Padding: 20px
Shadow: Level 2
Hover: 
  Shadow: Level 3
  Transform: translateY(-2px)
  Transition: all 300ms ease-out
  
Dark Mode:
  Background: #111829
  Border: 1px solid #2D3748
```

#### KPI Card (Dashboard)
```
Height: auto (min 140px)
Padding: 24px
Background: Linear gradient (primary color to transparent)
Gradient: from #0066FF (20%) to #F8F9FB (100%)
Border: 1px solid rgba(0,102,255,0.2)
Border Radius: 12px
Shadow: Level 2

Elements:
  - Icon: 40px, top-right, opacity 0.1
  - Title: Body S, secondary color
  - Value: Display S, primary color (bold)
  - Change: Caption, green/red based on trend
  - Sparkline: optional mini chart
```

#### Status Badge
```
Default Style:
  Padding: 6px 12px
  Border Radius: 9999px
  Font: Caption (bold)
  
Shipment: Background #DBEAFE, Text #0C4A6E
Customs: Background #F3E8FF, Text #5B21B6
RMV: Background #CFFAFE, Text #164E63
Delivered: Background #DCFCE7, Text #15803D
Delayed: Background #FEE2E2, Text #7F1D1D
Pending: Background #FEF3C7, Text #92400E

Dark Mode:
  Shipment: Background #1E3A8A, Text #BFDBFE
  Customs: Background #5B21B6, Text #E9D5FF
  RMV: Background #164E63, Text #CFFAFE
  Delivered: Background #15803D, Text #DCFCE7
  Delayed: Background #7F1D1D, Text #FCA5A5
```

---

### 1.9 TABLES

#### Table Structure
```
Header Row:
  Background: #F9FAFB
  Border-bottom: 1px solid #E5E7EB
  Padding: 12px 16px
  Font: Body M (semi-bold)
  Color: #6B7280
  
Body Rows:
  Height: 56px
  Padding: 12px 16px
  Border-bottom: 1px solid #F3F4F6
  Font: Body L
  Color: #374151
  
Row Hover:
  Background: #F9FAFB
  Cursor: pointer
  
Striped (optional):
  Alternate rows: #F3F4F6
  
Dark Mode:
  Header: #1A1F3A background, #D1D5DB text
  Body: #111829 background, #E5E7EB text
  Borders: #2D3748
  Hover: #1F2937
```

---

### 1.10 MODALS & DIALOGS

#### Modal Overlay
```
Background: rgba(0,0,0,0.4) [Light]
Background: rgba(0,0,0,0.6) [Dark]
Backdrop Filter: blur(2px)
Overlay: fixed, full screen
Transition: opacity 300ms ease-out
```

#### Modal Container
```
Width: 90% max 600px (standard)
Max Height: 90vh
Background: #FFFFFF
Border Radius: 12px
Shadow: Level 4
Padding: 32px
Overflow: auto
Dark: Background #111829
```

#### Modal Header
```
Display XL / Heading XL
Font Weight: Bold
Margin Bottom: 24px
```

#### Modal Footer
```
Padding Top: 24px
Border Top: 1px solid #E5E7EB
Display: flex, justify-end, gap-12px
Button spacing: standard
```

---

### 1.11 TRANSITIONS & ANIMATIONS

```
Standard Duration: 300ms
Fast: 150ms
Slow: 500ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)

Hover Effects:
  Scale: 0.98 → 1.02
  Transition: transform 300ms ease-out
  
Fade In:
  From: opacity 0
  To: opacity 1
  Duration: 300ms

Slide In:
  From: transform translateY(10px), opacity 0
  To: transform translateY(0), opacity 1
  Duration: 300ms

Status Change:
  Background flash: 500ms
  Scale pulse: 300ms
  
Loading Skeleton:
  Background: linear gradient left-to-right
  Speed: 2s infinite
  Colors: #E5E7EB → #F3F4F6 → #E5E7EB
  Dark: #2D3748 → #374151 → #2D3748
```

---

### 1.12 BREAKPOINTS

```
Mobile: 0px - 640px (sm)
Tablet: 640px - 1024px (md)
Desktop: 1024px - 1280px (lg)
Wide: 1280px+ (xl)

Layout Adjustments:
  - Sidebar: hidden on mobile, shown on tablet+
  - Card grid: 1 col (mobile), 2 cols (tablet), 3-4 cols (desktop)
  - Modals: full screen (mobile), centered (tablet+)
  - Navigation: hamburger menu (mobile), full (desktop)
```

---

## 2. MAIN LAYOUT STRUCTURE

### 2.1 Global Layout (All Pages)

```
┌─────────────────────────────────────────────────┐
│           TOP NAVBAR (64px)                     │
│ [Logo] Search [Notifications] [Profile]         │
└─────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────┐
│          │                                      │
│ SIDEBAR  │        MAIN CONTENT                  │
│ (260px)  │                                      │
│          │  [Breadcrumb]                        │
│          │  [Page Title]                        │
│          │                                      │
│          │  [Content Grid]                      │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

### 2.2 SIDEBAR NAVIGATION

#### Structure
```
Height: 100vh (fixed)
Width: 260px
Background: #FFFFFF [Light] / #0A0E27 [Dark]
Border Right: 1px solid #E5E7EB [Light]
Z-Index: 40
Overflow Y: auto
Padding: 24px 12px

Collapse Button: Top right, 40px × 40px
  Shows hamburger icon on mobile
  Collapses to 80px on desktop
```

#### Navigation Items

**Main Navigation Section**
```
Logo Area (60px height):
  Logo: 40×40
  Text: "VIMS" (Heading S, bold)
  Spacing: 12px between

Search Bar (40px):
  Placeholder: "Search vehicles, customers..."
  Icon: search icon left
  Background: #F3F4F6
  Border: 1px solid #E5E7EB
  Border Radius: 8px
  Margin: 16px 0

Navigation Menu Items:
  Item Height: 40px
  Padding: 8px 12px
  Margin Bottom: 4px
  Border Radius: 8px
  Font: Body L
  Icon: 20px (left), spacing 12px
  
  States:
    Default: Text #6B7280
    Hover: Background #F3F4F6, Text #374151
    Active: Background #E6F0FF, Text #0066FF, left border 4px #0066FF
    
  Dark Mode:
    Default: Text #9CA3AF
    Hover: Background #1A1F3A, Text #E5E7EB
    Active: Background #1A1F3A, Text #3B82F6, left border #3B82F6
```

#### Menu Structure
```
MAIN
├─ Dashboard          [icon: home]
├─ Customers         [icon: users]
├─ Vehicles          [icon: car]
├─ Invoices          [icon: file-text]
├─ Documents         [icon: folder]
└─ Templates         [icon: layout]

MANAGEMENT
├─ Settings          [icon: settings]
├─ Reports           [icon: bar-chart]
└─ Activity Log       [icon: clock]

BOTTOM
├─ Help              [icon: help-circle]
├─ Feedback          [icon: message]
└─ Sign Out          [icon: log-out]

(Settings → Profile, Preferences, Team, Billing)
```

---

### 2.3 TOP NAVBAR

#### Structure
```
Height: 64px
Background: #FFFFFF [Light] / #111829 [Dark]
Border Bottom: 1px solid #E5E7EB [Light]
Padding: 0 32px
Display: flex, justify-between, align-center
Z-Index: 50
Sticky: top 0
Shadow: Level 1
```

#### Navbar Components

**Left Section**
```
Breadcrumb Navigation (if needed):
  Font: Body S
  Separator: "/"
  Colors: 
    - Inactive: #9CA3AF
    - Active/Last: #374151
```

**Center Section** (varies by page)
```
Search Bar (optional):
  Width: 320px max
  Style: Standard input
  Icon: search (left), clear (right)
  Placeholder: "Search in this section..."
```

**Right Section**
```
Flex, gap: 16px, align-center

Notification Bell (40×40):
  Background: transparent
  Hover: rgba(0,0,0,0.05)
  Icon: bell (20px)
  Badge: 
    - Circle, 24px, #EF4444
    - Number: Caption, bold, white
    - Positioned top-right (-8px, -8px)
  
  Dropdown (on click):
    Width: 380px
    Max Height: 500px
    Position: top-right of bell
    Background: #FFFFFF [Light]
    Border: 1px solid #E5E7EB
    Border Radius: 12px
    Shadow: Level 4
    
    Header: "Notifications", close btn
    Items:
      - Padding: 16px
      - Border-bottom: 1px #F3F4F6
      - Hover: Background #F9FAFB
      - Unread: left border 4px #0066FF
    
    Footer: "View All" link

Theme Toggle (40×40):
  Icon: sun/moon
  Background: transparent
  Hover: rgba(0,0,0,0.05)

Profile Menu (40×40):
  Avatar: 32px circle, initials
  Dropdown:
    Width: 200px
    Items: Profile, Preferences, Sign Out
    Border Radius: 8px
    Shadow: Level 3
    Font: Body M
```

---

### 2.4 CONTENT AREA

#### General Structure
```
Padding: 32px
Background: #F8F9FB [Light] / #0A0E27 [Dark]
Min Height: calc(100vh - 64px)

Page Header (if main section):
  Margin Bottom: 32px
  
  Title Area (flex, justify-between):
    Left:
      Heading XL: page title
      Body S: description
    Right:
      Primary Button (or icon button group)
      
Grid Layout:
  Gap: 24px
  Columns: responsive (1, 2, 3, 4)
```

---

## 3. DASHBOARD SCREEN (Premium Home)

### 3.1 Dashboard Layout

```
┌─────────────────────────────────────────┐
│ Dashboard         [Filter] [Date Range]  │
├─────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Shipment │ │ Customs  │ │   RMV    │ │
│ │   125    │ │    89    │ │   234    │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│ ┌──────────────────────────────────────┐│
│ │ Live Status Overview                 ││
│ │ [Status chips with counts]           ││
│ └──────────────────────────────────────┘│
│ ┌──────────────────┐ ┌────────────────┐│
│ │ Recent Activity  │ │ Shipment       ││
│ │ [Timeline feed]  │ │ Alerts         ││
│ │                  │ │ [Alert cards]  ││
│ └──────────────────┘ └────────────────┘│
│ ┌──────────────────────────────────────┐│
│ │ Vehicle Distribution Chart           ││
│ │ [Pie/Bar chart]                      ││
│ └──────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### 3.2 KPI Cards Section

#### Card 1: Vehicles in Shipment
```
Type: KPI Card
Layout:
  Icon: Airplane icon (top-right, opacity 0.1, size 80px)
  Title: "In Shipment"
  Value: "125"
  Subtitle: "+12 this week"
  Trend: Green arrow up
  
Styling:
  Gradient: from #DBEAFE (light blue) to #F8F9FB
  Border: 1px solid #BFDBFE
  Color Scheme:
    Title: #6B7280
    Value: #0C4A6E
    Subtitle: #0066FF
    Trend: #10B981

Dark Mode:
  Gradient: from #1E3A8A to #0A0E27
  Value: #BFDBFE
  Title: #D1D5DB
```

#### Card 2: Customs Pending
```
Type: KPI Card
Layout:
  Icon: Document icon
  Title: "Customs Pending"
  Value: "89"
  Subtitle: "+5 this week"
  Trend: Orange warning icon
  
Styling:
  Gradient: from #F3E8FF to #F8F9FB
  Border: 1px solid #E9D5FF
  Color Scheme:
    Title: #6B7280
    Value: #5B21B6
    Subtitle: #8B5CF6
    Trend: #F59E0B
```

#### Card 3: RMV Required
```
Type: KPI Card
Layout:
  Icon: Car icon
  Title: "RMV Required"
  Value: "234"
  Subtitle: "3 overdue"
  Flag: Red badge "URGENT"
  
Styling:
  Gradient: from #CFFAFE to #F8F9FB
  Border: 1px solid #A5F3FC
  Color Scheme:
    Title: #6B7280
    Value: #164E63
    Subtitle: #06B6D4
    Flag: #EF4444 background, white text
```

#### Card 4: Delivered Today
```
Type: KPI Card
Layout:
  Icon: Check circle icon
  Title: "Delivered Today"
  Value: "23"
  Subtitle: "On schedule"
  
Styling:
  Gradient: from #DCFCE7 to #F8F9FB
  Border: 1px solid #BBF7D0
  Color Scheme:
    Title: #6B7280
    Value: #15803D
    Subtitle: #10B981
```

---

### 3.3 Live Status Overview

#### Component Structure
```
Height: 60px
Background: #FFFFFF [Light] / #111829 [Dark]
Border: 1px solid #E5E7EB
Border Radius: 12px
Padding: 12px 16px
Display: flex, gap 24px, align-center

Status Chips (each):
  Display: flex, align-center, gap 8px
  Padding: 8px 16px
  Border Radius: 6px
  Background: semi-transparent color
  
  Icon: 16px, status color
  Label: Body M (semi-bold)
  Count: Caption (bold)
  
  Shipment:
    Background: #E6F0FF
    Color: #0066FF
    
  Customs:
    Background: #F3E8FF
    Color: #8B5CF6
    
  RMV:
    Background: #CFFAFE
    Color: #06B6D4
    
  Delivered:
    Background: #DCFCE7
    Color: #10B981
    
  Delayed:
    Background: #FEE2E2
    Color: #EF4444

Animation:
  Hover: scale 1.05, shadow level 2
```

---

### 3.4 Recent Activity Feed

#### Card Structure
```
Width: 100% / 2 columns on desktop, 1 on mobile
Height: auto (min 320px)
Background: #FFFFFF [Light] / #111829 [Dark]
Border: 1px solid #E5E7EB
Border Radius: 12px
Padding: 20px
Shadow: Level 2

Header:
  Font: Heading L (semi-bold)
  Margin Bottom: 20px

Activity Items (repeating):
  Layout:
    ┌─────────────────────────────┐
    │ [Icon] Activity Title        │
    │        Vehicle / Customer    │
    │        2 hours ago          │
    │                             │
    └─────────────────────────────┘
  
  Icon: 
    Width: 40px
    Height: 40px
    Border Radius: 8px
    Background: semi-transparent color
    Icon: 20px, centered
    
  Activity Types:
    Status Update: #0066FF
    Document Upload: #8B5CF6
    Invoice Created: #10B981
    Delivery: #06B6D4
    Alert: #EF4444
  
  Text:
    Title: Body L (semi-bold), #374151
    Subtitle: Body S, #9CA3AF
    Timestamp: Caption, #9CA3AF
  
  Spacing: 12px vertical between items
  Border-bottom: 1px #F3F4F6 between items (except last)

Footer:
  "View All Activity" link, Body M, #0066FF
```

---

### 3.5 Shipment Alerts Section

#### Alert Cards (Right Column)
```
Width: 100% / 1 column
Height: auto
Background: #FFFFFF [Light] / #111829 [Dark]
Border: 1px solid #E5E7EB
Border Radius: 12px
Padding: 20px
Shadow: Level 2

Header:
  Font: Heading L (semi-bold)
  Display: flex, justify-between
  Right: dismiss icon (optional)

Alert Items (repeating):
  Layout:
    ┌──────────────────────────┐
    │ [Icon] Alert Title       │
    │        Description       │
    │        Vehicle Info      │
    │        [Action Button]   │
    └──────────────────────────┘
  
  Height: 80px (min)
  Padding: 12px
  Margin Bottom: 12px
  Border Radius: 8px
  Border Left: 4px solid (type-dependent)
  Background: light tint
  
  Alert Types:
    Delay: #FEE2E2 bg, #EF4444 border
    Warning: #FEF3C7 bg, #F59E0B border
    Info: #DBEAFE bg, #0066FF border
  
  Dark Mode Adjustments:
    Delay: #5B21B6 bg
    Warning: #78350F bg
    Info: #1E3A8A bg
  
  Icon:
    Width: 32px
    Height: 32px
    Border Radius: 6px
    Background: solid type color
    Icon: 16px, white

  Text:
    Title: Body L (semi-bold)
    Description: Body S, secondary
    Vehicle: Caption (mono), #9CA3AF
  
  Action Button:
    Size: sm (32px height)
    Type: Ghost or Secondary
```

---

### 3.6 Distribution Chart

#### Vehicle Status Chart
```
Type: Grid layout, bottom row
Background: #FFFFFF [Light] / #111829 [Dark]
Border: 1px solid #E5E7EB
Border Radius: 12px
Padding: 20px
Height: 320px
Shadow: Level 2

Header:
  Font: Heading L
  Margin Bottom: 20px

Chart Options:
  - Pie Chart: Distribution by status
  - Bar Chart: Vehicles by stage over time
  - Line Chart: Weekly trend

Chart Libraries:
  Recommended: Recharts, Chart.js, or Visx

Colors:
  Shipment: #3B82F6
  Customs: #8B5CF6
  RMV: #06B6D4
  Delivered: #10B981
  Delayed: #EF4444

Legend:
  Below chart, horizontal
  Items: status color square + label
  Font: Body S
```

---

## 4. CUSTOMER MANAGEMENT UI

### 4.1 Customer List Page

```
┌──────────────────────────────────────────┐
│ Customers              [+ New Customer]   │
├──────────────────────────────────────────┤
│ [Search] [Filter v] [Sort v]             │
├──────────────────────────────────────────┤
│ ┌────────────────────────────────────┐   │
│ │ Name    │ Email  │ Vehicles │ ...  │   │
│ ├────────────────────────────────────┤   │
│ │ [Row 1 - clickable, hover effect]  │   │
│ │ [Row 2 - clickable, hover effect]  │   │
│ │ [Row 3 - clickable, hover effect]  │   │
│ └────────────────────────────────────┘   │
│ [Pagination]                             │
└──────────────────────────────────────────┘
```

### 4.2 Customer List Table

#### Table Header + Controls
```
Section: Customers
Title: "All Customers"
Subtitle: "123 total customers"

Top Controls Row:
  Left:
    Search Input (320px): "Search by name, email, phone..."
    Filter Button: "More filters"
  Right:
    [+ New Customer] Button (Primary)

Table:
  Columns:
    ┌─────────────────────────────────────────────┐
    │ Name    Email    Phone    Vehicles  Status  │
    ├─────────────────────────────────────────────┤
    │ Rows (as per table styling section)         │
    └─────────────────────────────────────────────┘
  
  Sortable columns: all (indicated by header chevron)
  
  Row Actions (on hover):
    View Button: Text "View"
    Edit Button: Icon pencil (20px)
    Delete: Icon trash (20px)
    Contact: Icon phone (20px)
```

#### Customer Card (Alternative Compact View)
```
Option: Toggle between table/card view

Card Layout:
  Width: responsive (1, 2, 3 cols)
  Background: #FFFFFF [Light]
  Border: 1px solid #E5E7EB
  Border Radius: 12px
  Padding: 16px
  Height: 160px
  
  Header:
    Display: flex, justify-between
    Name: Heading M (semi-bold), #374151
    Status Badge: Company status
  
  Content:
    Email: Body M, #6B7280
    Phone: Body M, #6B7280
    Vehicles: Body M, #6B7280
    Location: Body M, #6B7280
  
  Footer:
    Display: flex, gap 8px
    Buttons: View (primary ghost), Message (secondary ghost)
  
  Hover:
    Shadow: Level 3
    Transform: translateY(-2px)
```

---

### 4.3 Customer Detail Page

```
┌──────────────────────────────────────────┐
│ Customers > John Smith    [Edit] [Delete]│
├──────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐ │
│ │ [Avatar] John Smith (Company Name)   │ │
│ │ Status: Active                       │ │
│ │ Member since: Jan 15, 2024           │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Tabs: [Info] [Vehicles] [Documents]     │
│                                          │
│ TAB: Information                         │
│ ┌──────────────┬──────────────┐          │
│ │ Email        │ Phone        │          │
│ │ john@...     │ (555) 123-45 │          │
│ │              │              │          │
│ │ Address      │ Company      │          │
│ │ 123 Main St  │ ABC Import.. │          │
│ └──────────────┴──────────────┘          │
│                                          │
│ TAB: Vehicles (Associated)               │
│ ┌──────────────────────────────────────┐ │
│ │ Vehicle List (filtered for customer) │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ TAB: Documents                           │
│ ┌──────────────────────────────────────┐ │
│ │ Uploaded files, contracts, etc.      │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

#### Customer Info Section
```
Layout: 2-column grid
Background: #FFFFFF [Light] / #111829 [Dark]
Border: 1px solid #E5E7EB
Border Radius: 12px
Padding: 24px
Shadow: Level 2

Header Area:
  Display: flex, gap 20px
  
  Avatar:
    Width: 80px
    Height: 80px
    Border Radius: 9999px
    Background: linear-gradient (#0066FF to #7C3AED)
    Color: white
    Font: Display S (bold)
    Initials centered
  
  Info Block:
    Name: Heading XL
    Company: Body L, #9CA3AF
    Status Badge: Active/Inactive
    Joined: Body S, #9CA3AF

Contact Grid:
  2 columns (1 on mobile)
  Gap: 24px
  
  Item:
    Label: Caption (bold), #9CA3AF
    Value: Body L, #374151
    Icon (optional): left
    
  Fields: Email, Phone, Address, Company, City, State, ZIP, Tax ID
```

#### Customer Vehicles Tab
```
Layout: Table showing all vehicles owned by customer

Columns:
  Vehicle | Chassis No | Status | Current Stage | Last Updated | Actions

Sorting: sortable by status, date
Filtering: by stage or status
Empty State: "No vehicles associated yet" with icon

Card View Alternative:
  Compact vehicle cards showing key info
  Grid layout, 2-3 columns
```

#### Customer Documents Tab
```
Layout: File grid or list

Header:
  Title: "Documents (12 files)"
  Filter: by type, date
  Search: file name
  Upload: button or drag-drop zone

Grid:
  Responsive columns
  
  Document Card:
    Icon: file type (PDF, Image, etc.)
    Name: Body M (truncated)
    Date Uploaded: Caption
    Size: Caption
    Actions: Download, Preview, Delete
    Hover:
      Shadow: Level 3
      Actions visible or menu (three dots)
```

---

## 5. VEHICLE MANAGEMENT UI

### 5.1 Vehicle List Page

```
┌──────────────────────────────────────────┐
│ Vehicles              [+ New Vehicle]     │
├──────────────────────────────────────────┤
│ [Search] [Status v] [Stage v] [Sort v]   │
│ [Advanced Filters v]                      │
├──────────────────────────────────────────┤
│ ┌────────────────────────────────────┐   │
│ │ VIN | Make | Owner | Stage | Status│   │
│ ├────────────────────────────────────┤   │
│ │ [Vehicles with status badges]      │   │
│ │ [Clickable rows, hover effect]     │   │
│ └────────────────────────────────────┘   │
│ [Pagination]                             │
└──────────────────────────────────────────┘
```

### 5.2 Vehicle List Controls

#### Search & Filter Bar
```
Height: 50px
Background: #FFFFFF [Light]
Padding: 12px 16px
Border: 1px solid #E5E7EB
Border Radius: 8px
Display: flex, gap 12px

Search Input:
  Width: 250px
  Placeholder: "Search VIN, make, customer..."
  Icon: search left, clear right

Filter Buttons:
  Button 1: "Status"
    Opens dropdown with options:
      All, Active, Completed, Delayed, On Hold
  
  Button 2: "Stage"
    Opens dropdown with options:
      All, Shipment, Customs, RMV, Delivered
  
  Button 3: "Sort"
    Opens dropdown with options:
      Recent, Oldest, Name (A-Z), Status
  
  Advanced Filters Button:
    Opens drawer with:
      Date range
      Customer filter
      Owner filter
      Price range
      [Apply] [Reset]

Results Counter:
  "Showing 1-10 of 45 vehicles"
```

---

### 5.3 Vehicle List Table

#### Table Structure
```
Columns:
  [Checkbox] VIN | Make/Model | Customer | Stage | Status | Date Added | Actions

Column Widths (flexible):
  Checkbox: 40px
  VIN: 140px (monospace, #1a1a1a)
  Make: 180px (semi-bold)
  Customer: 160px
  Stage: 120px (badge)
  Status: 120px (badge)
  Date: 100px (caption)
  Actions: 80px (icon buttons)

Row Height: 56px
Padding: 12px 16px

Vehicle Info Cell:
  Layout: flex, gap 12px
  Image: 40px × 40px, border-radius 6px
  Text:
    Make/Model: Body L (semi-bold)
    VIN: Caption (mono), #9CA3AF
  
  Fallback: Car icon (gray)

Status Badge Cell:
  Uses semantic badge colors
  Width: fit-content
  Clickable: opens quick status menu

Stage Badge Cell:
  Uses stage-specific colors (Shipment, Customs, RMV, Delivered)
  Clickable: opens stage details overlay

Action Buttons (on hover):
  Eye icon: View detail
  Pencil icon: Edit
  More (⋯): Menu with Archive, Delete

Dark Mode:
  Text colors inverted, borders #2D3748
```

---

### 5.4 Vehicle Detail Page (CORE DESIGN)

```
┌────────────────────────────────────────────┐
│ Vehicles > 2024 Toyota Camry (VIN...)      │
│                    [Edit] [Archive] [...]  │
├────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐   │
│ │ [Vehicle Image]  Toyota Camry 2024   │   │
│ │                  Status: In Transit   │   │
│ │                  Customer: John Smith │   │
│ └──────────────────────────────────────┘   │
│                                            │
│ TABS: [Timeline] [Info] [Documents] [Inv] │
│                                            │
│ [Tab: Timeline - HIGHLIGHT FEATURE]        │
│ ┌──────────────────────────────────────┐   │
│ │ ▓ Shipment        (Jan 1)             │   │
│ │    └─ Picked up at port              │   │
│ │    └─ In transit                     │   │
│ │ ▓ Customs         (Jan 5) CURRENT    │   │
│ │    └─ Documents submitted            │   │
│ │    └─ Awaiting clearance             │   │
│ │ ○ RMV              (Pending)          │   │
│ │ ○ Delivered        (Pending)          │   │
│ │                                       │   │
│ │ [Status Update Button]                │   │
│ └──────────────────────────────────────┘   │
│                                            │
│ [Tab: Information]                         │
│ ┌──────────────────────────────────────┐   │
│ │ [Detail grid]                        │   │
│ └──────────────────────────────────────┘   │
│                                            │
│ [Tab: Documents]                           │
│ ┌──────────────────────────────────────┐   │
│ │ [Document list by stage]             │   │
│ └──────────────────────────────────────┘   │
│                                            │
│ [Tab: Invoices]                            │
│ ┌──────────────────────────────────────┐   │
│ │ [Associated invoices]                │   │
│ └──────────────────────────────────────┘   │
└────────────────────────────────────────────┘
```

#### Vehicle Header Card
```
Layout: flex, gap 20px
Background: #FFFFFF
Border: 1px solid #E5E7EB
Border Radius: 12px
Padding: 24px
Shadow: Level 2
Sticky: to top when scrolling (optional)

Left Section: Vehicle Image
  Width: 200px
  Height: 200px
  Border Radius: 12px
  Background: #F3F4F6
  Display: flex, align-center, justify-center
  Image: cover, 100%
  Fallback icon: car (80px, #9CA3AF)
  Badge: "In Transit" (absolute top-left)

Right Section:
  Display: flex, flex-direction: column, gap 16px
  
  Title:
    Font: Display S (bold), #374151
    Make, Model, Year
  
  Status Row:
    Current Stage: "In Customs"
      Badge: stage color, Heading S
    Overall Status: "In Progress"
      Badge: blue, Body L
  
  Customer & Timeline:
    Grid: 2 columns
    Items:
      Label: Caption (bold), #9CA3AF
      Value: Body L, #374151
    
    Fields: Customer, Owner, Vehicle Type, Current Location
  
  Action Buttons:
    Row, gap 12px
    Edit: Primary button
    Archive: Secondary button
    Menu: Icon button (three dots)
```

---

## 6. VEHICLE TIMELINE (PREMIUM FEATURE)

### 6.1 Timeline Design

#### Timeline Container
```
Background: #FFFFFF [Light] / #111829 [Dark]
Border: 1px solid #E5E7EB
Border Radius: 12px
Padding: 32px
Shadow: Level 2

Layout: Vertical flow with steps
```

#### Timeline Step Component

```
┌──────────────────────────────────────────┐
│ ○─────────────────────────────────────────│
│ │ Stage Title (Shipment)                  │
│ │ Status: Completed               Jan 2   │
│ │ ┌─────────────────────────────┐         │
│ │ │ ✓ Picked up from port       │         │
│ │ │ ✓ Customs docs ready        │         │
│ │ │ ✓ Ready for shipment        │         │
│ │ └─────────────────────────────┘         │
│ │ [Expand for details]                    │
│ │                                         │
│ ├─────────────────────────────────────────│
│ ○─ (Current Stage)                        │
│ │ Stage Title (Customs)                   │
│ │ Status: In Progress             Jan 5   │
│ │ Estimated: Jan 12                       │
│ │ ┌─────────────────────────────┐         │
│ │ │ ✓ Documents submitted       │         │
│ │ │ ⏱ Awaiting clearance        │         │
│ │ │ ○ Inspection scheduled      │         │
│ │ └─────────────────────────────┘         │
│ │ [Update Status]                         │
│ │                                         │
│ ├─────────────────────────────────────────│
│ ○────────────────────────────────────────┐│
│   Stage Title (RMV)                       ││
│   Status: Pending                         ││
│   [Add estimate]                          ││
│                                           ││
│ ○────────────────────────────────────────┐│
│   Stage Title (Delivered)                 ││
│   Status: Pending                         ││
│                                           ││
└──────────────────────────────────────────┘│
```

#### Step Structure

**Vertical Timeline Line**
```
Left border: 4px solid
Width: full height
Colors:
  Completed: #10B981 (green)
  Current: #0066FF (blue)
  Upcoming: #E5E7EB (gray)
  Delayed: #EF4444 (red)
```

**Step Node (Circle)**
```
Position: left side
Width: 24px
Height: 24px
Border Radius: 9999px
Border: 3px solid
Margin Top: 16px

States:
  Completed: Background #10B981, border #10B981, checkmark icon white
  Current: Background #0066FF, border #0066FF, circle icon
  Upcoming: Background #FFFFFF, border #D1D5DB
  Delayed: Background #EF4444, border #EF4444, warning icon

Dark Mode:
  Completed: #10B981
  Current: #3B82F6
  Upcoming: #374151
```

**Step Content**
```
Position: right of node
Padding: 16px (left), 0 (other sides)
Margin Bottom: 24px

Header (Flex, space-between):
  Left:
    Title: Heading M (semi-bold), stage name
    Status: Body S, status text (color-coded)
  Right:
    Date: Caption, absolute date (Jan 2, 2024)

Estimated Delivery:
  Show if "In Progress": "Estimated: Jan 12"
  Font: Body S, #9CA3AF

Progress Items:
  List of checkboxes / progress items:
    ✓ Item (completed): green checkmark, strikethrough text
    ⏱ Item (pending): clock icon, normal text
    ○ Item (upcoming): circle, gray text
  
  Font: Body M
  Spacing: 8px vertical
  Margin: 12px 0

Action Area:
  Buttons at bottom of expanded view:
    - [Update Status] (Primary)
    - [View Documents] (Ghost)
    - [Add Note] (Ghost)
  
  Grid: flex, gap 8px
  Button height: 32px

Expand/Collapse:
  Current stage always expanded
  Others collapsed by default
  Click to expand/collapse
  Icon: chevron down/up (right)
```

#### Timeline Interactions

**Click on Future Stage**
```
Opens modal or drawer with:
  - Stage title
  - Description
  - Expected timeline
  - [Schedule this stage] button
  - [Preview documents needed] link
```

**Update Current Stage**
```
Click [Update Status] button
Opens modal:
  Title: "Update Stage: Customs"
  
  Current Status:
    Radio buttons: 
      ○ In Progress
      ○ Completed
      ○ Delayed
      ○ On Hold
  
  Progress Items:
    [x] Checkbox items to mark complete
  
  Notes:
    Textarea: "Add progress notes..."
  
  Estimated Next Date:
    Input: date picker
  
  Buttons:
    [Save] [Cancel]
```

---

### 6.2 Timeline Color Codes

```
Stage Colors:
  Shipment: #3B82F6 (Blue)
    Background: #DBEAFE
    Badges: light blue
    
  Customs: #8B5CF6 (Purple)
    Background: #F3E8FF
    Badges: light purple
    
  RMV: #06B6D4 (Cyan)
    Background: #CFFAFE
    Badges: light cyan
    
  Delivered: #10B981 (Green)
    Background: #DCFCE7
    Badges: light green

Status Colors:
  ✓ Completed: #10B981 (Green)
  ⏱ In Progress: #0066FF (Blue)
  ○ Pending: #9CA3AF (Gray)
  ⚠ Delayed: #EF4444 (Red)
```

---

## 7. INVOICE MODULE (REDESIGNED)

### 7.1 Invoice List Page

```
┌──────────────────────────────────────────┐
│ Invoices              [+ New Invoice]     │
├──────────────────────────────────────────┤
│ [Search] [Status v] [Date v] [Sort v]    │
├──────────────────────────────────────────┤
│ ┌────────────────────────────────────┐   │
│ │ Invoice # | Customer | Amount | ... │   │
│ ├────────────────────────────────────┤   │
│ │ [Invoice rows with preview]        │   │
│ └────────────────────────────────────┘   │
│ [Pagination]                             │
└──────────────────────────────────────────┘
```

#### Invoice List Table
```
Columns:
  [Checkbox] Invoice # | Customer | Amount | Status | Date | Actions

Row:
  Height: 60px
  Invoice Card Content:
    Invoice Number: #INV-2024-001 (mono, bold)
    Customer: "John Smith" (semi-bold)
    Amount: "$5,234.50" (bold, larger)
    Status: "Paid" badge (green)
    Date: "Jan 15, 2024" (caption)
    Actions: Preview, Download, Send, Delete

Status Badges:
  Paid: #DCFCE7 bg, #10B981 text
  Pending: #FEF3C7 bg, #92400E text
  Overdue: #FEE2E2 bg, #7F1D1D text
  Draft: #E5E7EB bg, #6B7280 text

Row Hover:
  Background: #F9FAFB
  Shadow: Level 2
  Actions visible (or menu)
```

---

### 7.2 Invoice Creation Form

```
┌──────────────────────────────────────────┐
│ New Invoice              [Discard] [Save] │
├──────────────────────────────────────────┤
│                                          │
│ SECTION 1: Invoice Details               │
│ ┌──────────────────────────────────────┐ │
│ │ Invoice #:    [#INV-2024-xxx auto]  │ │
│ │ Date:         [Jan 15, 2024]        │ │
│ │ Due Date:     [Feb 15, 2024]        │ │
│ │ Vehicle:      [Dropdown - 2024 Cam..│ │
│ │ Customer:     [John Smith v]        │ │
│ │ Status:       [Draft v]             │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ SECTION 2: Line Items                   │
│ ┌──────────────────────────────────────┐ │
│ │ Description | Qty | Unit Price | ... │ │
│ ├──────────────────────────────────────┤ │
│ │ [Item Row 1]                        │ │
│ │ [Item Row 2]                        │ │
│ │ [+ Add Line Item]                   │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ SECTION 3: Totals & Taxes               │ │
│ ┌──────────────────────────────────────┐ │
│ │ Subtotal:         $5,000.00         │ │
│ │ Tax (10%):        $500.00           │ │
│ │ Total:            $5,500.00         │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ SECTION 4: Notes                         │
│ ┌──────────────────────────────────────┐ │
│ │ [Terms, notes, payment info]        │ │
│ │ [Large textarea]                    │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ [Discard] [Save as Draft] [Preview]     │
└──────────────────────────────────────────┘
```

#### Form Structure Details

**Header Section**
```
Layout: 4 columns
Gap: 16px

Invoice #:
  Input: readonly, auto-generated
  Format: "#INV-2024-001"
  
Date:
  Input: date picker
  Default: today
  
Due Date:
  Input: date picker
  Default: today + 30 days
  
Vehicle:
  Dropdown: searchable
  Shows: [Image] Make Model Year
  Linked to vehicle for auto-fill
  
Customer:
  Dropdown: searchable
  Shows: name, company
  Auto-fill email, address
  
Status:
  Dropdown: Draft, Pending, Sent, Paid, Overdue
  Default: Draft
```

**Line Items Section**
```
Table Layout:
  Columns: Description | Quantity | Unit Price | Amount | Actions

Each Row:
  Description: Text input, long
  Quantity: Number input, 4 columns wide
  Unit Price: Currency input, 4 columns wide
  Amount: Auto-calculated, readonly
  Actions: Delete button

Add Row Button:
  "+ Add Line Item"
  Located below last row
  Primary ghost button

Remove Row:
  Hover on row → delete icon appears
  Or use action menu
```

**Totals Section**
```
Layout: Right-aligned
Width: 300px max

Subtotal:
  Label: Body M
  Value: display-s bold

Tax:
  Input: percentage or fixed amount
  Shows calculation

Total:
  Label: Heading M (bold)
  Value: Heading L (bold), primary color

All values: monospace font, right-aligned
```

**Notes Section**
```
Textarea:
  Height: 120px
  Placeholder: "Payment terms, notes, thank you message..."
  Font: Body M
  Supports markdown or rich text (optional)
```

---

### 7.3 Invoice Preview

```
┌────────────────────────────────────────┐
│ [← Back]         Invoice Preview        │ 
│                            [Download PDF] │
│                            [Send Email]   │
├────────────────────────────────────────┤
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ INVOICE                            │ │
│ │ [Company Logo]                     │ │
│ │                                    │ │
│ │ BILL TO:                           │ │
│ │ John Smith                         │ │
│ │ john@example.com                   │ │
│ │ 123 Main St                        │ │
│ │                                    │ │
│ │ Invoice #: INV-2024-001            │ │
│ │ Date: Jan 15, 2024                 │ │
│ │ Due: Feb 15, 2024                  │ │
│ │                                    │ │
│ │ VEHICLE INFORMATION                │ │
│ │ 2024 Toyota Camry                  │ │
│ │ VIN: ...                           │ │
│ │                                    │ │
│ │ Description       Qty   Price  Amt │ │
│ │ ─────────────────────────────────  │ │
│ │ Import Service     1  $3,000 $3,000│ │
│ │ Customs Fees       1  $1,200 $1,200│ │
│ │ RMV Processing     1   $800  $800  │ │
│ │                                    │ │
│ │ Subtotal:                   $5,000 │ │
│ │ Tax (10%):                   $500  │ │
│ │ ─────────────────────────────────  │ │
│ │ TOTAL:                      $5,500 │ │
│ │                                    │ │
│ │ Notes: Payment due by Feb 15, 2024 │ │
│ └────────────────────────────────────┘ │
│                                        │
│ [← Back] [Download PDF] [Send] [Print] │
└────────────────────────────────────────┘
```

#### Preview Layout
```
Card Container:
  Width: 90%, max 800px
  Aspect Ratio: 8.5/11 (letter)
  Background: #FFFFFF
  Border: 1px solid #E5E7EB
  Padding: 40px (print margins)
  Shadow: Level 3

Header:
  Logo: 60px
  Company Name: Heading XL
  Address: Body S

Invoice Title:
  Font: Display M (bold)
  Margin: 24px top
  "INVOICE"

Bill To Section:
  Heading S: "BILL TO:"
  Customer details: Body M
  
Invoice Details:
  Grid: 2 columns
  Invoice #, Date, Due Date
  Font: Body M

Vehicle Info (if linked):
  Vehicle Image: small thumbnail
  Make, Model, VIN
  Font: Body S

Line Items:
  Table style
  Header: background gray
  Columns: Description, Qty, Unit Price, Amount

Totals:
  Right-aligned
  Subtotal, Tax, Total
  Total: bold, larger

Notes:
  Body S
  Italics
```

#### Preview Action Buttons
```
Top Right (Sticky):
  [Download PDF] - Primary button
  [Send Email] - Secondary button

Bottom (Sticky):
  [← Back] - Ghost
  [Download] - Primary
  [Send] - Secondary
  [Print] - Secondary
```

---

## 8. DOCUMENT MANAGEMENT UI

### 8.1 Document Upload Interface

```
┌──────────────────────────────────────────┐
│ Documents      [Upload] [+ New Folder]   │
├──────────────────────────────────────────┤
│ [Shipment] [Customs] [RMV] [Delivered]   │
├──────────────────────────────────────────┤
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │         Drag files here              │ │
│ │    or click to select files          │ │
│ │                                      │ │
│ │  [Browse Files]                      │ │
│ │                                      │ │
│ │  Accepted: PDF, Images, Documents   │ │
│ │  Max size: 50MB per file            │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Recent Uploads:                          │
│ ┌──────────────────────────────────────┐ │
│ │ [File card] [File card] [File card] │ │
│ │ [File card] [File card]             │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

#### Upload Zone
```
Container:
  Width: 100%
  Height: 240px
  Border: 2px dashed #0066FF
  Border Radius: 12px
  Background: #E6F0FF (light blue)
  Display: flex, flex-direction: column, justify-center, align-center
  Cursor: pointer
  Transition: all 300ms
  
  Hover:
    Border: 2px dashed #0052CC
    Background: #DBEAFE (darker blue)
    Scale: 1.02
  
  Drag Over:
    Border: 2px solid #0066FF
    Background: #BFDBFE (bright blue)

Content:
  Icon: cloud-upload, 48px, #0066FF
  Title: Heading S, #0066FF
  Subtitle: Body S, #6B7280
  Button: "[Browse Files]" - Secondary button, 32px height

Dark Mode:
  Border: #3B82F6
  Background: #1E3A8A
  Icon: #BFDBFE
  Title: #BFDBFE
```

#### Upload Progress
```
Active Upload:
  Progress Bar:
    Height: 4px
    Background: linear-gradient #0066FF to #7C3AED
    Animation: smooth fill

Upload Item (during):
  Layout: flex, gap 12px
  Thumbnail: 40×40
  Name: Body M, #374151
  Progress: "85% - 2.1 / 2.5 MB"
  Cancel: × button (or pause icon)
  
  Height: 50px
  Padding: 8px
  Background: #F9FAFB
```

---

### 8.2 Document List / Grid

#### Document Cards
```
Card Layout:
  Width: responsive (1, 2, 3, 4 cols)
  Height: 180px
  Background: #FFFFFF
  Border: 1px solid #E5E7EB
  Border Radius: 12px
  Padding: 12px
  Shadow: Level 1
  
  Hover:
    Shadow: Level 3
    Transform: translateY(-2px)

Content:
  [File Preview / Icon] (Top, 120px height)
    Thumbnail for images
    File type icon for others
    Badge: file type (PDF, IMG, DOC)
  
  [File Name] (Bottom)
    Truncate to 2 lines
    Font: Body M
    Color: #374151
  
  [File Size] (Bottom)
    Font: Caption
    Color: #9CA3AF
  
  [Date Uploaded] (Bottom)
    Font: Caption
    Color: #9CA3AF

Actions (on hover):
  Overlay: actions menu
  Buttons: Preview, Download, Delete, Share
  Background: rgba(0,0,0,0.7)
  Buttons: white ghost style
```

#### Document Categorization Tabs
```
Tabs (Horizontal):
  [All] [Shipment] [Customs] [RMV] [Delivered] [Other]
  
  Tab Style:
    Padding: 10px 16px
    Border-bottom: 3px solid transparent
    Active: border-bottom #0066FF, text #0066FF
    Inactive: border-bottom transparent, text #6B7280
    Hover: background #F9FAFB
```

---

## 9. NOTIFICATIONS & ACTIVITY SYSTEM

### 9.1 Notification Bell Dropdown

#### Notification List
```
Width: 380px
Max Height: 500px
Background: #FFFFFF
Border: 1px solid #E5E7EB
Border Radius: 12px
Shadow: Level 4
Overflow Y: auto
Position: absolute (top-right of bell)
Z-Index: 100

Header:
  Padding: 16px
  Border-bottom: 1px solid #E5E7EB
  Display: flex, justify-between, align-center
  Title: Heading S, "Notifications"
  Close: × button, 24px

Notification Item:
  Padding: 12px 16px
  Border-bottom: 1px solid #F3F4F6
  Display: flex, gap 12px
  
  Icon:
    Width: 36px
    Height: 36px
    Border Radius: 8px
    Display: flex, align-center, justify-center
    Background: semi-transparent color
  
  Content:
    Flex: 1
    Title: Body M (semi-bold), #374151
    Message: Body S, #6B7280
    Timestamp: Caption, #9CA3AF
  
  Unread Indicator:
    Left border: 4px solid #0066FF
    Background: #F9FAFB
  
  Hover:
    Background: #F9FAFB
    Cursor: pointer

Notification Types:
  Status Update:
    Icon: car, background #DBEAFE, color #0066FF
    
  Document Upload:
    Icon: file, background #F3E8FF, color #8B5CF6
    
  Invoice Created:
    Icon: receipt, background #DCFCE7, color #10B981
    
  Alert/Delay:
    Icon: alert-circle, background #FEE2E2, color #EF4444
    
  System:
    Icon: info, background #DBEAFE, color #0066FF

Footer:
  Padding: 12px 16px
  Border-top: 1px solid #E5E7EB
  Link: "View All Activity", Body M, #0066FF
  Text-align: center
```

---

### 9.2 Activity Timeline

#### Activity Card (in dashboard)
```
Container:
  Background: #FFFFFF
  Border: 1px solid #E5E7EB
  Border Radius: 12px
  Padding: 20px
  Shadow: Level 2

Header: "Recent Activity"
  Font: Heading L (semi-bold)
  Margin Bottom: 20px

Activity Item (repeating):
  Layout: flex, gap 12px
  Margin Bottom: 16px
  
  Avatar/Icon:
    Width: 40px
    Height: 40px
    Border Radius: 8px
    Background: semi-transparent
    Icon: 20px, centered
  
  Content:
    Title: Body L (semi-bold), #374151
    Description: Body S, #6B7280
    Vehicle/Reference: Caption (mono), #9CA3AF
    Timestamp: Caption, #9CA3AF
  
  Action (optional):
    Right side
    Icon button or link
  
  Separator: 1px solid #F3F4F6 (except last)

Activity Types:
  Vehicle Created:
    Icon: plus-circle, #0066FF
  
  Status Updated:
    Icon: refresh-cw, #0066FF
  
  Document Added:
    Icon: file-plus, #8B5CF6
  
  Invoice Generated:
    Icon: receipt, #10B981
  
  Delivery Confirmed:
    Icon: check-circle, #10B981
  
  Delay Reported:
    Icon: alert-circle, #EF4444

Footer:
  Link: "View All", Body M, #0066FF
  Text-align: center
  Padding Top: 16px
  Border-top: 1px solid #E5E7EB
```

---

## 10. MOBILE RESPONSIVENESS

### 10.1 Mobile Layout (< 640px)

#### Navigation
```
Top: Full-width navbar (64px height)
  Logo: 32px
  Menu: hamburger icon (40×40, right side)
  Icons: notifications, profile

Sidebar:
  Hidden by default
  Slide-in from left on menu click
  Overlay: rgba(0,0,0,0.4) backdrop
  Z-Index: 99
  Width: 80% or 260px (max)
  Full height

Content:
  Padding: 16px (reduced)
  Full width
```

#### Grid Adjustments
```
All Cards: 1 column
KPI Cards: full width, stacked vertical
Charts: full width, height auto or scrollable
Tables: horizontal scroll or card view
Modals: full screen with padding 16px

Form Inputs:
  Full width
  Height: 44px (touch-friendly)
  Font size: 16px (prevents zoom on iOS)
```

#### Buttons
```
Height: 44px minimum
Padding: 12px 16px
Touch target: minimum 44×44
Spacing: 12px gap
Full width on mobile for primary actions
```

---

### 10.2 Tablet Layout (640px - 1024px)

```
Sidebar: Shown (collapsed to 80px with icons)
  Hover: expands to 260px
  Or: Always shown

Content Grid:
  2 columns (cards, documents)
  2 columns (KPI cards)
  Full width (tables, forms)

Modals:
  Width: 90%
  Max-width: 500px
  Centered on screen
```

---

## 11. MICRO INTERACTIONS

### 11.1 Hover Effects

#### Cards
```
Transform: translateY(-2px)
Shadow: Level 1 → Level 3
Transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1)
Cursor: pointer (clickable)
```

#### Buttons
```
Hover: scale 1.05
Active: scale 0.98
Transition: transform 150ms
Shadow: Level 1 → Level 2
Cursor: pointer

Disabled: opacity 0.6, cursor not-allowed, no transform
```

#### Links
```
Default: color #0066FF, no underline
Hover: color #0052CC, underline
Transition: all 150ms
```

---

### 11.2 Loading States

#### Skeleton Screens
```
Background: linear-gradient(
  90deg,
  #E5E7EB 0%,
  #F3F4F6 50%,
  #E5E7EB 100%
)
Background Size: 200% 100%
Animation: shimmer 2s infinite

Skeleton Elements:
  Text lines: height 12px, width varied, border-radius 4px
  Avatar: 40×40 circle
  Card: full skeleton match
  
Dark Mode:
  #2D3748 → #374151 → #2D3748
```

#### Loading Spinner
```
SVG or CSS spinner
Size: 24px default, 32px (large)
Color: #0066FF
Animation: rotate 1s linear infinite
Placement: centered, with optional text below
```

---

### 11.3 Status Change Animations

#### Successful Status Update
```
Background Flash:
  From: rgba(16, 185, 129, 0.2)
  To: transparent
  Duration: 500ms

Icon Animation:
  Checkmark appears with scale 0 → 1
  Duration: 400ms
  Delay: 100ms
```

#### Error Toast Notification
```
Slide in from top:
  From: translateY(-100%)
  To: translateY(0)
  Duration: 300ms

Auto-dismiss: 5 seconds
Swipe to dismiss on mobile
```

#### Stage Progress
```
Step completion:
  Checkmark appears with bounce effect
  Height of checkmark: 0 → 1 with cubic-bezier
  Duration: 400ms
  
Line fill:
  Animated color change for timeline
  Duration: 300ms
```

---

### 11.4 Transitions

#### Page Navigation
```
Default: Fade
Duration: 300ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)

Slide (for sidebars):
  Duration: 300ms
  Direction: left/right
  Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

#### Modal Open/Close
```
Open:
  Fade: opacity 0 → 1
  Scale: scale 0.95 → 1
  Duration: 300ms

Close:
  Reverse
  Duration: 200ms (faster)
```

#### Dropdown Menus
```
Open:
  Fade: opacity 0 → 1
  Slide: translateY(-10px) → translateY(0)
  Duration: 200ms

Close:
  Reverse
  Duration: 150ms
```

---

## 12. RESPONSIVE BEHAVIOR

### 12.1 Breakpoint-Specific Changes

#### @ 0px - 640px (Mobile)
```
- Sidebar: hidden, hamburger menu
- Top navbar: full width, padding 12px
- Content: padding 12px
- Cards: full width, 1 column
- Tables: horizontal scroll (native)
- Modals: full screen
- Buttons: 44px height minimum
- Font sizes: unchanged (readability)
```

#### @ 640px - 1024px (Tablet)
```
- Sidebar: shown, collapsible
- Content: padding 20px
- Cards: 2 columns
- KPI cards: 2 columns
- Tables: full width, horizontal scroll if needed
- Modals: 90% width, max 500px
- Buttons: responsive sizing
```

#### @ 1024px+ (Desktop)
```
- Sidebar: always shown (260px)
- Content: padding 32px
- Cards: 3-4 columns
- KPI cards: 4 columns
- Tables: full width, no scroll
- Modals: centered, 600px
- Optimal readability
```

---

## 13. IMPLEMENTATION GUIDELINES

### 13.1 React Component Structure

```
src/
├─ components/
│  ├─ layout/
│  │  ├─ Sidebar.jsx
│  │  ├─ Navbar.jsx
│  │  ├─ MainLayout.jsx
│  │  └─ ContentArea.jsx
│  │
│  ├─ dashboard/
│  │  ├─ Dashboard.jsx
│  │  ├─ KPICard.jsx
│  │  ├─ StatusOverview.jsx
│  │  ├─ ActivityFeed.jsx
│  │  └─ ShipmentAlerts.jsx
│  │
│  ├─ vehicles/
│  │  ├─ VehicleList.jsx
│  │  ├─ VehicleDetail.jsx
│  │  ├─ VehicleTimeline.jsx
│  │  └─ TimelineStep.jsx
│  │
│  ├─ customers/
│  │  ├─ CustomerList.jsx
│  │  ├─ CustomerDetail.jsx
│  │  └─ CustomerCard.jsx
│  │
│  ├─ invoices/
│  │  ├─ InvoiceList.jsx
│  │  ├─ InvoiceForm.jsx
│  │  └─ InvoicePreview.jsx
│  │
│  ├─ documents/
│  │  ├─ DocumentUpload.jsx
│  │  ├─ DocumentGrid.jsx
│  │  └─ DocumentCard.jsx
│  │
│  ├─ common/
│  │  ├─ Button.jsx
│  │  ├─ Card.jsx
│  │  ├─ Badge.jsx
│  │  ├─ Input.jsx
│  │  ├─ Select.jsx
│  │  ├─ Modal.jsx
│  │  └─ NotificationDropdown.jsx
│  │
│  └─ icons/
│     └─ [icon components]
│
├─ styles/
│  ├─ globals.css
│  ├─ tailwind.config.js
│  ├─ colors.js
│  └─ animations.css
│
├─ utils/
│  ├─ constants.js
│  ├─ formatters.js
│  └─ helpers.js
│
└─ pages/
   ├─ Dashboard.jsx
   ├─ Vehicles.jsx
   ├─ Customers.jsx
   ├─ Invoices.jsx
   ├─ Documents.jsx
   └─ Settings.jsx
```

### 13.2 Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0FF',
          100: '#DBEAFE',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
        },
        secondary: {
          50: '#F3E8FF',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
      },
      borderRadius: {
        'subtle': '6px',
        'standard': '8px',
        'large': '12px',
      },
      boxShadow: {
        'level-1': '0 1px 2px 0 rgba(0,0,0,0.05)',
        'level-2': '0 4px 6px -1px rgba(0,0,0,0.1)',
        'level-3': '0 10px 15px -3px rgba(0,0,0,0.1)',
        'level-4': '0 20px 25px -5px rgba(0,0,0,0.1)',
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
};
```

---

## 14. SUMMARY: UI IMPRESSION

This redesign transforms VIMS into:

✅ **Premium SaaS Quality**
  - Glassmorphism + modern gradients
  - Sophisticated color palette
  - Refined typography & spacing
  - Professional dark/light themes

✅ **Highly Usable**
  - Clear information hierarchy
  - Intuitive navigation
  - Fast workflows (vehicle timeline, quick status updates)
  - Touch-friendly mobile

✅ **Visually Impressive**
  - Modern card-based layouts
  - Smooth animations
  - Color-coded lifecycle stages
  - Professional dashboard

✅ **Production Ready**
  - Scalable component system
  - Responsive to all devices
  - Accessibility considerations
  - Dark mode support

This is 2026-level SaaS UI — ready for demos, investors, and users.

---

## NEXT STEP: IMPLEMENTATION

Ready to code the React components and Tailwind styling? 

I can create:
1. Complete component library
2. Layout wrappers
3. Page implementations
4. Responsive styling
5. Dark mode support
6. Animation definitions

Let me know!
