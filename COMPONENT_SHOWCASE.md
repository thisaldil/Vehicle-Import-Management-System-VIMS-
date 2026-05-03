# VIMS 2026 - Visual Component Guide

## COMPLETE UI COMPONENT SHOWCASE

This guide shows what each component looks like in the application.

---

## 1. BASE COMPONENTS

### Button Variants
```
┌─────────────────────────────────────────────┐
│                                             │
│  [Primary Button]  [Secondary Button]       │
│  [Ghost Button]    [Destructive Button]     │
│  [Disabled Button] [Loading Button...]      │
│                                             │
└─────────────────────────────────────────────┘
```

**Sizes**: Small (32px), Medium (40px), Large (44px)

---

### Card Component
```
┌─────────────────────────────────────────────┐
│                                             │
│  Card Title                                 │
│                                             │
│  Card content goes here. Cards have         │
│  rounded corners, subtle shadow, and        │
│  smooth hover effects.                      │
│                                             │
│  On hover: shadow increases, lifts up      │
│                                             │
└─────────────────────────────────────────────┘
```

---

### Badge Component
```
┌──────────────────────────────────┐
│                                  │
│  ✈️ Shipment   ✓ Delivered       │
│  📋 Customs    ⚠️ Delayed        │
│  🚗 RMV        ⏱ Pending        │
│                                  │
└──────────────────────────────────┘
```

**Colors**: 10 semantic status colors

---

### Input Fields
```
┌──────────────────────────────────────┐
│  Search                              │
│  ┌────────────────────────────────┐  │
│  │ 🔍 Type to search...          │  │
│  └────────────────────────────────┘  │
│                                      │
│  Email (with validation)             │
│  ┌────────────────────────────────┐  │
│  │ email@example.com              │  │
│  └────────────────────────────────┘  │
│                                      │
│  Error State                         │
│  ┌────────────────────────────────┐  │
│  │ invalid value ✗                │  │
│  └────────────────────────────────┘  │
│  Error message in red               │
│                                      │
└──────────────────────────────────────┘
```

---

### Select Dropdown
```
┌────────────────────────────────┐
│  Status                         │
│  ┌──────────────────────────┐   │
│  │ Select... ▼              │   │
│  └──────────────────────────┘   │
│                                │
│  Open:                          │
│  ┌──────────────────────────┐   │
│  │ All Statuses            │   │
│  │ Active                  │   │
│  │ Pending                 │   │
│  │ Completed ✓             │   │
│  └──────────────────────────┘   │
└────────────────────────────────┘
```

---

