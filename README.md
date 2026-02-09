# Basic Labs Guide - Virtual Labs (EEE)

A virtual laboratory platform for Electrical & Electronics Engineering students, providing structured experiment guides and resources.

## 🚀 Features

- **Lab Dashboard**: View and access **9 core Engineering Labs** (Basic Electrical, Digital Electronics, Power Systems, etc.).
- **Lab Landing Pages**: Detailed overview for each lab including:
  - **Focus & Metadata**: Nature of lab, prerequisites, and total experiments.
  - **Experiment List**: Comprehensive list of experiments with status indicators (Simulation, Hardware, Guide).
- **Responsive Design**: optimized for desktop, tablet, and mobile devices.
- **Scalable Architecture**: Centralized data management via `data/labs.js`.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: CSS Modules
- **State**: React 19

## 📦 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to verify the result.

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components (`LabHeader`, `ExperimentCard`, etc.).
- `data/`: Static data files (`labs.js`).
- `public/`: Static assets.

## 📝 License

Internal Use - Department of Electrical Engineering