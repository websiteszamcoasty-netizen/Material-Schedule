import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Project, MaterialItem, Settings } from '../types';
import { worksheetTotal, projectGrandTotal, buildMaterialSummary, applySettingsToGrandTotal, formatCurrency } from './calculations';

const NAVY: [number, number, number] = [24, 60, 92];
const AMBER: [number, number, number] = [242, 177, 52];
const LIGHT: [number, number, number] = [238, 244, 249];

function addFooter(doc: jsPDF, project: Project) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const h = doc.internal.pageSize.getHeight();
    const w = doc.internal.pageSize.getWidth();
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`${project.info.projectName}`, 14, h - 8);
    doc.text(`Prepared By: ${project.info.preparedBy || '-'}  |  ${project.info.date}`, w / 2, h - 8, { align: 'center' });
    doc.text(`Page ${i} of ${pageCount}`, w - 14, h - 8, { align: 'right' });
  }
}

export function exportProjectToPdf(project: Project, materials: MaterialItem[], settings: Settings) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  // ---- Cover Page ----
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, 45, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('CONSTRUCTION MATERIAL SCHEDULE', pageW / 2, 20, { align: 'center' });
  doc.setFontSize(13);
  doc.text(project.info.projectName, pageW / 2, 32, { align: 'center' });

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  let y = 60;
  const info: [string, string][] = [
    ['Client', project.info.client],
    ['Consultant', project.info.consultant],
    ['Contractor', project.info.contractor],
    ['Location', project.info.location],
    ['BOQ Reference', project.info.boqReference],
    ['Date', project.info.date],
    ['Prepared By', project.info.preparedBy],
    ['Revision', project.info.revision]
  ];
  info.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value || '-', 70, y);
    y += 8;
  });

  // ---- Table of contents ----
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(...NAVY);
  doc.text('Table of Contents', 14, 18);
  const tocBody = project.worksheets.map((ws, i) => [String(i + 1), ws.title, formatCurrency(worksheetTotal(ws), project.info.currency)]);
  tocBody.push(['', 'Material Summary', '']);
  tocBody.push(['', 'Grand Summary', '']);
  autoTable(doc, {
    startY: 24,
    head: [['#', 'Element', 'Amount']],
    body: tocBody,
    headStyles: { fillColor: NAVY },
    styles: { fontSize: 10 }
  });

  // ---- Element worksheets ----
  for (const ws of project.worksheets) {
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(...NAVY);
    doc.text(`${ws.title}`, 14, 16);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`${project.info.projectName}  |  Ref: ${project.info.boqReference}  |  Rev: ${project.info.revision}`, 14, 22);

    const body = ws.rows.map(row => row.subheading
      ? [{ content: row.description, colSpan: 7, styles: { fontStyle: 'bold', fillColor: LIGHT } }]
      : [
          row.ref, row.description, row.unit,
          row.inputQty ?? '', row.factor ?? '', row.qty ?? '',
          row.amount != null ? formatCurrency(row.amount, project.info.currency) : ''
        ]
    );

    autoTable(doc, {
      startY: 26,
      head: [['Ref', 'Description', 'Unit', 'Input Qty', 'Factor', 'Qty', 'Amount']],
      // @ts-expect-error - autotable accepts mixed row content
      body,
      headStyles: { fillColor: NAVY },
      styles: { fontSize: 8, cellPadding: 1.5 },
      columnStyles: { 1: { cellWidth: 90 } },
      foot: [['', '', '', '', '', 'ELEMENT TOTAL', formatCurrency(worksheetTotal(ws), project.info.currency)]],
      footStyles: { fillColor: AMBER, textColor: 20, fontStyle: 'bold' }
    });
  }

  // ---- Material summary ----
  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(...NAVY);
  doc.text('Material Summary', 14, 16);
  const summary = buildMaterialSummary(project.worksheets, materials);
  autoTable(doc, {
    startY: 22,
    head: [['Material', 'Unit', 'Total Quantity', 'Total Amount']],
    body: summary.map(s => [s.name, s.unit, s.totalQty, formatCurrency(s.totalAmount, project.info.currency)]),
    headStyles: { fillColor: NAVY },
    styles: { fontSize: 9 }
  });

  // ---- Grand summary ----
  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(...NAVY);
  doc.text('Grand Summary', 14, 16);
  const gt = projectGrandTotal(project.worksheets);
  const adj = applySettingsToGrandTotal(gt, settings);
  const rows = project.worksheets.map(ws => [ws.title, formatCurrency(worksheetTotal(ws), project.info.currency)]);
  autoTable(doc, {
    startY: 22,
    head: [['Element', 'Amount']],
    body: rows,
    foot: [
      ['Subtotal (Elements)', formatCurrency(adj.grandTotal, project.info.currency)],
      [`Waste Factor (${settings.wasteFactorPercent}%)`, formatCurrency(adj.waste, project.info.currency)],
      [`Labour Factor (${settings.labourFactorPercent}%)`, formatCurrency(adj.labour, project.info.currency)],
      [`Markup (${settings.markupPercent}%)`, formatCurrency(adj.markup, project.info.currency)],
      [`Tax (${settings.taxPercent}%)`, formatCurrency(adj.tax, project.info.currency)],
      ['GRAND TOTAL', formatCurrency(adj.finalTotal, project.info.currency)]
    ],
    headStyles: { fillColor: NAVY },
    footStyles: { fillColor: AMBER, textColor: 20, fontStyle: 'bold' },
    styles: { fontSize: 10 }
  });

  // ---- Signatures ----
  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(...NAVY);
  doc.text('Signatures', 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  const sigLines = ['Prepared By', 'Checked By', 'Approved By'];
  let sy = 40;
  sigLines.forEach(label => {
    doc.text(`${label}:`, 20, sy);
    doc.line(60, sy, 160, sy);
    doc.text('Date:', 170, sy);
    doc.line(185, sy, 250, sy);
    sy += 25;
  });

  addFooter(doc, project);
  doc.save(`${project.info.projectName.replace(/[^a-z0-9]+/gi, '_')}_Material_Schedule.pdf`);
}