### Modal Dialog
```
┌──────────────────────────────────────────┐
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ Modal Title                   ✕  │   │
│  ├──────────────────────────────────┤   │
│  │                                  │   │
│  │  Modal content goes here.        │   │
│  │  Can contain forms, messages,    │   │
│  │  images, etc.                    │   │
│  │                                  │   │
│  ├──────────────────────────────────┤   │
│  │         [Cancel] [Confirm]       │   │
│  └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

---

## 2. LAYOUT COMPONENTS

### Complete Layout Structure
```
┌────────────────────────────────────────────────┐
│  VIMS Logo    Search    🔔 Notifications  ⚙️   │
├───────────┬──────────────────────────────────┤
│           │                                  │
│ Dashboard │  Dashboard                       │
│ Customers │  ┌──────────────────────────┐   │
│ Vehicles  │  │  Welcome back! Here's    │   │
│ Invoices  │  │  your current status.    │   │
│ Documents │  └──────────────────────────┘   │
│ Templates │                                  │
│           │  [Content Area]                  │
│ ─────────┤                                  │
│ Settings │  [KPI Cards, Charts, etc.]      │
│ Reports  │                                  │
│ Activity │                                  │
│           │                                  │
│ ─────────┤                                  │
│ Help     │                                  │
│ Feedback │                                  │
│ Sign Out │                                  │
│           │                                  │
└───────────┴──────────────────────────────────┘
```

---

### Sidebar Navigation
```
┌──────────────────┐
│ V VIMS           │ ← Logo
│ ┌──────────────┐ │
│ │ 🔍 Search... │ │ ← Search
│ └──────────────┘ │
│                  │
│ 🏠 Dashboard  ✓  │ ← Active
│ 👥 Customers     │
│ 🚗 Vehicles      │
│ 📄 Invoices      │
│ 📁 Documents     │
│ 📋 Templates     │
│                  │
│ ─────────────── │
│ ⚙️ Settings      │
│ 📊 Reports       │
│ 🕐 Activity      │
│                  │
│ ─────────────── │
│ ❓ Help         │
│ 💬 Feedback     │
│ 🚪 Sign Out     │
│                  │
└──────────────────┘
```

---

### Top Navbar
```
┌────────────────────────────────────────────────┐
│ ☰  Dashboard            🔔 3  🌙  [JD]        │
│    ▼ Breadcrumb                                │
└────────────────────────────────────────────────┘
```

---

## 3. DASHBOARD COMPONENTS

### KPI Cards Grid
```
┌───────────────────────────────────────────────────┐
│                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌────────┐   │
│  │ ✈️          │  │ 📋          │  │ 🚗     │   │
│  │ In Shipment │  │ Customs     │  │ RMV    │   │
│  │ 125         │  │ 89          │  │ 234    │   │
│  │ +12 week ↑  │  │ +5 week     │  │ 3 due  │   │
│  └─────────────┘  └─────────────┘  └────────┘   │
│                                                   │
│  ┌─────────────┐                                 │
│  │ ✓           │                                 │
│  │ Delivered   │                                 │
│  │ 23          │                                 │
│  │ On schedule │                                 │
│  └─────────────┘                                 │
│                                                   │
└───────────────────────────────────────────────────┘
```

---

### Status Overview Chips
```
┌────────────────────────────────────────────┐
│                                            │
│  ✈️ Shipment      📋 Customs      🚗 RMV  │
│     125            89              234     │
│                                            │
│  ✓ Delivered                              │
│     512                                    │
│                                            │
└────────────────────────────────────────────┘
```

---

### Activity Feed
```
┌────────────────────────────────────────────┐
│  Recent Activity                            │
│                                            │
│  🚗 Vehicle Status Updated                 │
│     Toyota Camry moved to Customs          │
│     VIN: 4T1BF1AK5CU123456                 │
│     2 hours ago                            │
│                                            │
│  📄 Document Uploaded                      │
│     Shipment documents added               │
│     VIN: 1HGCV51387A456789                 │
│     4 hours ago                            │
│                                            │
│  💰 Invoice Created                        │
│     New invoice for John Smith             │
│     INV-2024-001                           │
│     6 hours ago                            │
│                                            │
│  ──────────────────────────────            │
│  View All Activity →                       │
│                                            │
└────────────────────────────────────────────┘
```

---

### Shipment Alerts
```
┌────────────────────────────────────────────┐
│  Shipment Alerts                            │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ ⚠️ Customs Clearance Delay            │  │
│  │    Vehicle awaiting inspection 3 days │  │
│  │    VIN: 4T1BF1AK5CU123456             │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ 🔔 RMV Registration Due               │  │
│  │    RMV required within 2 days         │  │
│  │    VIN: 1HGCV51387A456789             │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ ℹ️  Shipment Arrived                  │  │
│  │    New shipment at warehouse          │  │
│  │    SHP-2024-001                       │  │
│  └──────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

---

## 4. VEHICLE TIMELINE (PREMIUM FEATURE)

### Complete Timeline
```
┌──────────────────────────────────────────────┐
│  Vehicle Lifecycle Timeline                   │
│                                              │
│  ✓──────────────────────────────────────────│
│  ✈️ Shipment (Completed)          Jan 2     │
│  ┌────────────────────────────────────────┐ │
│  │ ✓ Picked up from origin port          │ │
│  │ ✓ In transit to destination           │ │
│  │ ✓ Arrived at destination port         │ │
│  │ ▼ Collapse                             │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ●──────────────────────────────────────────│
│  📋 Customs (In Progress - CURRENT) Jan 5   │
│  Estimated: Jan 12                           │
│  ┌────────────────────────────────────────┐ │
│  │ ✓ Customs documents submitted         │ │
│  │ ⏱ Awaiting clearance                  │ │
│  │ ○ Inspection scheduled                │ │
│  │ [Update Status] [Expand]              │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ○──────────────────────────────────────────│
│  🚗 RMV (Pending)                           │
│  ▶ Expand Details                           │
│                                              │
│  ○──────────────────────────────────────────│
│  ✓ Delivered (Pending)                     │
│  ▶ Expand Details                           │
│                                              │
└──────────────────────────────────────────────┘
```

---

### Status Update Modal
```
┌──────────────────────────────────────────┐
│                                          │
│  Update: Customs                    ✕    │
│  ┌──────────────────────────────────┐   │
│                                     │   │
│  Current Status                    │   │
│  ○ In Progress ✓                   │   │
│  ○ Completed                       │   │
│  ○ Delayed                         │   │
│  ○ On Hold                         │   │
│                                     │   │
│  Progress Items                    │   │
│  ☑ Customs documents submitted     │   │
│  ☐ Awaiting clearance              │   │
│  ☐ Inspection scheduled            │   │
│                                     │   │
│  Estimated Completion Date         │   │
│  [Jan 12, 2024          ▼]         │   │
│                                     │   │
│  Progress Notes                    │   │
│  ┌──────────────────────────────┐  │   │
│  │ Add progress notes...        │  │   │
│  │                              │  │   │
│  └──────────────────────────────┘  │   │
│                                     │   │
│  ┌──────────────────────────────┐   │   │
│  │      [Cancel]  [Save]        │   │   │
│  └──────────────────────────────┘   │   │
│                                      │   │
└──────────────────────────────────────┘   │
```

---

