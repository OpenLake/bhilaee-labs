// useLabReportExport.js
// React hook that manages PDF export state, metadata collection, and chart capture

import { useState, useRef, useCallback } from "react";
import { generateLabReportPDF } from "./labReportPDF";

/**
 * useLabReportExport
 *
 * Manages the PDF export lifecycle:
 *   1. Opens a metadata dialog (student name, roll no, etc.)
 *   2. Captures live Chart.js instances via registerChart()
 *   3. Calls generateLabReportPDF and triggers browser download
 *
 * @param {Object} experiment - The experiment data (sections, observations, etc.)
 * @returns {Object} - { isDialogOpen, openDialog, closeDialog, exportPDF, registerChart, status, meta, setMeta }
 *
 * Usage:
 *   const { openDialog, registerChart, ...exportProps } = useLabReportExport(experimentData);
 *
 *   // In Chart.js component:
 *   <Line ref={(ref) => registerChart("IV Curve", ref?.chartInstance)} ... />
 *
 *   // Export button:
 *   <ExportButton onClick={openDialog} />
 *   <ExportDialog {...exportProps} />
 */
export function useLabReportExport(experiment) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | generating | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [meta, setMeta] = useState({
    studentName: "",
    rollNumber: "",
    instructor: "",
    semester: "",
    labGroup: "",
    date: new Date().toLocaleDateString("en-IN"),
  });

  // Registry of live Chart.js instances
  const chartRegistryRef = useRef({});

  /**
   * Register a Chart.js instance by label.
   * Pass chartRef.current from a react-chartjs-2 ref.
   */
  const registerChart = useCallback((label, chartInstance) => {
    if (chartInstance) {
      chartRegistryRef.current[label] = chartInstance;
    } else {
      delete chartRegistryRef.current[label];
    }
  }, []);

  const openDialog = useCallback(() => {
    setStatus("idle");
    setErrorMsg("");
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    setStatus("idle");
  }, []);

  const exportPDF = useCallback(async () => {
    setStatus("generating");
    try {
      await generateLabReportPDF(
        experiment,
        meta,
        chartRegistryRef.current
      );
      setStatus("done");
      // Auto-close after brief success state
      setTimeout(() => {
        setIsDialogOpen(false);
        setStatus("idle");
      }, 1800);
    } catch (err) {
      console.error("[useLabReportExport] PDF generation failed:", err);
      setErrorMsg(err?.message || "PDF generation failed. Please try again.");
      setStatus("error");
    }
  }, [experiment, meta]);

  return {
    isDialogOpen,
    openDialog,
    closeDialog,
    exportPDF,
    registerChart,
    status,
    errorMsg,
    meta,
    setMeta,
  };
}