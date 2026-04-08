// ExportPDFButton.jsx
// "Export as PDF" button + metadata dialog for IIT Bhilai Virtual Lab

import React from "react";

// ─── Inline styles ─────────────────────────────────────────────────────────────
// Written as JS objects to keep the component self-contained (no CSS import needed).
// Swap to Tailwind / CSS Modules as required by the project setup.

const S = {
  // Export button
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 18px",
    borderRadius: 6,
    border: "1.5px solid #003087",
    backgroundColor: "#003087",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s, transform 0.1s",
    userSelect: "none",
    letterSpacing: 0.2,
  },
  btnHover: {
    backgroundColor: "#00246b",
  },
  btnDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  btnIcon: {
    width: 16,
    height: 16,
    flexShrink: 0,
  },

  // Overlay
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(3px)",
    zIndex: 9998,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Dialog
  dialog: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 24px 80px rgba(0,48,135,0.18)",
    padding: 32,
    width: "100%",
    maxWidth: 480,
    zIndex: 9999,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    position: "relative",
  },
  dialogHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dialogTitleGroup: {},
  dialogTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#003087",
    marginBottom: 2,
    lineHeight: 1.3,
  },
  dialogSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    color: "#aaa",
    lineHeight: 1,
    fontSize: 20,
    borderRadius: 4,
  },

  // Experiment info strip
  infoStrip: {
    backgroundColor: "#f0f4ff",
    borderRadius: 6,
    padding: "10px 14px",
    marginBottom: 20,
    borderLeft: "3px solid #003087",
  },
  infoStripLabel: {
    fontSize: 10,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
    fontWeight: 600,
  },
  infoStripTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1a1a2e",
  },

  // Form
  fieldGroup: {
    marginBottom: 14,
  },
  fieldRow: {
    display: "flex",
    gap: 12,
    marginBottom: 14,
  },
  fieldRowItem: {
    flex: 1,
  },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "#555",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 10px",
    borderRadius: 5,
    border: "1px solid #d1d9ee",
    fontSize: 13,
    color: "#1a1a2e",
    outline: "none",
    transition: "border-color 0.15s",
    backgroundColor: "#fafbff",
  },

  // Optional fields note
  optionalNote: {
    fontSize: 11,
    color: "#aaa",
    marginBottom: 20,
    fontStyle: "italic",
  },

  // Action row
  actionRow: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 8,
  },
  cancelBtn: {
    padding: "9px 20px",
    borderRadius: 6,
    border: "1.5px solid #dde3f0",
    backgroundColor: "#fff",
    color: "#555",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  exportBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 22px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#003087",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s",
  },
  exportBtnGenerating: {
    backgroundColor: "#1a4aab",
  },
  exportBtnDone: {
    backgroundColor: "#1a7a4a",
  },
  exportBtnError: {
    backgroundColor: "#c0392b",
  },

  // Error message
  errorBox: {
    backgroundColor: "#fff0f0",
    border: "1px solid #f5c6c6",
    borderRadius: 5,
    padding: "8px 12px",
    fontSize: 12,
    color: "#c0392b",
    marginTop: 12,
  },

  // Success
  successBox: {
    backgroundColor: "#eefaf3",
    border: "1px solid #a3d9b8",
    borderRadius: 5,
    padding: "8px 12px",
    fontSize: 12,
    color: "#1a7a4a",
    marginTop: 12,
    textAlign: "center",
    fontWeight: 600,
  },

  // Spinner
  spinner: {
    width: 14,
    height: 14,
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
};

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

function DownloadIcon({ style }) {
  return (
    <svg style={style} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3v9m0 0l-3-3m3 3l3-3" />
      <path d="M4 14v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10l4 4 8-8" />
    </svg>
  );
}

// ─── Spinner CSS ───────────────────────────────────────────────────────────────

const spinnerKeyframes = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

// ─── MetaDialog component ──────────────────────────────────────────────────────

/**
 * ExportMetaDialog
 *
 * Collects student metadata before triggering PDF download.
 *
 * Props come directly from useLabReportExport():
 *   isDialogOpen, closeDialog, exportPDF, status, errorMsg, meta, setMeta
 * Plus:
 *   experimentTitle {string}
 */
