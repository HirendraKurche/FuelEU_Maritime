# FuelEU Maritime Compliance Platform - Design Guidelines

## Design Approach

**Selected System**: Material Design 3 (Material You)
**Justification**: Optimal for data-dense enterprise applications with strong emphasis on hierarchy, readability, and functional clarity. Material's elevation system, state layers, and component patterns excel at displaying complex tabular data and multi-step workflows.

**Core Principles**:
- Clarity over decoration - every element serves a functional purpose
- Strong visual hierarchy for scanning large datasets
- Consistent component behavior across all compliance workflows
- Accessibility-first approach for regulatory compliance contexts

---

## Typography System

**Font Family**: 
- Primary: 'Inter' (Google Fonts) - exceptional readability for data tables
- Monospace: 'JetBrains Mono' - for numerical values, emissions data, route IDs

**Hierarchy**:
- Page Titles: text-3xl font-semibold (H1)
- Section Headers: text-xl font-semibold (H2)
- Card Titles: text-lg font-medium (H3)
- Table Headers: text-sm font-semibold uppercase tracking-wide
- Body Text: text-base font-normal
- Data Values: text-sm font-medium (numerical data)
- Labels/Captions: text-xs font-medium uppercase tracking-wide

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** consistently
- Component padding: p-6
- Card spacing: p-8
- Section margins: mb-8, mt-12
- Grid gaps: gap-6
- Button padding: px-6 py-3

**Container Strategy**:
- Main dashboard: max-w-7xl mx-auto px-6
- Full-width tables: w-full with horizontal scroll on mobile
- Card containers: max-w-4xl for forms, full-width for data tables

**Grid Layouts**:
- KPI Cards: grid-cols-1 md:grid-cols-3 gap-6
- Filter Controls: grid-cols-1 md:grid-cols-4 gap-4
- Pool Members: grid-cols-1 gap-4 (stack vertically for clarity)

---

## Component Library

### Navigation
**Top Bar**: Fixed header with logo, navigation tabs, and user profile
- Tab navigation: Horizontal pills with active state indicator
- Sticky positioning for context retention during scrolling

### Data Tables
**Structure**: 
- Elevated surface with subtle shadow
- Fixed header row with sort indicators
- Alternating row backgrounds for scannability
- Hover states on rows
- Monospace font for numerical columns (GHG intensity, CB values)
- Right-align numerical data, left-align text
- Action column (far right) for row-level operations

**Table Features**:
- Pagination controls (bottom-right)
- Items per page selector
- "Set Baseline" button inline with route rows
- Compliance indicators (✅/❌) as badges

### Cards & Surfaces
**KPI Cards**: 
- Elevated card with rounded-lg
- Large numerical value (text-3xl font-bold)
- Label above (text-xs uppercase)
- Trend indicator or status badge
- Subtle border on left edge for category indication

**Filter Panel**:
- Contained surface (bg-gray-50 rounded-lg p-6)
- Dropdown selects for vessel type, fuel type, year
- "Apply Filters" and "Clear" buttons
- Compact, horizontal layout on desktop

### Forms & Inputs
**Input Fields**:
- Material-style floating labels
- Clear focus states with border highlight
- Helper text below inputs
- Error states with inline validation messages
- Consistent height (h-12)

**Buttons**:
- Primary action: Solid fill, rounded-lg, px-6 py-3
- Secondary action: Outlined variant
- Disabled state: Reduced opacity with cursor-not-allowed
- Icon + text combinations where appropriate

### Data Visualization
**Charts (Recharts)**:
- Comparison bar chart showing baseline vs actual GHG intensity
- Horizontal bars for easy value comparison
- Target line overlay at 89.3368 gCO₂e/MJ
- Tooltip with detailed breakdown
- Legend positioned top-right

**Status Indicators**:
- Compliance badges: Green checkmark (✅), Red X (❌)
- Pool health: Red/green dot indicator with sum value
- Banking status: Chip with amount and year

### Banking & Pooling Interfaces
**Banking Actions**:
- Two-column layout: Current balance (left), Actions (right)
- "Bank Surplus" and "Apply Banked" buttons
- Disabled states when CB ≤ 0
- Before/after CB display with animated transition

**Pool Creation**:
- Member selection interface with checkboxes
- Real-time validation feedback
- Member list showing ship ID, CB before, CB after
- Pool sum total at bottom (highlighted in red if negative, green if valid)
- Prevent submission if validation fails

---

## Accessibility Requirements

- WCAG 2.1 AA compliance throughout
- All form inputs have associated labels
- Focus indicators on all interactive elements (ring-2 ring-offset-2)
- Sufficient contrast ratios (minimum 4.5:1 for text)
- Keyboard navigation support for all workflows
- ARIA labels for icon-only buttons
- Screen reader announcements for dynamic updates (CB changes, pool validation)
- Skip navigation links

---

## Responsive Behavior

**Breakpoints**:
- Mobile: < 768px - Stack tables vertically, horizontal scroll
- Tablet: 768px-1024px - 2-column KPI grid
- Desktop: > 1024px - Full multi-column layouts

**Mobile Optimizations**:
- Collapsible filter panels
- Sticky action buttons at bottom
- Card-based table views for complex data
- Touch-friendly target sizes (min 44x44px)

---

## No Images Required

This is a pure data-driven dashboard application. No hero images or decorative photography needed. All visual communication handled through data visualization, charts, and UI components.