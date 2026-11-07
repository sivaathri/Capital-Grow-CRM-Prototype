# Capital Grow CRM Prototype (React + Vite + Tailwind CSS)

Modern Overseas Education Loan & Student Financing CRM built with **React**, **Vite**, and **Tailwind CSS**.

## Features Included

- **Branded Authentication**:
  - Split-screen modern login with destination chips (USA, UK, Canada, Australia, Germany, France).
  - Pre-configured demo credentials: `admin@capitalgrow.co.in` / `Admin@123`.
  - Password reveal toggle & "Remember me" session persistence.

- **App Shell & Modern Navigation**:
  - Collapsible branded sidebar with navy-to-blue gradient and sub-item dropdowns.
  - Sticky topbar with global search autocomplete, notification reminders dropdown, and user profile management.
  - Floating toast notification alerts and confirmation modals.

- **Executive CRM Dashboard**:
  - 5 Stat KPI metric cards (Total Customers, Loan Applications, Sanctioned Loans, Disbursement, Insurance Enquiries).
  - SVG Area & Line Chart for comparative enquiry trends over time.
  - Interactive Application Status Donut Chart with percentages.
  - Recent enquiries table with status pills and quick customer view.
  - Today's Follow-up reminders with simulated phone call action.
  - Quick action launcher for leads, applications, insurance, and follow-ups.

- **Customer Management**:
  - Filterable customer table (search by ID, name, mobile, email; status filter; enquiry type filter).
  - 1-Click CSV Export.
  - Multi-section Customer Add / Edit form with validation.
  - Tabbed Customer Profile view (Overview, Personal Info, Education, Enquiries, Remarks).

- **Education Loan Enquiry Module**:
  - **Step 1 (Enquiry Overview)**: Date, Consultancy Name datalist, Loan Amount (₹ currency prefix and ₹15L, ₹25L, ₹35L, ₹50L, ₹75L quick chips).
  - **Step 2 (Student Details)**: Full name, Father's name, Mother's name, Date of birth, Gender choice cards, Marital status choice cards, 10-digit mobile number, Email, Current residence (Self Owned vs Rented with monthly rent input), Current address & PIN, "Same as Current Residential Address" auto-sync checkbox, Permanent address & PIN.
  - **Step 3 (Educational Details)**:
    - Academic Qualifications table (starts with a **single blank row** by default, with **+ Add Qualification Row** and remove/clear buttons).
    - Entrance examination selection (GRE, IELTS, TOEFL, PTE, Duolingo, GMAT, SAT) & score.
    - Name of Degree fields: a), b), c).
  - **Step 4 (Course Details)**: Admission status (Confirmed vs Awaited), Course duration options, Target university/college, Course name, Study destination country selector (India, USA, Canada, UK, France, Others. with conditional country specification).
  - Bottom action bar with Submit and Reset form buttons.
  - Auto-sync: Submitting an enquiry automatically creates/updates the customer profile in the CRM database and updates Dashboard metrics.
  - Printable / Downloadable Enquiry Slip with 1-click `window.print()` and applicant signature block.
  - All Enquiries list with instant search and country/status filtering.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