export function ExportMetaDialog({
  isDialogOpen,
  closeDialog,
  exportPDF,
  status,
  errorMsg,
  meta,
  setMeta,
  experimentTitle = "Experiment",
}) {
  if (!isDialogOpen) return null;

  const isGenerating = status === "generating";
  const isDone = status === "done";
  const isError = status === "error";

  const updateMeta = (key) => (e) =>
    setMeta((prev) => ({ ...prev, [key]: e.target.value }));

  // Determine export button state
  let exportBtnStyle = { ...S.exportBtn };
  let exportBtnContent = (
    <>
      <DownloadIcon style={{ width: 15, height: 15 }} />
      Export PDF
    </>
  );
  if (isGenerating) {
    exportBtnStyle = { ...S.exportBtn, ...S.exportBtnGenerating };
    exportBtnContent = (
      <>
        <span style={S.spinner} />
        Generating…
      </>
    );
  } else if (isDone) {
    exportBtnStyle = { ...S.exportBtn, ...S.exportBtnDone };
    exportBtnContent = (
      <>
        <CheckIcon />
        Downloaded!
      </>
    );
  } else if (isError) {
    exportBtnStyle = { ...S.exportBtn, ...S.exportBtnError };
    exportBtnContent = <>Retry</>;
  }

  return (
    <>
      <style>{spinnerKeyframes}</style>
      {/* Overlay */}
      <div style={S.overlay} onClick={closeDialog}>
        {/* Dialog — stop propagation so clicking inside doesn't close */}
        <div style={S.dialog} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div style={S.dialogHeader}>
            <div style={S.dialogTitleGroup}>
              <div style={S.dialogTitle}>Export Lab Report</div>
              <div style={S.dialogSubtitle}>
                Fill in your details to personalise the PDF (optional)
              </div>
            </div>
            <button style={S.closeBtn} onClick={closeDialog} aria-label="Close">
              <CloseIcon />
            </button>
          </div>

          {/* Experiment info */}
          <div style={S.infoStrip}>
            <div style={S.infoStripLabel}>Experiment</div>
            <div style={S.infoStripTitle}>{experimentTitle}</div>
          </div>

          {/* Form fields */}
          <div style={S.fieldRow}>
            <div style={S.fieldRowItem}>
              <label style={S.label}>Student Name</label>
              <input
                style={S.input}
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={meta.studentName}
                onChange={updateMeta("studentName")}
                disabled={isGenerating || isDone}
              />
            </div>
            <div style={S.fieldRowItem}>
              <label style={S.label}>Roll Number</label>
              <input
                style={S.input}
                type="text"
                placeholder="e.g. 12340100"
                value={meta.rollNumber}
                onChange={updateMeta("rollNumber")}
                disabled={isGenerating || isDone}
              />
            </div>
          </div>

          <div style={S.fieldRow}>
            <div style={S.fieldRowItem}>
              <label style={S.label}>Semester</label>
              <input
                style={S.input}
                type="text"
                placeholder="e.g. VI (2025–26)"
                value={meta.semester}
                onChange={updateMeta("semester")}
                disabled={isGenerating || isDone}
              />
            </div>
            <div style={S.fieldRowItem}>
              <label style={S.label}>Lab Group</label>
              <input
                style={S.input}
                type="text"
                placeholder="e.g. B1"
                value={meta.labGroup}
                onChange={updateMeta("labGroup")}
                disabled={isGenerating || isDone}
              />
            </div>
          </div>

          <div style={S.fieldGroup}>
            <label style={S.label}>Instructor / TA</label>
            <input
              style={S.input}
              type="text"
              placeholder="e.g. Dr. Priya Gupta"
              value={meta.instructor}
              onChange={updateMeta("instructor")}
              disabled={isGenerating || isDone}
            />
          </div>

          <p style={S.optionalNote}>All fields are optional.</p>

          {/* Feedback */}
          {isError && errorMsg && (
            <div style={S.errorBox}>⚠ {errorMsg}</div>
          )}
          {isDone && (
            <div style={S.successBox}>✓ PDF downloaded successfully!</div>
          )}

          {/* Actions */}
          <div style={S.actionRow}>
            <button
              style={S.cancelBtn}
              onClick={closeDialog}
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              style={exportBtnStyle}
              onClick={exportPDF}
              disabled={isGenerating || isDone}
            >
              {exportBtnContent}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Export Button ─────────────────────────────────────────────────────────────

/**
 * ExportPDFButton
 *
 * Drop-in trigger button. Pass `onClick={openDialog}` from useLabReportExport.
 *
 * Props:
 *   onClick  {function}  - Opens the metadata dialog
 *   disabled {boolean}   - Optionally disable the button
 *   label    {string}    - Button label (default: "Export as PDF")
 */
export function ExportPDFButton({
  onClick,
  disabled = false,
  label = "Export as PDF",
}) {
  const [hovered, setHovered] = React.useState(false);

  const btnStyle = {
    ...S.btn,
    ...(hovered && !disabled ? S.btnHover : {}),
    ...(disabled ? S.btnDisabled : {}),
  };

  return (
    <button
      style={btnStyle}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Export lab report as PDF"
    >
      <DownloadIcon style={S.btnIcon} />
      {label}
    </button>
  );
}

// ─── Convenience wrapper ───────────────────────────────────────────────────────

/**
 * ExportPDFWidget
 *
 * Renders both the button and the dialog in one go.
 * Accepts all props from useLabReportExport() spread in, plus experimentTitle.
 *
 * Usage:
 *   const exportProps = useLabReportExport(experimentData);
 *   <ExportPDFWidget {...exportProps} experimentTitle={experimentData.title} />
 */
export function ExportPDFWidget({
  openDialog,
  isDialogOpen,
  closeDialog,
  exportPDF,
  status,
  errorMsg,
  meta,
  setMeta,
  experimentTitle,
  buttonLabel,
  disabled,
}) {
  return (
    <>
      <ExportPDFButton
        onClick={openDialog}
        label={buttonLabel}
        disabled={disabled}
      />
      <ExportMetaDialog
        isDialogOpen={isDialogOpen}
        closeDialog={closeDialog}
        exportPDF={exportPDF}
        status={status}
        errorMsg={errorMsg}
        meta={meta}
        setMeta={setMeta}
        experimentTitle={experimentTitle}
      />
    </>
  );
}