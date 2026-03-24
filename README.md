# ⚡ Bhilai EE Labs

A structured, interactive virtual laboratory platform designed for **Electrical & Electronics Engineering** students at IIT Bhilai. The platform provides comprehensive, digitized experiment guides complete with theory, observations, circuit diagrams, mathematical equations, and seamless, one-click access to an interactive circuit simulator.

**Live Platform →** [bhilaee-labs.vercel.app](https://bhilaee-labs.vercel.app)  
**Companion Simulator →** [Bhilai EE Circuit Simulator](https://bhilaee-simulator.vercel.app) · [Repository](https://github.com/RavikantiAkshay/basic-simulator)

---

## ✨ Core Features

Bhilai EE Labs goes beyond static documents by offering a personalized, data-driven, and highly interactive learning environment.

### 🔬 Interactive Lab Guides
Every experiment is meticulously digitized and structured for optimal learning:
- **Rich Content Rendering**: Supports complex mathematical equations (via KaTeX), dynamic tables with horizontal scroll, highlighted code blocks, and high-resolution images.
- **Viva Voce Flashcards**: Post-lab questions are styled with accent-bordered highlights to help students test their knowledge interactively.
- **Sticky Section Navigation**: A dynamic, auto-generated sidebar table of contents allows for instant jumping between Theory, Procedure, Observations, and Results.
- **Print & PDF Generation**: A dedicated, print-optimized stylesheet allows students to generate professional PDF reports with a single click. Users can even choose exactly which sections to include via their settings.

### 🎮 Simulator Integration
Bridge the gap between theory and application instantly.
- **One-Click Launch**: "Launch Simulator" buttons directly launch the companion app in a new tab.
- **Pre-loaded States**: The platform automatically passes a specific `simulationId` to the simulator, instantly loading the correct circuit schematic, equipment, and parameters for that specific experiment.

### 👤 Personal Dashboard & Cloud Sync
Powered by Supabase, the platform offers a personalized, cross-device synced workspace for authenticated users.
- **⭐ Starred Experiments**: Bookmark crucial experiments to your personal dashboard for instant access before exams or practicals.
- **🕒 Browsing History**: The platform automatically tracks and syncs the last 10 experiments you visited, so you never lose your place.
- **📊 Saved Observations**: Students can manually input, edit, and save their recorded data directly into tables within the guide. All saved tables are aggregated securely in a central hub.
- **📈 Instant Charting**: Generate interactive, customizable Data Visualization charts (using Chart.js) directly from your saved observation tables to analyze trends immediately.

### 📚 Specialized Study Tools
- **📖 Global Glossary**: A centralized, searchable dictionary of EE terminology. 
  - **Tooltips**: Key terms are underlined in blue within experiments—hover over them for instant definitions.
  - **Flashcard Mode**: Toggle definitions on the Glossary page to study for Viva Voce interactively.
- **🖼️ Circuit Diagram Gallery**: A beautifully organized, filterable masonry grid containing every high-resolution circuit diagram across all labs. Click any diagram to zoom in or navigate directly to its parent experiment.

### ⚙️ Platform Personalization
- **📌 Pinned Labs**: Tame the homepage by pinning your current semester's labs. Pinned cards feature a premium gradient and float to the top of the grid.
- **🌓 Adaptive Theme Engine**: Full support for Light and Dark modes. The UI adjusts dynamically, preserving legibility for reading extensive documentation at night.
- **🧭 Interactive Platform Guide**: A step-by-step, interactive modal tour that teaches new users how to navigate the labs, run simulations, and utilize advanced reporting features.
- **💬 Feedback & Support**: Inline emoji rating systems at the end of experiments, plus a dedicated Support Hub to report issues or suggest improvements directly to the developers.

---

## 🏗️ Architecture & Data Flow

The platform is statically generated and highly performant, relying on a robust JSON-based content management system.

### Page Hierarchy
```text
/                                      → Homepage (Lab grid + Search + Pinned)
/lab/[slug]                            → Lab Landing Page (Experiment list & Status)
/lab/[slug]/experiment/[experimentId]   → Experiment Page (Full content + Simulator)
```

### How Experiment Data Loads
```text
registry.json (Master Index)
    ↓
labs.js reads registry, merges with lab metadata (icons, code, nature)
    ↓
Lab Landing Page renders experiment cards with color-coded status badges
    ↓
User clicks an experiment card
    ↓
experiments.js reads the JSON file: data/experiments/<labSlug>/exp-<N>.json
    ↓
Also tries to load sidecar asset file: data/experiments/<labSlug>/exp-<N>.assets.json
    ↓
Merges both into a single experiment object
    ↓
ExperimentLayout.js renders with ContentBlock components (Text, List, Table, Math, Image)
```

### Content Status Badges
The `status` field in `registry.json` dynamically controls color-coded badges indicating the nature of the experiment:
- 🟢 **Simulation Available**: Has a linked interactive simulation.
- 🟠 **Hardware-Oriented**: Hardware-only experiment.
- 🔵 **Software-Oriented**: Software/MATLAB/FPGA-based experiment.
- ⚪ **Guide Only**: Documentation only / Placeholder.

---

## 🖼️ Asset Management System

Images (circuit diagrams, oscilloscope waves) are managed through a sidecar asset registry. For every `exp-N.json`, an optional `exp-N.assets.json` defines images:

```json
{
  "fig1-inv-amp": {
    "path": "/assets/labs/devices-and-circuits/exp-5/fig1-inv-amp.png",
    "description": "Circuit diagram of inverting amplifier"
  }
}
```
The content JSON simply references the `assetId` ("fig1-inv-amp"), maintaining a clean separation between content structure and static file hosting.

---

## 🛠️ Linking to the Simulator

To make a new experiment launchable from the guide:
1. **Create the template** in the Simulator repository (`src/templates`).
2. **Register it** in the simulator with a unique `expId`.
3. **Update the experiment JSON** in this guide repository:
   - Set `"status": "Simulation Available"`
   - Add `"simulationId": "<expId>"` to the `meta` object.
   - Set `"route": "default"` in the `simulation` section.
4. **Update `registry.json`** to ensure the green badge is displayed.

*(Note: Multiple experiments can share the same `simulationId` if they utilize the same base circuit).*

---

## 🚀 Getting Started (Development)

### 1. Clone the Repository
```bash
git clone https://github.com/RavikantiAkshay/basic-lab-guide.git
cd basic-lab-guide
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory. You will need Supabase credentials for dashboard features to work locally:
```bash
NEXT_PUBLIC_SIMULATOR_URL=https://bhilaee-simulator.vercel.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| **Core Framework** | Next.js 15 (App Router, Server Components) |
| **UI Library** | React 19 + Vanilla CSS Modules |
| **Authentication & DB** | Supabase (PostgreSQL) |
| **Math Rendering** | KaTeX (`react-katex`) |
| **Data Visualization** | Chart.js (`react-chartjs-2`, `chartjs-plugin-zoom`) |
| **Content Delivery** | Static JSON via `fs.readFile` |
| **Hosting & Analytics** | Vercel |

---

## 📜 License
Internal Educational Platform — Department of Electrical Engineering, Indian Institute of Technology (IIT) Bhilai.