## 5. VEHICLES LIST

### Search & Filter Bar
```
┌─────────────────────────────────────────────┐
│                                             │
│  [🔍 Search VIN, make...] [Status ▼]       │
│  [Stage ▼] [Sort ▼]                        │
│                                             │
└─────────────────────────────────────────────┘
```

---

### Vehicle Table
```
┌──────────────────────────────────────────────┐
│ VIN               │ Make           │ Stage  │
├──────────────────────────────────────────────┤
│ 4T1BF1AK5CU123456 │ 2024 Toyota    │ ✈️     │
│                   │ Camry          │        │
│ Action: View Edit                           │
├──────────────────────────────────────────────┤
│ 1HGCV51387A456789 │ 2024 Honda     │ ✓      │
│                   │ Civic          │        │
│ Action: View Edit                           │
├──────────────────────────────────────────────┤
│ 2HGCV51387H456789 │ 2024 Ford      │ 🚗     │
│                   │ F-150          │        │
│ Action: View Edit                           │
│                                             │
└──────────────────────────────────────────────┘
```

---

## 6. CUSTOMERS LIST

### Customer Table
```
┌────────────────────────────────────────────┐
│ Name       │ Email          │ Vehicles │   │
├────────────────────────────────────────────┤
│ John Smith │ john@email.com │ 5        │   │
│            │ (555) 123-4567 │ Active   │   │
├────────────────────────────────────────────┤
│ Jane Doe   │ jane@email.com │ 3        │   │
│            │ (555) 987-6543 │ Active   │   │
├────────────────────────────────────────────┤
│ Bob Wilson │ bob@email.com  │ 2        │   │
│            │ (555) 456-7890 │ Inactive │   │
│                                             │
└────────────────────────────────────────────┘
```

---

## 7. INVOICES

### Invoice Cards
```
┌──────────────────────┐  ┌──────────────────────┐
│ INV-2024-001         │  │ INV-2024-002         │
│ $5,234.50            │  │ $3,456.75            │
│                      │  │                      │
│ John Smith           │  │ Jane Doe             │
│ ✓ Paid               │  │ ⏱ Pending           │
│ Jan 15, 2024         │  │ Jan 16, 2024        │
│                      │  │                      │
│ [Download] [Send]    │  │ [Download] [Send]    │
└──────────────────────┘  └──────────────────────┘
```

---

## 8. DARK MODE VARIANTS

### Light Mode
```
┌─────────────────────────────────────┐
│ Background: White (#FFFFFF)         │
│ Text: Dark Gray (#111827)           │
│ Border: Light Gray (#E5E7EB)        │
│ Card: White with subtle shadow      │
└─────────────────────────────────────┘
```

### Dark Mode
```
┌─────────────────────────────────────┐
│ Background: Dark (#0A0E27)          │
│ Text: Light White (#FFFFFF)         │
│ Border: Dark Gray (#374151)         │
│ Card: Dark Surface (#111829)        │
└─────────────────────────────────────┘
```

---

## 9. RESPONSIVE BEHAVIOR

### Mobile (< 640px)
```
Single column layout
Hamburger menu sidebar
Full-width components
Touch-friendly buttons (44px min)
```

### Tablet (640px - 1024px)
```
2-column layout for cards
Collapsible sidebar (80px ↔ 260px)
Larger fonts for readability
Balanced spacing
```

### Desktop (1024px+)
```
3-4 column layout
Full sidebar always shown
Rich layouts
Optimal spacing & typography
```

---

## 10. COLOR PALETTE SHOWCASE

### Primary & Secondary
```
┌────────────────────┐
│ Primary: #0066FF   │ [Primary Blue Button]
│ Secondary: #7C3AED│ [Secondary Purple]
│ Success: #10B981   │ [Green Badge]
│ Warning: #F59E0B   │ [Amber Alert]
│ Error: #EF4444     │ [Red Destructive]
└────────────────────┘
```

### Stage Colors
```
┌─────────────────────────────────────┐
│ ✈️ Shipment: #3B82F6 (Blue)          │
│ 📋 Customs: #8B5CF6 (Purple)         │
│ 🚗 RMV: #06B6D4 (Cyan)               │
│ ✓ Delivered: #10B981 (Green)         │
│ ⚠️ Delayed: #EF4444 (Red)            │
└─────────────────────────────────────┘
```

---

## SUMMARY

This is a **2026-level premium SaaS UI** featuring:

✅ **26 Production Components**  
✅ **Clean, Modern Design**  
✅ **Full Dark Mode**  
✅ **Smooth Animations**  
✅ **Responsive Layout**  
✅ **Stage-Specific Colors**  
✅ **Professional Typography**  
✅ **Accessibility Support**  

---

## NEXT STEPS

1. Review the components in this guide
2. See them in action by integrating the code
3. Customize colors and spacing as needed
4. Build your custom pages using these components
5. Deploy to production

---

**Ready to build something amazing? Let's go! 🚀**
