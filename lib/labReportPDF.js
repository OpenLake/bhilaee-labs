// labReportPDF.js
// Client-side PDF generation for IIT Bhilai lab reports
// Uses @react-pdf/renderer for structured PDF output

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  pdf,
} from "@react-pdf/renderer";

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Using standard PDF fonts; swap to registered custom fonts if needed
Font.register({
  family: "Times-Roman",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/times-new-roman@1.0.4/Times New Roman.ttf" },
    { src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/times-new-roman@1.0.4/Times New Roman Bold.ttf", fontWeight: "bold" },
    { src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/times-new-roman@1.0.4/Times New Roman Italic.ttf", fontStyle: "italic" },
  ],
});

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 56,
    paddingBottom: 56,
    paddingLeft: 64,
    paddingRight: 64,
    color: "#1a1a2e",
    backgroundColor: "#ffffff",
  },

  // ── Header / Cover ──────────────────────────────────────────────────────
  coverPage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingBottom: 80,
    paddingLeft: 64,
    paddingRight: 64,
    backgroundColor: "#ffffff",
  },
  instituteBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#003087",
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  instituteBadgeText: {
    color: "#ffffff",
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  instituteTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#003087",
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  departmentTitle: {
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#444",
    textAlign: "center",
    marginBottom: 32,
  },
  dividerThick: {
    height: 3,
    backgroundColor: "#003087",
    width: "100%",
    marginBottom: 4,
  },
  dividerThin: {
    height: 1,
    backgroundColor: "#003087",
    width: "100%",
    marginBottom: 24,
  },
  coverExperimentLabel: {
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#888",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 8,
  },
  coverExperimentTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 1.4,
  },
  coverMetaBox: {
    borderWidth: 1,
    borderColor: "#dde3f0",
    borderRadius: 4,
    padding: 20,
    width: "100%",
    marginBottom: 32,
    backgroundColor: "#f7f9ff",
  },
  coverMetaRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  coverMetaLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#555",
    width: 100,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  coverMetaValue: {
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a2e",
    flex: 1,
  },
  coverFooter: {
    fontSize: 9,
    color: "#aaa",
    textAlign: "center",
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
  },

  // ── Page Header ─────────────────────────────────────────────────────────
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#003087",
    paddingBottom: 6,
    marginBottom: 20,
  },
  pageHeaderLeft: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#003087",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pageHeaderRight: {
    fontSize: 8,
    color: "#888",
  },

  // ── Page Footer ─────────────────────────────────────────────────────────
  pageFooter: {
    position: "absolute",
    bottom: 28,
    left: 64,
    right: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#dde3f0",
    paddingTop: 6,
  },
  pageFooterText: {
    fontSize: 8,
    color: "#aaa",
  },
  pageFooterPageNum: {
    fontSize: 8,
    color: "#666",
    fontFamily: "Helvetica-Bold",
  },

  // ── Sections ────────────────────────────────────────────────────────────
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#003087",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#dde3f0",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionSubHeading: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#333",
    marginBottom: 6,
    textAlign: "justify",
  },

  // ── Aim / Objective ─────────────────────────────────────────────────────
  aimBox: {
    backgroundColor: "#f0f4ff",
    borderLeftWidth: 3,
    borderLeftColor: "#003087",
    padding: 10,
    marginBottom: 10,
    borderRadius: 2,
  },
  aimText: {
    fontSize: 10,
    color: "#1a1a2e",
    lineHeight: 1.5,
  },

  // ── Apparatus / Requirements list ────────────────────────────────────────
  listItem: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 4,
  },
  listBullet: {
    fontSize: 9,
    color: "#003087",
    marginRight: 6,
    marginTop: 1,
  },
  listText: {
    fontSize: 10,
    color: "#333",
    flex: 1,
    lineHeight: 1.4,
  },

  // ── Math/Formula ────────────────────────────────────────────────────────
  formulaBox: {
    backgroundColor: "#f8f9fe",
    borderWidth: 1,
    borderColor: "#e0e6f7",
    borderRadius: 3,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  formulaText: {
    fontSize: 11,
    fontFamily: "Helvetica-Oblique",
    color: "#1a1a2e",
    textAlign: "center",
  },
  formulaLabel: {
    fontSize: 8,
    color: "#888",
    marginTop: 4,
  },

  // ── Observation Table ────────────────────────────────────────────────────
  tableContainer: {
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#c8d4ee",
    borderRadius: 3,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#003087",
  },
  tableHeaderCell: {
    flex: 1,
    padding: 6,
    borderRightWidth: 0.5,
    borderRightColor: "#1a4aab",
  },
  tableHeaderCellLast: {
    flex: 1,
    padding: 6,
  },
  tableHeaderText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#dde3f0",
  },
  tableRowAlt: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#dde3f0",
    backgroundColor: "#f7f9ff",
  },
  tableCell: {
    flex: 1,
    padding: 5,
    borderRightWidth: 0.5,
    borderRightColor: "#dde3f0",
  },
  tableCellLast: {
    flex: 1,
    padding: 5,
  },
  tableCellText: {
    fontSize: 9,
    color: "#333",
    textAlign: "center",
  },
  tableCaption: {
    fontSize: 8,
    color: "#888",
    textAlign: "center",
    marginTop: 4,
    fontStyle: "italic",
  },

  // ── Graph / Image ────────────────────────────────────────────────────────
  imageContainer: {
    alignItems: "center",
    marginBottom: 14,
  },
  imageBox: {
    borderWidth: 1,
    borderColor: "#dde3f0",
    borderRadius: 3,
    padding: 4,
    backgroundColor: "#fafbff",
  },
  imageCaption: {
    fontSize: 8,
    color: "#888",
    textAlign: "center",
    marginTop: 6,
    fontStyle: "italic",
  },

  // ── Result / Conclusion ──────────────────────────────────────────────────
  resultBox: {
    backgroundColor: "#eefaf3",
    borderWidth: 1,
    borderColor: "#a3d9b8",
    borderRadius: 3,
    padding: 12,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 10,
    color: "#1a4a2e",
    lineHeight: 1.5,
  },

  // ── Signature Block ──────────────────────────────────────────────────────
  signatureSection: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    alignItems: "center",
    width: 140,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    width: 120,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: "#555",
    textAlign: "center",
  },

  // ── Marks Table ─────────────────────────────────────────────────────────
  marksTable: {
    borderWidth: 1,
    borderColor: "#c8d4ee",
    borderRadius: 3,
    marginTop: 16,
    overflow: "hidden",
  },
  marksRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#dde3f0",
  },
  marksCell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 0.5,
    borderRightColor: "#dde3f0",
  },
  marksCellText: {
    fontSize: 9,
    color: "#333",
    textAlign: "center",
  },
});

