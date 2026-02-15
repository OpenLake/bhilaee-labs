# Basic Labs Guide — Virtual Labs (EEE) ⚡

A structured virtual laboratory platform for **Electrical & Electronics Engineering** students, providing comprehensive experiment guides, observation data, circuit diagrams, and interactive simulations.

> **Status**: Active Development · **10 / 90** experiments fully populated

---

## ✨ Features

### 🏠 Homepage
- **Labs Dashboard** — Access all **9 core EEE labs** at a glance via interactive cards.
- **Responsive Grid** — Adapts seamlessly across desktop, tablet, and mobile.

### 📘 Lab Landing Pages
- **Metadata Bar** — Lab code, nature (Hardware / Simulation / Theory), total experiments.
- **Experiment Cards** — Each card shows experiment number, title, and status badge.
- **Status Indicators** — Color-coded: `Simulation Available`, `Hardware-Oriented`, `Guide Only`.

### 🧪 Experiment Pages
- **Structured Sections** — Every experiment follows a fixed academic flow:
  > Aim → Apparatus → Theory → Pre-Lab → Procedure → Observations → Calculations → Results & Analysis → Post-Lab / Viva Voce → References → Conclusion
- **Rich Content Rendering** — Supports:
  - Formatted text with **bold**, *italic*, and [clickable links]()
  - Ordered & unordered lists
  - Data tables (with responsive horizontal scroll)
  - Circuit diagram images (via Asset Registry)
  - LaTeX equations (powered by KaTeX)
  - Code blocks
- **Sticky Sidebar TOC** — Auto-generated from applicable sections (desktop).
- **Graceful Degradation** — Sections marked "Not Applicable" are hidden cleanly.

### 🚀 Simulation Integration
- **Launch Simulator** — One-click button opens the external circuit simulator in a new tab.
- **Context-Aware Notes** — Experiment-specific hints (e.g., "Set simulation type to Transient").

### 🎨 UI / UX
- **Clean Academic Design** — Professional typography, consistent spacing, muted color palette.
- **Viva Voce Styling** — Q&A sections with accent-bordered question highlights.
- **Mobile-First** — Responsive layout with collapsible sidebar on smaller screens.

---

## 📊 Content Progress

| Lab | Experiments | Complete | Status |
|-----|:-----------:|:--------:|--------|
| Basic Electrical Engineering | 10 | **4** | Exp 1–4 ✅ |
| Instrumentation Lab | 10 | **5** | Exp 1–5 ✅ |
| Control System Lab | 10 | **1** | Exp 1 ✅ |
| Digital Electronics | 10 | 0 | Skeleton |
| Devices and Circuits | 10 | 0 | Skeleton |
| Power System Lab | 10 | 0 | Skeleton |
| Sensor Lab | 10 | 0 | Skeleton |
| Power Electronics Lab | 10 | 0 | Skeleton |
| Machines Lab | 10 | 0 | Skeleton |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 15** (App Router) |
| UI | **React 19** + CSS Modules |
| Math | **KaTeX** via `react-katex` |
| Data | JSON files + dynamic imports |
| Hosting | Vercel (planned) |

---

## 📦 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/RavikantiAkshay/basic-lab-guide.git
cd basic-lab-guide

# 2. Install dependencies
npm install

# 3. Create environment file
echo "NEXT_PUBLIC_SIMULATOR_URL=<your-simulator-url>" > .env.local

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

```
basic-lab-guide/
├── app/                          # Next.js App Router
│   ├── page.js                   # Homepage (Labs Dashboard)
│   ├── layout.js                 # Root layout (Header + Footer)
│   ├── globals.css               # Design tokens & global styles
│   └── lab/
│       └── [slug]/               # Dynamic Lab Landing Page
│           └── experiment/
│               └── [experimentId]/  # Dynamic Experiment Page
│
├── components/
│   ├── Header.js                 # Global navigation bar
│   ├── Footer.js                 # Global footer
│   ├── ExperimentCard.js         # Lab page experiment cards
│   ├── ExperimentList.js         # Grid container for cards
│   ├── LabHeader.js              # Lab title + breadcrumb
│   ├── LabMetadata.js            # Lab info bar (code, nature, count)
│   ├── LabComponents.module.css  # Styles for lab page components
│   └── experiment/
│       ├── ExperimentLayout.js   # Sidebar + content shell
│       ├── ContentBlock.js       # Universal content renderer
│       └── Experiment.module.css # Experiment page styles
│
├── data/
│   ├── labs.js                   # Lab metadata (reads from registry)
│   ├── experiments.js            # Experiment loader (async JSON import)
│   ├── experiment_schema.js      # Section order, titles, enums
│   └── experiments/
│       ├── registry.json         # Master index (90 experiments)
│       ├── basic-electrical-engineering/
│       │   ├── exp-1.json        # Power Factor
│       │   ├── exp-1.assets.json # Asset registry for Exp 1
│       │   ├── exp-2.json        # Superposition Theorem
│       │   ├── exp-3.json        # Thevenin's Theorem
│       │   └── exp-4.json        # Transient Response
│       ├── instrumentation-lab/
│       │   ├── exp-1.json … exp-5.json
│       │   └── *.assets.json
│       └── control-system-lab/
│           └── exp-1.json        # RLC Transient Response
│
├── public/
│   └── assets/
│       └── labs/                  # Experiment images & diagrams
│           ├── basic-electrical-engineering/
│           └── instrumentation-lab/
│
├── scripts/                       # Utility scripts
├── package.json
└── next.config.mjs
```

---

## 🧩 Data Schema (v2.0)

Each experiment JSON file follows a strict schema:

```jsonc
{
  "schemaVersion": "2.0",
  "experimentId": "1",
  "title": "Experiment Title",
  "code": "EEL101-E01",
  "status": "Simulation Available",  // | "Hardware-Oriented" | "Guide Only"
  "meta": { "difficulty": "Intermediate", "duration": "2 hours" },
  "sections": {
    "aim": { "id": "aim", "title": "Aim", "isApplicable": true, "content": [...] },
    "apparatus": { ... },
    "theory": { ... },
    "preLab": { ... },          // Circuit diagrams via assetId
    "procedure": { ... },
    "observations": { ... },    // Tables with sample data
    "calculations": { ... },
    "result": { ... },
    "postLab": { ... },         // Viva Voce Q&A
    "resources": { ... },
    "conclusion": { ... }
  }
}
```

**Content block types**: `text`, `list`, `table`, `image`, `code`, `equation`

---

## 📝 License

Internal Use — Department of Electrical Engineering