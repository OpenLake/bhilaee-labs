import json
import os

exp_json_str = """{
  "id": "exp-1",
  "title": "Formation of Bus Admittance Matrix (Y-Bus) for Transmission Systems",
  "labId": "power-system-lab",
  "status": "Software Oriented",
  "meta": {
    "simulationId": "",
    "simulationType": "MATLAB",
    "experimentType": "software",
    "status": "software-oriented",
    "difficulty": "intermediate",
    "estimatedTimeMinutes": 120,
    "version": "2.0",
    "contentState": "complete",
    "reviewStatus": "unreviewed"
  },
  "sections": {
    "aim": {
      "id": "aim",
      "title": "Aim",
      "isApplicable": true,
      "content": [
        {
          "type": "text",
          "content": "To determine the admittance matrix (Y-bus) of different transmission systems using analytical methods."
        },
        {
          "type": "list",
          "style": "ordered",
          "items": [
            "To form the Y-bus matrix for small-scale transmission networks (3-bus systems).",
            "To form the Y-bus matrix for large-scale transmission networks (10-bus systems).",
            "To analyze the effect of line charging (shunt admittances) on the Y-bus matrix for long transmission lines.",
            "To determine the Y-bus for systems with ideal transformers using turns ratio.",
            "To verify analytical results using MATLAB simulations."
          ]
        }
      ]
    },
    "apparatus": {
      "id": "apparatus",
      "title": "Apparatus & Software",
      "isApplicable": true,
      "content": [
        {
          "type": "table",
          "headers": ["Sl. No.", "Apparatus / Software", "Technical Specification", "Quantities"],
          "rows": [
            ["1", "MATLAB", "R2023 or compatible", "1"]
          ]
        }
      ]
    },
    "theory": {
      "id": "theory",
      "title": "Theory",
      "isApplicable": true,
      "content": [
        {
          "type": "text",
          "content": "In power system analysis, the bus admittance matrix (Ybus) is essential for load flow studies, short circuit analysis, and stability studies. It offers a clear and compact way to represent the network through nodal analysis. The Ybus connects bus current injections to bus voltages as follows:"
        },
        {
          "type": "equation",
          "value": "[I] = [Y_{bus}][V]"
        },
        {
          "type": "text",
          "content": "The Ybus matrix is typically sparse and symmetric. Once created, it can be reused for various calculations such as power flow or fault analysis without rebuilding the entire network equations."
        },
        {
          "type": "text",
          "content": "**Derivation of Ybus for a 3-Bus System (Short Transmission Line)**"
        },
        {
          "type": "text",
          "content": "Consider a 3-bus power system with buses 1, 2, and 3 interconnected by transmission lines of admittances y12, y23, y31. Applying KCL at each bus:"
        },
        {
          "type": "equation",
          "value": "I_1 = I_{12} + I_{13}"
        },
        {
          "type": "equation",
          "value": "I_1 = (V_1 - V_2)y_{12} + (V_1 - V_3)y_{13}"
        },
        {
          "type": "equation",
          "value": "I_2 = I_{21} + I_{23}"
        },
        {
          "type": "equation",
          "value": "I_2 = (V_2 - V_1)y_{21} + (V_2 - V_3)y_{23}"
        },
        {
          "type": "equation",
          "value": "I_3 = I_{31} + I_{32}"
        },
        {
          "type": "equation",
          "value": "I_3 = (V_3 - V_1)y_{31} + (V_3 - V_2)y_{32}"
        },
        {
          "type": "text",
          "content": "Simplifying, we get:"
        },
        {
          "type": "equation",
          "value": "I_1 = V_1(y_{12} + y_{13}) - y_{12}V_2 - y_{13}V_3"
        },
        {
          "type": "equation",
          "value": "I_2 = -y_{21}V_1 + V_2(y_{21} + y_{23}) - y_{23}V_3"
        },
        {
          "type": "equation",
          "value": "I_3 = -y_{31}V_1 - y_{32}V_2 + V_3(y_{31} + y_{32})"
        },
        {
          "type": "text",
          "content": "In matrix form:"
        },
        {
          "type": "equation",
          "value": "\\begin{bmatrix} I_1 \\\\ I_2 \\\\ I_3 \\end{bmatrix} = \\begin{bmatrix} y_{12}+y_{13} & -y_{12} & -y_{13} \\\\ -y_{21} & y_{21}+y_{23} & -y_{23} \\\\ -y_{31} & -y_{32} & y_{31}+y_{32} \\end{bmatrix} \\begin{bmatrix} V_1 \\\\ V_2 \\\\ V_3 \\end{bmatrix}"
        },
        {
          "type": "text",
          "content": "Thus, the bus admittance matrix for the 3-bus system is:"
        },
        {
          "type": "equation",
          "value": "[Y_{bus}] = \\begin{bmatrix} Y_{11} & Y_{12} & Y_{13} \\\\ Y_{21} & Y_{22} & Y_{23} \\\\ Y_{31} & Y_{32} & Y_{33} \\end{bmatrix}"
        },
        {
          "type": "text",
          "content": "where:"
        },
        {
          "type": "equation",
          "value": "Y_{11} = y_{12} + y_{13},\\quad Y_{12} = Y_{21} = -y_{12}"
        },
        {
          "type": "equation",
          "value": "Y_{22} = y_{21} + y_{23},\\quad Y_{23} = Y_{32} = -y_{23}"
        },
        {
          "type": "equation",
          "value": "Y_{33} = y_{31} + y_{32},\\quad Y_{31} = Y_{13} = -y_{13}"
        },
        {
          "type": "text",
          "content": "**Derivation of Ybus for a 3-Bus System (Long Transmission Line)**"
        },
        {
          "type": "text",
          "content": "Let the currents injected at buses 1, 2, and 3 be I1, I2, and I3 respectively. Including self/shunt admittances y10, y20, y30 at buses 1, 2, and 3:"
        },
        {
          "type": "equation",
          "value": "I_1 = I_{10} + I_{12} + I_{13}"
        },
        {
          "type": "equation",
          "value": "I_1 = V_1 y_{10} + (V_1 - V_2)y_{12} + (V_1 - V_3)y_{13}"
        },
        {
          "type": "equation",
          "value": "I_2 = I_{20} + I_{12} + I_{23}"
        },
        {
          "type": "equation",
          "value": "I_2 = V_2 y_{20} + (V_2 - V_1)y_{12} + (V_2 - V_3)y_{23}"
        },
        {
          "type": "equation",
          "value": "I_3 = I_{30} + I_{13} + I_{23}"
        },
        {
          "type": "equation",
          "value": "I_3 = V_3 y_{30} + (V_3 - V_1)y_{13} + (V_3 - V_2)y_{23}"
        },
        {
          "type": "text",
          "content": "Simplifying, we get:"
        },
        {
          "type": "equation",
          "value": "I_1 = V_1(y_{10} + y_{12} + y_{13}) - y_{12}V_2 - y_{13}V_3"
        },
        {
          "type": "equation",
          "value": "I_2 = -y_{12}V_1 + V_2(y_{20} + y_{12} + y_{23}) - y_{23}V_3"
        },
        {
          "type": "equation",
          "value": "I_3 = -y_{13}V_1 - y_{23}V_2 + V_3(y_{30} + y_{13} + y_{23})"
        },
        {
          "type": "text",
          "content": "In matrix form:"
        },
        {
          "type": "equation",
          "value": "\\begin{bmatrix} I_1 \\\\ I_2 \\\\ I_3 \\end{bmatrix} = \\begin{bmatrix} y_{10}+y_{12}+y_{13} & -y_{12} & -y_{13} \\\\ -y_{12} & y_{20}+y_{12}+y_{23} & -y_{23} \\\\ -y_{13} & -y_{23} & y_{30}+y_{13}+y_{23} \\end{bmatrix} \\begin{bmatrix} V_1 \\\\ V_2 \\\\ V_3 \\end{bmatrix}"
        },
        {
          "type": "text",
          "content": "Thus, the bus admittance matrix is:"
        },
        {
          "type": "equation",
          "value": "[Y_{bus}] = \\begin{bmatrix} Y_{11} & Y_{12} & Y_{13} \\\\ Y_{21} & Y_{22} & Y_{23} \\\\ Y_{31} & Y_{32} & Y_{33} \\end{bmatrix}"
        },
        {
          "type": "text",
          "content": "where:"
        },
        {
          "type": "equation",
          "value": "Y_{12} = Y_{21} = -y_{12},\\quad Y_{23} = Y_{32} = -y_{23},\\quad Y_{31} = Y_{13} = -y_{13}"
        },
        {
          "type": "equation",
          "value": "Y_{11} = y_{10}+y_{12}+y_{13},\\quad Y_{22} = y_{20}+y_{12}+y_{23},\\quad Y_{33} = y_{30}+y_{13}+y_{23}"
        }
      ]
    },
    "preLab": {
      "id": "preLab",
      "title": "Pre-Lab / Circuit Diagram",
      "isApplicable": true,
      "content": [
        {
          "type": "text",
          "content": "**Flowchart for Y-Bus Formation — Short Transmission Line**"
        },
        {
          "type": "list",
          "style": "ordered",
          "items": [
            "Start",
            "Read inputs: nbus, From_Bus, To_Bus, R, X",
            "Create Ybus = zeros(nbus, nbus)",
            "Compute Y = 1 / (R + jX)",
            "For each line: set Yij = Yij − Y, Yji = Yij, Yii = Yii + Y, Yjj = Yjj + Y",
            "Display Ybus",
            "End"
          ]
        },
        {
          "type": "text",
          "content": "**Flowchart for Y-Bus Formation — Long Transmission Line**"
        },
        {
          "type": "list",
          "style": "ordered",
          "items": [
            "Start",
            "Read inputs: nbus, From_Bus, To_Bus, R, X, B",
            "Create Ybus = zeros(nbus, nbus)",
            "Compute Y = 1 / (R + jX)",
            "For each line: set Yij = Yij − Y, Yji = Yij, Yii = Yii + Y + jB/2, Yjj = Yjj + Y + jB/2",
            "Display Ybus",
            "End"
          ]
        },
        {
          "type": "text",
          "content": "**Circuit Diagram — 3-Bus Power System (Short Transmission)**"
        },
        {
          "type": "image",
          "assetId": "fig1-3bus-short-transmission",
          "caption": "Figure 1: 3-Bus Power System (Short Transmission Line)"
        },
        {
          "type": "text",
          "content": "**Circuit Diagram — 3-Bus Power System (Long Transmission)**"
        },
        {
          "type": "image",
          "assetId": "fig2-3bus-long-transmission",
          "caption": "Figure 2: 3-Bus Power System (Long Transmission Line with Shunt Admittances)"
        }
      ]
    },
    "procedure": {
      "id": "procedure",
      "title": "Procedure",
      "isApplicable": true,
      "content": [
        {
          "type": "list",
          "style": "ordered",
          "items": [
            "Define the number of buses (nbus) and line data (From Bus, To Bus, R, X, and B if applicable).",
            "Initialize the Ybus matrix as a zero matrix of size nbus × nbus.",
            "For each transmission line, compute the series admittance Y = 1 / (R + jX).",
            "For short lines: update off-diagonal elements Yij = Yji = −Y and diagonal elements Yii, Yjj += Y.",
            "For long lines: additionally add jB/2 to each of the two diagonal elements Yii and Yjj.",
            "For systems with ideal transformers: use the turns ratio formulation to populate the 2×2 Ybus.",
            "For junction-based networks: apply KCL at the junction node, solve for Vt, and express bus currents in terms of bus voltages to obtain Ybus.",
            "Display the computed Ybus matrix in rectangular (complex) form.",
            "Convert Ybus elements to polar form (magnitude and angle in degrees) for verification.",
            "Verify computed results against hand-calculated values."
          ]
        },
        {
          "type": "text",
          "content": "The following four problems are solved in this experiment:"
        },
        {
          "type": "list",
          "style": "ordered",
          "items": [
            "Q1: 3-bus system with given line impedances and line-charging susceptances (long transmission line model).",
            "Q2: 3-bus system with generators as ideal voltage sources, all series and shunt impedances Z = j1 \\Omega, using junction nodal analysis.",
            "Q3: 10-bus power system with 11 lines, no shunt admittances, using the direct inspection method.",
            "Q4: 2-bus system with a transmission line of admittance Y and ideal transformers of turns ratios 1:t1 and t2:1 at the two ends."
          ]
        }
      ]
    },
    "simulation": {
      "id": "simulation",
      "title": "Simulation / Execution",
      "isApplicable": true,
      "content": [
        {
          "type": "text",
          "content": "MATLAB was used to compute and verify the Y-bus matrix for all four problems. The code for each problem initializes line data, iterates over each transmission line to build the Ybus matrix, and displays the result in both rectangular and polar forms."
        },
        {
          "type": "text",
          "content": "**MATLAB Code — Q1 (3-Bus, Long Transmission with Line Charging)**"
        },
        {
          "type": "image",
          "assetId": "fig3-matlab-code-q1",
          "caption": "Figure 3: MATLAB code used for Q1"
        },
        {
          "type": "text",
          "content": "**MATLAB Code — Q2 (3-Bus, Junction Network)**"
        },
        {
          "type": "image",
          "assetId": "fig5-matlab-code-q2",
          "caption": "Figure 5: MATLAB code used for Q2"
        },
        {
          "type": "text",
          "content": "**MATLAB Code — Q3 (10-Bus System)**"
        },
        {
          "type": "image",
          "assetId": "fig7-matlab-code-q3",
          "caption": "Figure 7: MATLAB code used for Q3"
        },
        {
          "type": "text",
          "content": "**MATLAB Code — Q4 (2-Bus with Ideal Transformers)**"
        },
        {
          "type": "image",
          "assetId": "fig10-matlab-code-q4",
          "caption": "Figure 10: MATLAB code used for Q4"
        }
      ]
    },
    "observation": {
      "id": "observation",
      "title": "Observations",
      "isApplicable": true,
      "content": [
        {
          "type": "text",
          "content": "**Q1 — Computed Ybus (3-Bus, Long Transmission Line)**"
        },
        {
          "type": "image",
          "assetId": "fig4-ybus-q1",
          "caption": "Figure 4: Computed Ybus for Q1"
        },
        {
          "type": "text",
          "content": "**Q2 — Computed Ybus (3-Bus, Junction Network)**"
        },
        {
          "type": "image",
          "assetId": "fig6-ybus-q2",
          "caption": "Figure 6: Computed Ybus for Q2"
        },
        {
          "type": "text",
          "content": "**Q3 — Computed Ybus (10-Bus System)**"
        },
        {
          "type": "image",
          "assetId": "fig8-ybus-q3",
          "caption": "Figure 8: Computed Ybus for Q3"
        },
        {
          "type": "image",
          "assetId": "fig9-ybus-q3-polar",
          "caption": "Figure 9: Computed Ybus for Q3 Polar Form"
        },
        {
          "type": "text",
          "content": "**Q4 — Computed Ybus (2-Bus System with Ideal Transformers)**"
        },
        {
          "type": "image",
          "assetId": "fig11-ybus-q4",
          "caption": "Figure 11: Computed Ybus for Q4"
        }
      ]
    },
    "calculation": {
      "id": "calculation",
      "title": "Calculations",
      "isApplicable": true,
      "content": [
        {
          "type": "text",
          "content": "**Solved Problems**"
        },
        {
          "type": "text",
          "content": "**Q1.** Given a 3-bus system with the following line impedances (in per unit): Z12 = 0.1 + j0.3, Z23 = 0.2 + j0.4, Z13 = 0.1 + j0.2, and total line-charging susceptances: B12 = 1.0, B23 = 1.6, B13 = 0.0. Find the bus admittance matrix Ybus."
        },
        {
          "type": "text",
          "content": "Given Data:"
        },
        {
          "type": "equation",
          "value": "Z_{12} = 0.1 + j0.3,\\quad Z_{23} = 0.2 + j0.4,\\quad Z_{13} = 0.1 + j0.2"
        },
        {
          "type": "equation",
          "value": "B_{12} = 1.0,\\quad B_{23} = 1.6,\\quad B_{13} = 0.0"
        },
        {
          "type": "equation",
          "value": "Y_{12} = \\frac{1}{Z_{12}},\\quad Y_{23} = \\frac{1}{Z_{23}},\\quad Y_{13} = \\frac{1}{Z_{13}}"
        },
        {
          "type": "text",
          "content": "The diagonal elements of the Ybus are obtained as:"
        },
        {
          "type": "equation",
          "value": "Y_{ii} = \\sum Y_{ij}"
        },
        {
          "type": "text",
          "content": "The off-diagonal elements are given by:"
        },
        {
          "type": "equation",
          "value": "Y_{ij} = -\\frac{1}{Z_{ij}},\\quad i \\neq j"
        },
        {
          "type": "equation",
          "value": "\\therefore Y_{bus} = \\begin{bmatrix} Y_{11} & Y_{12} & Y_{13} \\\\ Y_{21} & Y_{22} & Y_{23} \\\\ Y_{31} & Y_{32} & Y_{33} \\end{bmatrix}"
        },
        {
          "type": "text",
          "content": "**Q2.** If a 3-bus network is shown, consider generators as ideal voltage sources. If rows 1, 2 and 3 of the Ybus matrix correspond to bus 1, 2 and 3 respectively, then determine the Ybus of the network."
        },
        {
          "type": "image",
          "assetId": "fig-q2-network-diagram",
          "caption": "3-Bus network with generators as ideal voltage sources (Q2)"
        },
        {
          "type": "text",
          "content": "Assume Voltage at the junction as Vt. By Ohm's and Kirchhoff's relations:"
        },
        {
          "type": "equation",
          "value": "V_1 - V_t = \\frac{i_1}{Y_1},\\qquad V_2 - V_t = \\frac{i_2}{Y_2},\\qquad V_3 - V_t = \\frac{i_3}{Y_3}"
        },
        {
          "type": "text",
          "content": "Equivalently,"
        },
        {
          "type": "equation",
          "value": "i_1 = Y_1(V_1 - V_t),\\quad i_2 = Y_2(V_2 - V_t),\\quad i_3 = Y_3(V_3 - V_t)"
        },
        {
          "type": "text",
          "content": "KCL at the junction Vt (including shunt current i0 = Y0Vt) gives:"
        },
        {
          "type": "equation",
          "value": "i_1 + i_2 + i_3 + i_0 = 0 \\implies Y_1(V_1-V_t) + Y_2(V_2-V_t) + Y_3(V_3-V_t) + Y_0 V_t = 0"
        },
        {
          "type": "text",
          "content": "Collect terms to solve for Vt:"
        },
        {
          "type": "equation",
          "value": "Y_1 V_1 + Y_2 V_2 + Y_3 V_3 - (Y_1 + Y_2 + Y_3 + Y_0)V_t = 0"
        },
        {
          "type": "text",
          "content": "hence"
        },
        {
          "type": "equation",
          "value": "V_t = \\frac{Y_1 V_1 + Y_2 V_2 + Y_3 V_3}{Y_{\\Sigma}},\\quad \\text{where } Y_{\\Sigma} \\equiv Y_1 + Y_2 + Y_3 + Y_0"
        },
        {
          "type": "text",
          "content": "Now substitute Vt into i1 = Y1(V1 − Vt):"
        },
        {
          "type": "equation",
          "value": "i_1 = Y_1 V_1 - Y_1 \\frac{Y_1 V_1 + Y_2 V_2 + Y_3 V_3}{Y_{\\Sigma}}"
        },
        {
          "type": "text",
          "content": "Rearranging to get coefficients of V1, V2, V3 and doing the same for i2, i3 yields the nodal form:"
        },
        {
          "type": "equation",
          "value": "\\begin{bmatrix} i_1 \\\\ i_2 \\\\ i_3 \\end{bmatrix} = \\frac{1}{Y_{\\Sigma}} \\begin{bmatrix} Y_1(Y_{\\Sigma}-Y_1) & -Y_1 Y_2 & -Y_1 Y_3 \\\\ -Y_2 Y_1 & Y_2(Y_{\\Sigma}-Y_2) & -Y_2 Y_3 \\\\ -Y_3 Y_1 & -Y_3 Y_2 & Y_3(Y_{\\Sigma}-Y_3) \\end{bmatrix} \\begin{bmatrix} V_1 \\\\ V_2 \\\\ V_3 \\end{bmatrix}"
        },
        {
          "type": "text",
          "content": "So in compact form (for i \\neq j):"
        },
        {
          "type": "equation",
          "value": "Y_{ij} = -\\frac{Y_i Y_j}{Y_{\\Sigma}},\\qquad Y_{ii} = \\frac{Y_i(Y_{\\Sigma} - Y_i)}{Y_{\\Sigma}}"
        },
        {
          "type": "text",
          "content": "Substituting numerical values: All series impedances and the shunt impedance are Z = j1 \\Omega (given). Thus:"
        },
        {
          "type": "equation",
          "value": "Y_1 = Y_2 = Y_3 = Y_0 = \\frac{1}{j1} = -j"
        },
        {
          "type": "text",
          "content": "Hence:"
        },
        {
          "type": "equation",
          "value": "Y_{\\Sigma} = Y_1 + Y_2 + Y_3 + Y_0 = 4(-j) = -4j"
        },
        {
          "type": "text",
          "content": "Compute diagonal and off-diagonal entries:"
        },
        {
          "type": "equation",
          "value": "Y_{ii} = \\frac{Y_i(Y_{\\Sigma} - Y_i)}{Y_{\\Sigma}} = \\frac{(-j)(-4j-(-j))}{-4j} = -\\frac{3}{4}j"
        },
        {
          "type": "equation",
          "value": "Y_{ij} = -\\frac{Y_i Y_j}{Y_{\\Sigma}} = -\\frac{(-j)(-j)}{-4j} = \\frac{1}{4}j \\quad (i \\neq j)"
        },
        {
          "type": "text",
          "content": "Therefore the numeric bus-admittance matrix is:"
        },
        {
          "type": "equation",
          "value": "[Y_{bus}] = \\begin{bmatrix} -\\frac{3}{4}j & \\frac{1}{4}j & \\frac{1}{4}j \\\\ \\frac{1}{4}j & -\\frac{3}{4}j & \\frac{1}{4}j \\\\ \\frac{1}{4}j & \\frac{1}{4}j & -\\frac{3}{4}j \\end{bmatrix}"
        },
        {
          "type": "text",
          "content": "**Q3.** A 10-bus power system is modeled using per-unit values. All line data are given in pu on a common system base. There are no shunt admittances at any bus. Using the direct inspection method, form the bus admittance matrix Ybus for the network defined by the following series impedances:"
        },
        {
          "type": "table",
          "headers": ["Line", "From bus", "To bus", "R (pu)", "X (pu)"],
          "rows": [
            ["1", "1", "2", "0.10", "0.30"],
            ["2", "1", "3", "0.05", "0.25"],
            ["3", "2", "4", "0.08", "0.24"],
            ["4", "2", "5", "0.06", "0.18"],
            ["5", "3", "6", "0.12", "0.36"],
            ["6", "4", "7", "0.09", "0.27"],
            ["7", "5", "8", "0.07", "0.21"],
            ["8", "6", "9", "0.11", "0.33"],
            ["9", "7", "10", "0.05", "0.15"],
            ["10", "8", "9", "0.08", "0.24"],
            ["11", "9", "10", "0.10", "0.30"]
          ]
        },
        {
          "type": "equation",
          "value": "Y_{ij} = -\\frac{1}{R_{ij} + jX_{ij}},\\quad Y_{ii} = \\sum_{k \\neq i} \\frac{1}{Z_{ik}}"
        },
        {
          "type": "text",
          "content": "**Q4.** Two buses i and j are connected with a Tx-line of admittance Y, at the two ends of which there are ideal transformers with turns ratio as shown. Bus admittance matrix for the system is:"
        },
        {
          "type": "image",
          "assetId": "fig-q4-transformer-network",
          "caption": "Two-bus system with transmission line of admittance Y and ideal transformers of turns ratio 1:ti and tj:1 (Q4)"
        },
        {
          "type": "text",
          "content": "The relation across the line with transformers is:"
        },
        {
          "type": "equation",
          "value": "t_i V_i - t_j V_j = \\frac{I_{ij}}{Y}"
        },
        {
          "type": "text",
          "content": "Expressing the injected currents at the buses in terms of bus voltages:"
        },
        {
          "type": "equation",
          "value": "I_i = t_i^2 Y V_i - t_i t_j Y V_j"
        },
        {
          "type": "equation",
          "value": "I_j = t_i t_j Y V_i - t_j^2 Y V_j"
        },
        {
          "type": "text",
          "content": "In matrix form, the bus admittance matrix is:"
        },
        {
          "type": "equation",
          "value": "\\begin{bmatrix} I_i \\\\ I_j \\end{bmatrix} = \\begin{bmatrix} t_i^2 Y & -t_i t_j Y \\\\ -t_i t_j Y & t_j^2 Y \\end{bmatrix} \\begin{bmatrix} V_i \\\\ V_j \\end{bmatrix} = [Y_{bus}] \\begin{bmatrix} V_i \\\\ V_j \\end{bmatrix}"
        }
      ]
    },
    "result": {
      "id": "result",
      "title": "Results & Analysis",
      "isApplicable": true,
      "content": [
        {
          "type": "text",
          "content": "The Y-bus matrices were successfully computed using MATLAB for all four problems. The results are summarized below."
        },
        {
          "type": "table",
          "headers": ["Problem", "Network Type", "Buses", "Lines", "Key Observation"],
          "rows": [
            ["Q1", "3-Bus Long Transmission", "3", "3", "Line charging (B/2) adds to diagonal elements; off-diagonals are negative series admittances."],
            ["Q2", "3-Bus Junction Network", "3", "3 + shunt", "Symmetric Ybus with equal diagonal (−0.75j) and off-diagonal (+0.25j) entries due to uniform impedances."],
            ["Q3", "10-Bus Short Transmission", "10", "11", "Sparse symmetric 10×10 Ybus; zero entries where no direct line exists between buses."],
            ["Q4", "2-Bus with Transformers", "2", "1", "Ybus diagonal elements scale as ti² and tj²; off-diagonal elements scale as −ti·tj."]
          ]
        },
        {
          "type": "text",
          "content": "For Q1, including line charging susceptances (B/2 = 0.5, 0.8, 0.0) modified the diagonal elements of the Ybus compared to the short-line model, while the off-diagonal elements remained equal to the negative series admittances. For Q3, the 10×10 Ybus confirmed the sparse nature of admittance matrices in large power systems, with most off-diagonal entries being zero due to limited inter-bus connectivity. The transformer-coupled system in Q4 produced a 2×2 Ybus whose entries are entirely determined by the line admittance Y and the turns ratios t1 and t2."
        }
      ]
    },
    "postLab": {
      "id": "postLab",
      "title": "Post-Lab / Viva Voce",
      "isApplicable": true,
      "content": [
        {
          "type": "text",
          "content": "**Q:** What is the bus admittance matrix (Ybus) and why is it important in power system analysis?"
        },
        {
          "type": "text",
          "content": "**A:** The bus admittance matrix (Ybus) is a square matrix that relates the bus current injections to the bus voltages in a power system through the relation [I] = [Ybus][V]. It is important because it provides a compact, systematic, and computationally efficient representation of the network topology and line admittances. Ybus is used extensively in load flow analysis, short circuit studies, and stability analysis. It is typically a sparse and symmetric matrix, which reduces storage requirements and computational effort in large systems."
        },
        {
          "type": "text",
          "content": "**Q:** How are the diagonal and off-diagonal elements of the Ybus matrix formed using the direct inspection method?"
        },
        {
          "type": "text",
          "content": "**A:** Using the direct inspection method, the diagonal element Yii of the Ybus is the sum of all admittances connected to bus i, including both series line admittances and any shunt admittances at that bus. The off-diagonal element Yij (i ≠ j) is the negative of the total admittance directly connected between bus i and bus j. This method allows rapid construction of the Ybus without writing KCL equations explicitly."
        },
        {
          "type": "text",
          "content": "**Q:** How does line charging affect the Ybus matrix in long transmission line models compared to short transmission line models?"
        },
        {
          "type": "text",
          "content": "**A:** In the short transmission line model, each line is represented only by its series impedance, so only off-diagonal elements and diagonal elements due to series admittances are affected. In the long transmission line model, line charging susceptances (B/2) are added as shunt admittances at each end of the line. This adds an extra jB/2 term to the diagonal elements Yii and Yjj for every line connected to those buses. The off-diagonal elements remain equal to the negative series admittances and are unaffected by line charging."
        },
        {
          "type": "text",
          "content": "**Q:** What is the significance of the sparsity of the Ybus matrix in large power systems?"
        },
        {
          "type": "text",
          "content": "**A:** In a large power system, each bus is typically connected to only a few other buses, so most off-diagonal elements of the Ybus are zero. This sparsity is highly significant for computational efficiency: sparse matrix storage formats drastically reduce memory requirements, and sparse solvers (such as LU factorization with optimal ordering) reduce the computational time for solving the network equations. For a 10-bus system as in Q3, the Ybus contains many zero off-diagonal entries corresponding to pairs of buses with no direct connection."
        },
        {
          "type": "text",
          "content": "**Q:** How does the presence of ideal transformers with off-nominal turns ratios affect the Ybus matrix structure?"
        },
        {
          "type": "text",
          "content": "**A:** When ideal transformers with turns ratios 1:ti and tj:1 are placed at the two ends of a transmission line, the resulting 2×2 Ybus is no longer symmetric in general if ti ≠ tj. The diagonal elements become ti²Y and tj²Y, and the off-diagonal elements become −ti·tj·Y. This asymmetry means the Ybus loses its standard symmetric property, which must be accounted for in load flow and fault analysis algorithms that typically assume a symmetric Ybus."
        },
        {
          "type": "text",
          "content": "**Q:** In Q2, why is the junction voltage Vt eliminated before forming the Ybus?"
        },
        {
          "type": "text",
          "content": "**A:** The junction node Vt is an internal node that has no external current injection. In the Ybus formulation, only bus nodes (where generators or loads are connected) are retained. The internal junction node is eliminated by applying KCL at that node and expressing Vt in terms of the bus voltages V1, V2, and V3. This process, known as Kron reduction or node elimination, reduces the network to only the external bus nodes, yielding a 3×3 Ybus that directly relates the injected bus currents to the bus voltages."
        }
      ]
    },
    "resources": {
      "id": "resources",
      "title": "References & Resources",
      "isApplicable": false,
      "content": []
    },
    "conclusion": {
      "id": "conclusion",
      "title": "Conclusion",
      "isApplicable": true,
      "content": [
        {
          "type": "text",
          "content": "In this experiment, we determined the bus admittance matrix (Ybus) for different transmission systems using analytical methods. We used the direct inspection method for multi-bus networks and systematic nodal analysis for networks with junctions and transformers. We applied MATLAB to compute and verify Ybus for various setups, including short transmission lines, long transmission lines with line charging, and systems with ideal transformers."
        },
        {
          "type": "text",
          "content": "The Ybus matrix is crucial in power system analysis because it gives a clear representation of network admittances that connect bus currents and voltages. By comparing short and long transmission lines, we found that line charging adds extra shunt admittances, which affect the diagonal elements of Ybus. In contrast, short lines mainly impact the off-diagonal terms. This experiment shows the importance of accurately forming Ybus for reliable load flow, fault, and stability analysis in power systems."
        }
      ]
    }
  }
}"""

