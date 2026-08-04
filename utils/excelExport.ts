import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Project, MaterialItem, Settings } from '../types';
import { worksheetTotal, projectGrandTotal, buildMaterialSummary, applySettingsToGrandTotal } from './calculations';

const NAVY = 'FF183C5C';
const AMBER = 'FFF2B134';
const LIGHT = 'FFEEF4F9';
const WHITE = 'FFFFFFFF';

function styleTitleRow(row: ExcelJS.Row) {
  row.font = { bold: true, size: 14, color: { argb: WHITE } };
  row.eachCell(c => {
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
    c.alignment = { vertical: 'middle', horizontal: 'center' };
  });
}

function styleHeaderRow(row: ExcelJS.Row) {
  row.font = { bold: true, color: { argb: WHITE } };
  row.eachCell(c => {
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
    c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    c.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
  });
}

function currencyFmt(currency: string) {
  return `"${currency}" #,##0.00`;
}

export async function exportProjectToExcel(project: Project, materials: MaterialItem[], settings: Settings) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Material Schedule Calculator Pro';
  wb.created = new Date();

  // ---- Cover Sheet ----
  const cover = wb.addWorksheet('Cover Sheet', { pageSetup: { orientation: 'landscape' } });
  cover.mergeCells('B2:H2');
  cover.getCell('B2').value = 'CONSTRUCTION MATERIAL SCHEDULE';
  cover.getCell('B2').font = { bold: true, size: 22, color: { argb: NAVY } };
  cover.mergeCells('B4:H4');
  cover.getCell('B4').value = project.info.projectName;
  cover.getCell('B4').font = { bold: true, size: 16 };

  const infoRows: [string, string][] = [
    ['Client', project.info.client],
    ['Consultant', project.info.consultant],
    ['Contractor', project.info.contractor],
    ['Location', project.info.location],
    ['BOQ Reference', project.info.boqReference],
    ['Date', project.info.date],
    ['Prepared By', project.info.preparedBy],
    ['Revision', project.info.revision]
  ];
  let r = 6;
  for (const [label, value] of infoRows) {
    cover.getCell(`B${r}`).value = label;
    cover.getCell(`B${r}`).font = { bold: true };
    cover.getCell(`D${r}`).value = value;
    r++;
  }
  cover.getColumn('B').width = 20;
  cover.getColumn('D').width = 40;

  // ---- Worksheet per element ----
  for (const ws of project.worksheets) {
    const sheet = wb.addWorksheet(ws.title.substring(0, 31), { pageSetup: { orientation: 'landscape', fitToPage: true } });
    sheet.columns = [
      { width: 6 }, { width: 42 }, { width: 10 }, { width: 12 },
      { width: 10 }, { width: 12 }, { width: 14 }, { width: 16 }
    ];
    sheet.mergeCells('A1:H1');
    sheet.getCell('A1').value = `${project.info.projectName} — ${ws.title}`;
    styleTitleRow(sheet.getRow(1));
    sheet.getRow(1).height = 22;

    sheet.mergeCells('A2:H2');
    sheet.getCell('A2').value = `Ref: ${project.info.boqReference}  |  Prepared By: ${project.info.preparedBy}  |  Date: ${project.info.date}  |  Rev: ${project.info.revision}`;
    sheet.getCell('A2').font = { italic: true, size: 9 };

    const header = sheet.addRow(['REF', 'DESCRIPTION', 'UNIT', 'INPUT QTY', 'FCTR', 'QTY', 'RATE', 'AMOUNT']);
    styleHeaderRow(header);
    sheet.views = [{ state: 'frozen', ySplit: 3 }];
    sheet.autoFilter = { from: 'A3', to: 'H3' };

    ws.rows.forEach((row, idx) => {
      const excelRow = sheet.addRow([
        row.ref,
        row.description,
        row.unit,
        row.subheading ? null : row.inputQty,
        row.subheading ? null : row.factor,
        row.subheading ? null : row.qty,
        row.subheading ? null : row.rate,
        row.subheading ? null : row.amount
      ]);
      if (row.subheading) {
        excelRow.font = { bold: true, italic: true };
        sheet.mergeCells(`B${excelRow.number}:H${excelRow.number}`);
      } else {
        if (idx % 2 === 0) {
          excelRow.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT } }; });
        }
        excelRow.getCell(7).numFmt = currencyFmt(project.info.currency);
        excelRow.getCell(8).numFmt = currencyFmt(project.info.currency);
        excelRow.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMBER } };
      }
      excelRow.eachCell(c => {
        c.border = { top: { style: 'hair' }, bottom: { style: 'hair' }, left: { style: 'hair' }, right: { style: 'hair' } };
      });
    });

    const totalRow = sheet.addRow(['', 'ELEMENT TOTAL', '', '', '', '', '', worksheetTotal(ws)]);
    totalRow.font = { bold: true };
    totalRow.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT } }; });
    totalRow.getCell(8).numFmt = currencyFmt(project.info.currency);

    sheet.headerFooter.oddFooter = `&L${project.info.projectName}&C${ws.title}&RPage &P of &N`;
  }

  // ---- Material Summary ----
  const summary = buildMaterialSummary(project.worksheets, materials);
  const summarySheet = wb.addWorksheet('Material Summary', { pageSetup: { orientation: 'landscape' } });
  summarySheet.columns = [{ width: 36 }, { width: 14 }, { width: 16 }, { width: 18 }];
  summarySheet.mergeCells('A1:D1');
  summarySheet.getCell('A1').value = `${project.info.projectName} — Material Summary`;
  styleTitleRow(summarySheet.getRow(1));
  const sHeader = summarySheet.addRow(['MATERIAL', 'UNIT', 'TOTAL QUANTITY', 'TOTAL AMOUNT']);
  styleHeaderRow(sHeader);
  summarySheet.views = [{ state: 'frozen', ySplit: 2 }];
  summarySheet.autoFilter = { from: 'A2', to: 'D2' };
  summary.forEach((line, idx) => {
    const row = summarySheet.addRow([line.name, line.unit, line.totalQty, line.totalAmount]);
    if (idx % 2 === 0) row.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT } }; });
    row.getCell(4).numFmt = currencyFmt(project.info.currency);
  });

  // ---- Rates Library ----
  const ratesSheet = wb.addWorksheet('Rates', { pageSetup: { orientation: 'landscape' } });
  ratesSheet.columns = [{ width: 36 }, { width: 12 }, { width: 16 }, { width: 22 }, { width: 28 }];
  const rHeader = ratesSheet.addRow(['MATERIAL', 'UNIT', 'RATE', 'SUPPLIER', 'REMARKS']);
  styleHeaderRow(rHeader);
  materials.forEach((m, idx) => {
    const row = ratesSheet.addRow([m.name, m.unit, m.defaultRate, m.supplier || '', m.remarks || '']);
    if (idx % 2 === 0) row.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT } }; });
    row.getCell(3).numFmt = currencyFmt(project.info.currency);
  });

  // ---- Grand Summary ----
  const grand = wb.addWorksheet('Grand Summary', { pageSetup: { orientation: 'landscape' } });
  grand.columns = [{ width: 36 }, { width: 20 }];
  grand.mergeCells('A1:B1');
  grand.getCell('A1').value = `${project.info.projectName} — Grand Summary`;
  styleTitleRow(grand.getRow(1));
  const gHeader = grand.addRow(['ELEMENT', 'AMOUNT']);
  styleHeaderRow(gHeader);
  project.worksheets.forEach((ws, idx) => {
    const row = grand.addRow([ws.title, worksheetTotal(ws)]);
    if (idx % 2 === 0) row.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT } }; });
    row.getCell(2).numFmt = currencyFmt(project.info.currency);
  });
  const gt = projectGrandTotal(project.worksheets);
  const adj = applySettingsToGrandTotal(gt, settings);
  const summaryLines: [string, number][] = [
    ['Subtotal (Elements)', gt],
    [`Waste Factor (${settings.wasteFactorPercent}%)`, adj.waste],
    [`Labour Factor (${settings.labourFactorPercent}%)`, adj.labour],
    [`Markup (${settings.markupPercent}%)`, adj.markup],
    ['Subtotal', adj.subtotal],
    [`Tax (${settings.taxPercent}%)`, adj.tax],
    ['GRAND TOTAL', adj.finalTotal]
  ];
  for (const [label, value] of summaryLines) {
    const row = grand.addRow([label, value]);
    row.font = { bold: label === 'GRAND TOTAL' };
    row.getCell(2).numFmt = currencyFmt(project.info.currency);
    if (label === 'GRAND TOTAL') {
      row.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMBER } }; });
    }
  }
  grand.headerFooter.oddFooter = `&L${project.info.projectName}&CPrepared By: ${project.info.preparedBy} | ${project.info.date}&RPage &P of &N`;

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${project.info.projectName.replace(/[^a-z0-9]+/gi, '_')}_Material_Schedule.xlsx`);
}
