function exportToExcel(items) {
  const ws_data = [
    ["ID", "Название", "Значение"],
    ...items.map(item => [item.id, item.name, item.value])
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Данные");

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], {type:"application/octet-stream"}), "report.xlsx");
}

async function exportToWord(items) {
  const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } = docx;

  const tableRows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("ID")] }),
        new TableCell({ children: [new Paragraph("Название")] }),
        new TableCell({ children: [new Paragraph("Значение")] }),
      ],
    }),
    ...items.map(item => new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(item.id.toString())] }),
        new TableCell({ children: [new Paragraph(item.name)] }),
        new TableCell({ children: [new Paragraph(item.value.toString())] }),
      ],
    }))
  ];

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ text: "Отчет по метрологическим данным", heading: "Heading1" }),
        new Table({
          rows: tableRows
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "report.docx");
}

document.getElementById('exportExcelBtn').addEventListener('click', () => {
  exportToExcel(currentItems);
});

document.getElementById('exportWordBtn').addEventListener('click', () => {
  exportToWord(currentItems);
});