// ─── Helper renderers ─────────────────────────────────────────────────────────

/**
 * Renders a single content block based on its `type`.
 * Supported types: heading, text, aim, list, formula, table, image, result, calculation
 */
function renderBlock(block, index) {
  switch (block.type) {
    case "heading":
      return (
        <Text key={index} style={styles.sectionSubHeading}>
          {block.content}
        </Text>
      );

    case "text":
    case "paragraph":
      return (
        <Text key={index} style={styles.paragraph}>
          {block.content}
        </Text>
      );

    case "aim":
    case "objective":
      return (
        <View key={index} style={styles.aimBox}>
          <Text style={styles.aimText}>{block.content}</Text>
        </View>
      );

    case "list":
    case "apparatus":
    case "requirements": {
      const items = Array.isArray(block.content)
        ? block.content
        : (block.content || "").split("\n").filter(Boolean);
      return (
        <View key={index}>
          {items.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      );
    }

    case "formula":
    case "equation":
    case "calculation":
      return (
        <View key={index} style={styles.formulaBox}>
          <Text style={styles.formulaText}>{block.content}</Text>
          {block.label && (
            <Text style={styles.formulaLabel}>{block.label}</Text>
          )}
        </View>
      );

    case "table":
    case "observation": {
      const headers = block.headers || (block.data && block.data[0]) || [];
      const rows =
        block.rows || (block.data && block.data.slice(1)) || [];
      return (
        <View key={index}>
          {block.caption && (
            <Text style={[styles.sectionSubHeading, { marginBottom: 6 }]}>
              {block.caption}
            </Text>
          )}
          <View style={styles.tableContainer}>
            {/* Header row */}
            <View style={styles.tableHeaderRow}>
              {headers.map((h, hi) => (
                <View
                  key={hi}
                  style={
                    hi < headers.length - 1
                      ? styles.tableHeaderCell
                      : styles.tableHeaderCellLast
                  }
                >
                  <Text style={styles.tableHeaderText}>{String(h)}</Text>
                </View>
              ))}
            </View>
            {/* Data rows */}
            {rows.map((row, ri) => {
              const rowArr = Array.isArray(row) ? row : Object.values(row);
              return (
                <View
                  key={ri}
                  style={ri % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                >
                  {rowArr.map((cell, ci) => (
                    <View
                      key={ci}
                      style={
                        ci < rowArr.length - 1
                          ? styles.tableCell
                          : styles.tableCellLast
                      }
                    >
                      <Text style={styles.tableCellText}>
                        {cell !== null && cell !== undefined ? String(cell) : "—"}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
          {block.note && (
            <Text style={styles.tableCaption}>{block.note}</Text>
          )}
        </View>
      );
    }

    case "image":
    case "circuit":
    case "diagram":
    case "graph":
    case "plot":
      if (!block.src && !block.base64) return null;
      return (
        <View key={index} style={styles.imageContainer}>
          <View style={styles.imageBox}>
            <Image
              src={block.base64 || block.src}
              style={{ maxWidth: 380, maxHeight: 260 }}
            />
          </View>
          {block.caption && (
            <Text style={styles.imageCaption}>{block.caption}</Text>
          )}
        </View>
      );

    case "result":
    case "conclusion":
      return (
        <View key={index} style={styles.resultBox}>
          <Text style={styles.resultText}>{block.content}</Text>
        </View>
      );

    default:
      return (
        <Text key={index} style={styles.paragraph}>
          {typeof block.content === "string"
            ? block.content
            : JSON.stringify(block.content)}
        </Text>
      );
  }
}

// ─── Section component ────────────────────────────────────────────────────────

function LabSection({ title, blocks = [], children }) {
  return (
    <View style={styles.sectionContainer} wrap={false}>
      {title && <Text style={styles.sectionHeading}>{title}</Text>}
      {blocks.map((block, i) => renderBlock(block, i))}
      {children}
    </View>
  );
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────

function ReportPage({ experimentTitle, children, pageNumber, totalPages }) {
  return (
    <Page size="A4" style={styles.page}>
      {/* Running header */}
      <View style={styles.pageHeader} fixed>
        <Text style={styles.pageHeaderLeft}>{experimentTitle}</Text>
        <Text style={styles.pageHeaderRight}>IIT Bhilai — Lab Report</Text>
      </View>

      {children}

      {/* Running footer */}
      <View style={styles.pageFooter} fixed>
        <Text style={styles.pageFooterText}>
          Generated on {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
        </Text>
        <Text
          style={styles.pageFooterPageNum}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>
  );
}

// ─── Cover Page ───────────────────────────────────────────────────────────────

function CoverPage({ experiment, meta }) {
  const {
    title = "Experiment",
    course = "",
    semester = "",
    labGroup = "",
  } = experiment;
  const {
    studentName = "",
    rollNumber = "",
    date = new Date().toLocaleDateString("en-IN"),
    instructor = "",
  } = meta || {};

  return (
    <Page size="A4" style={styles.coverPage}>
      {/* Institute badge */}
      <View style={styles.instituteBadge}>
        <Text style={styles.instituteBadgeText}>IIT</Text>
      </View>

      <Text style={styles.instituteTitle}>
        Indian Institute of Technology Bhilai
      </Text>
      <Text style={styles.departmentTitle}>
        {course || "Department of Electrical Engineering"}
      </Text>

      <View style={styles.dividerThick} />
      <View style={styles.dividerThin} />

      <Text style={styles.coverExperimentLabel}>Lab Report</Text>
      <Text style={styles.coverExperimentTitle}>{title}</Text>

      {/* Meta info */}
      <View style={styles.coverMetaBox}>
        {studentName ? (
          <View style={styles.coverMetaRow}>
            <Text style={styles.coverMetaLabel}>Student</Text>
            <Text style={styles.coverMetaValue}>{studentName}</Text>
          </View>
        ) : null}
        {rollNumber ? (
          <View style={styles.coverMetaRow}>
            <Text style={styles.coverMetaLabel}>Roll No.</Text>
            <Text style={styles.coverMetaValue}>{rollNumber}</Text>
          </View>
        ) : null}
        {semester ? (
          <View style={styles.coverMetaRow}>
            <Text style={styles.coverMetaLabel}>Semester</Text>
            <Text style={styles.coverMetaValue}>{semester}</Text>
          </View>
        ) : null}
        {labGroup ? (
          <View style={styles.coverMetaRow}>
            <Text style={styles.coverMetaLabel}>Group</Text>
            <Text style={styles.coverMetaValue}>{labGroup}</Text>
          </View>
        ) : null}
        {instructor ? (
          <View style={styles.coverMetaRow}>
            <Text style={styles.coverMetaLabel}>Instructor</Text>
            <Text style={styles.coverMetaValue}>{instructor}</Text>
          </View>
        ) : null}
        <View style={[styles.coverMetaRow, { marginBottom: 0 }]}>
          <Text style={styles.coverMetaLabel}>Date</Text>
          <Text style={styles.coverMetaValue}>{date}</Text>
        </View>
      </View>

      <Text style={styles.coverFooter}>
        IIT Bhilai Virtual Lab — Confidential — For Academic Use Only
      </Text>
    </Page>
  );
}

// ─── Main Document ────────────────────────────────────────────────────────────

/**
 * LabReportDocument
 *
 * @param {Object} experiment - The experiment data object
 *   {
 *     title: string,
 *     course: string,
 *     semester: string,
 *     sections: Array<{ title: string, blocks: ContentBlock[] }>
 *     observations: ObservationTable[],
 *     calculations: ContentBlock[],
 *     results: ContentBlock[],
 *     chartImages: Array<{ base64: string, caption: string }>,
 *     circuitImages: Array<{ base64: string, caption: string }>,
 *   }
 * @param {Object} meta - Student/session metadata
 */
export function LabReportDocument({ experiment, meta }) {
  const {
    title = "Experiment",
    sections = [],
    observations = [],
    calculations = [],
    results = [],
    chartImages = [],
    circuitImages = [],
    precautions = [],
    sources = [],
  } = experiment;

  return (
    <Document
      title={`Lab Report — ${title}`}
      author={meta?.studentName || "IIT Bhilai Student"}
      subject={`${title} — IIT Bhilai Virtual Lab`}
      creator="IIT Bhilai Virtual Lab"
      producer="@react-pdf/renderer"
    >
      {/* Cover Page */}
      <CoverPage experiment={experiment} meta={meta} />

      {/* Content Pages */}
      <ReportPage experimentTitle={title}>
        {/* Render standard sections from the experiment's `sections` array */}
        {sections.map((section, si) => (
          <LabSection key={si} title={section.title} blocks={section.blocks} />
        ))}

        {/* Circuit / diagram images */}
        {circuitImages.length > 0 && (
          <LabSection title="Circuit Diagram">
            {circuitImages.map((img, i) => (
              <View key={i} style={styles.imageContainer}>
                <View style={styles.imageBox}>
                  <Image
                    src={img.base64 || img.src}
                    style={{ maxWidth: 400, maxHeight: 280 }}
                  />
                </View>
                {img.caption && (
                  <Text style={styles.imageCaption}>{img.caption}</Text>
                )}
              </View>
            ))}
          </LabSection>
        )}

        {/* Observation tables */}
        {observations.length > 0 && (
          <LabSection title="Observations">
            {observations.map((obs, oi) =>
              renderBlock({ type: "table", ...obs }, oi)
            )}
          </LabSection>
        )}

        {/* Calculations */}
        {calculations.length > 0 && (
          <LabSection title="Calculations">
            {calculations.map((calc, ci) => renderBlock(calc, ci))}
          </LabSection>
        )}

        {/* Graphs / Plots */}
        {chartImages.length > 0 && (
          <LabSection title="Graphs & Plots">
            {chartImages.map((img, i) => (
              <View key={i} style={styles.imageContainer}>
                <View style={styles.imageBox}>
                  <Image
                    src={img.base64 || img.src}
                    style={{ maxWidth: 420, maxHeight: 300 }}
                  />
                </View>
                {img.caption && (
                  <Text style={styles.imageCaption}>{img.caption}</Text>
                )}
              </View>
            ))}
          </LabSection>
        )}

        {/* Results & Conclusion */}
        {results.length > 0 && (
          <LabSection title="Result & Conclusion">
            {results.map((r, ri) => renderBlock(r, ri))}
          </LabSection>
        )}

        {/* Precautions */}
        {precautions.length > 0 && (
          <LabSection title="Precautions">
            {precautions.map((p, pi) =>
              renderBlock(
                typeof p === "string"
                  ? { type: "list", content: precautions }
                  : p,
                pi
              )
            )}
          </LabSection>
        )}

        {/* Sources / References */}
        {sources.length > 0 && (
          <LabSection title="References">
            {sources.map((src, si) => (
              <View key={si} style={styles.listItem}>
                <Text style={styles.listBullet}>[{si + 1}]</Text>
                <Text style={styles.listText}>{src}</Text>
              </View>
            ))}
          </LabSection>
        )}

        {/* Marks & Signature */}
        <View style={styles.marksTable}>
          <View style={styles.marksRow}>
            {["Aim & Theory", "Observations", "Calculations", "Result", "Viva", "Total"].map(
              (col) => (
                <View key={col} style={styles.marksCell}>
                  <Text style={[styles.marksCellText, { fontFamily: "Helvetica-Bold", color: "#003087" }]}>
                    {col}
                  </Text>
                </View>
              )
            )}
          </View>
          <View style={styles.marksRow}>
            {["/10", "/20", "/20", "/10", "/20", "/80"].map((col, i) => (
              <View key={i} style={styles.marksCell}>
                <Text style={[styles.marksCellText, { color: "#aaa", fontSize: 10 }]}>
                  {col}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Student Signature</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Instructor Signature</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Date</Text>
          </View>
        </View>
      </ReportPage>
    </Document>
  );
}

// ─── Export function ──────────────────────────────────────────────────────────

/**
 * generateLabReportPDF
 *
 * Builds and triggers download of the lab report PDF.
 *
 * @param {Object} experiment - See LabReportDocument prop shape above
 * @param {Object} meta       - Student metadata { studentName, rollNumber, date, instructor, semester }
 * @param {Object} charts     - Map of chart refs: { [chartId]: chartInstance }
 *
 * Usage:
 *   import { generateLabReportPDF } from "./labReportPDF";
 *   await generateLabReportPDF(experimentData, metaData, chartRefs);
 */
export async function generateLabReportPDF(experiment, meta = {}, charts = {}) {
  // 1. Capture Chart.js plot images from live chart instances
  const chartImages = [];
  for (const [id, chartInstance] of Object.entries(charts)) {
    if (chartInstance && typeof chartInstance.toBase64Image === "function") {
      chartImages.push({
        base64: chartInstance.toBase64Image("image/png", 1),
        caption: `Fig. ${chartImages.length + 1}: ${id}`,
      });
    }
  }

  // Merge captured charts with any pre-provided ones
  const allChartImages = [
    ...(experiment.chartImages || []),
    ...chartImages,
  ];

  const enrichedExperiment = { ...experiment, chartImages: allChartImages };

  // 2. Generate PDF blob
  const blob = await pdf(
    <LabReportDocument experiment={enrichedExperiment} meta={meta} />
  ).toBlob();

  // 3. Trigger browser download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(experiment.title || "lab-report")
    .toLowerCase()
    .replace(/\s+/g, "-")}_${new Date().toISOString().split("T")[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}