/**
 * ViewFlow Export Utilities: Clean CSV & PDF Generation
 * Zero external heavy dependencies, works seamlessly in modern browsers.
 */

interface ColumnDefinition<T> {
  header: string;
  accessor: (item: T) => string | number | undefined | null;
}

/**
 * Generates and downloads a clean RFC 4180 compliant CSV file
 */
export function exportToCSV<T>(
  filename: string,
  columns: ColumnDefinition<T>[],
  data: T[]
): void {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
  };

  const headersRow = columns.map(c => escapeCSV(c.header)).join(',');
  const dataRows = data.map(item =>
    columns.map(c => escapeCSV(c.accessor(item))).join(',')
  );

  const csvContent = '\uFEFF' + [headersRow, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\.csv$/i, '')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates an executive-styled, printable PDF report view
 */
export function exportToPDFReport<T>(
  title: string,
  agencyName: string,
  columns: ColumnDefinition<T>[],
  data: T[]
): void {
  if (!data || data.length === 0) {
    alert('No records available for PDF report.');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate the printable report.');
    return;
  }

  const tableHeaders = columns.map(c => `<th style="padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; border-bottom: 2px solid #cbd5e1; background: #f8fafc;">${c.header}</th>`).join('');

  const tableRows = data.map((item, idx) => {
    const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    const cells = columns.map(c => {
      const val = c.accessor(item) ?? '—';
      return `<td style="padding: 10px 14px; font-size: 12px; color: #1e293b; border-bottom: 1px solid #e2e8f0;">${val}</td>`;
    }).join('');
    return `<tr style="background: ${bg};">${cells}</tr>`;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - ${agencyName}</title>
        <style>
          @page { size: landscape; margin: 16mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 24px;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-bottom: 16px;
            border-bottom: 2px solid #2563eb;
            margin-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            margin: 0;
          }
          .agency {
            font-size: 14px;
            font-weight: 600;
            color: #2563eb;
            margin-top: 4px;
          }
          .meta {
            text-align: right;
            font-size: 11px;
            color: #64748b;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .footer {
            margin-top: 24px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            font-size: 10px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 16px; padding: 12px 16px; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 13px; color: #1e40af; font-weight: 600;">Report generated successfully. Use your browser's Print dialog to Save as PDF.</span>
          <button onclick="window.print()" style="background: #2563eb; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer;">
            Print / Save as PDF
          </button>
        </div>

        <div class="header">
          <div>
            <h1 class="title">${title}</h1>
            <div class="agency">${agencyName}</div>
          </div>
          <div class="meta">
            <div>Generated: ${new Date().toLocaleString()}</div>
            <div>Total Records: ${data.length}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          <span>ViewFlow Real Estate CRM Platform • Confidential Internal Report</span>
          <span>Page 1 of 1</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