data = json.loads(exp_json_str)
data["id"] = "exp-1"

# The user's postLab already appears well-formatted with "**Q:**" and "**A:**" directly in their text,
# but verify and fix prefix issues just in case.
for i, item in enumerate(data.get("sections", {}).get("postLab", {}).get("content", [])):
    if item["type"] == "text":
        if item["content"].startswith("**Q1."):
            item["content"] = item["content"].replace("**Q1. ", "**Q:** ")
        elif item["content"].startswith("**Q2."):
            item["content"] = item["content"].replace("**Q2. ", "**Q:** ")
        elif item["content"].startswith("**Q3."):
            item["content"] = item["content"].replace("**Q3. ", "**Q:** ")
        elif item["content"].startswith("**Q4."):
            item["content"] = item["content"].replace("**Q4. ", "**Q:** ")
        elif item["content"].startswith("**Q5."):
            item["content"] = item["content"].replace("**Q5. ", "**Q:** ")
        elif item["content"].startswith("**Q6."):
            item["content"] = item["content"].replace("**Q6. ", "**Q:** ")

# Create output directories if they don't exist
os.makedirs(r'e:\MyApp\MyApp2\data\experiments\power-system-lab', exist_ok=True)
os.makedirs(r'e:\MyApp\MyApp2\public\assets\labs\power-system-lab\exp-1', exist_ok=True)

exp1_path = r'e:\MyApp\MyApp2\data\experiments\power-system-lab\exp-1.json'
with open(exp1_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

# Generate exp-1.assets.json
asset_keys = [
    ("fig1-3bus-short-transmission", "Figure 1: 3-Bus Power System (Short Transmission Line)"),
    ("fig2-3bus-long-transmission", "Figure 2: 3-Bus Power System (Long Transmission Line with Shunt Admittances)"),
    ("fig3-matlab-code-q1", "Figure 3: MATLAB code used for Q1"),
    ("fig5-matlab-code-q2", "Figure 5: MATLAB code used for Q2"),
    ("fig7-matlab-code-q3", "Figure 7: MATLAB code used for Q3"),
    ("fig10-matlab-code-q4", "Figure 10: MATLAB code used for Q4"),
    ("fig4-ybus-q1", "Figure 4: Computed Ybus for Q1"),
    ("fig6-ybus-q2", "Figure 6: Computed Ybus for Q2"),
    ("fig8-ybus-q3", "Figure 8: Computed Ybus for Q3"),
    ("fig9-ybus-q3-polar", "Figure 9: Computed Ybus for Q3 Polar Form"),
    ("fig11-ybus-q4", "Figure 11: Computed Ybus for Q4"),
    ("fig-q2-network-diagram", "3-Bus network with generators as ideal voltage sources (Q2)"),
    ("fig-q4-transformer-network", "Two-bus system with transmission line of admittance Y and ideal transformers (Q4)")
]

assets_map = {}
for key, desc in asset_keys:
    assets_map[key] = {
        "type": "image",
        "path": f"/assets/labs/power-system-lab/exp-1/{key}.png",
        "description": desc
    }

assets_path = r'e:\MyApp\MyApp2\data\experiments\power-system-lab\exp-1.assets.json'
with open(assets_path, 'w', encoding='utf-8') as f:
    json.dump(assets_map, f, indent=2)

# Update registry.json
registry_path = r'e:\MyApp\MyApp2\data\experiments\registry.json'
with open(registry_path, 'r', encoding='utf-8') as f:
    registry = json.load(f)

for category in registry.get('categories', []):
    if category.get('id') == 'power-system-lab':
        for exp in category.get('experiments', []):
            if exp.get('id') == '1':
                exp['title'] = data['title']
                exp['fileName'] = "exp-1.json"
                exp['status'] = "Software Oriented"
                exp['completeness'] = 1

with open(registry_path, 'w', encoding='utf-8') as f:
    json.dump(registry, f, indent=2)

print("Created power-system-lab/exp-1.json and exp-1.assets.json. Updated registry.")
