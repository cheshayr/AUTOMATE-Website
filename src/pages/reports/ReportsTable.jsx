import { useState } from 'react'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Search, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { isValid, parseISO, format } from 'date-fns';
import logo from '@/assets/logo.png';

// ------------------- COMPANY NAME -------------------
const COMPANY_NAME = "Tierodman Auto Center";
const COMPANY_CONTACT = "0917-849-6894"; 
const COMPANY_ADDRESS = "246 P. Ocampo  Ext,. cor. Sampaloc St., San Antonio Makati City"; // 🔥 change if needed

// ------------------- PESO FORMAT -------------------
const formatPeso = (amount) => {
  if (!amount) return 'PHP 0.00';

  if (typeof amount === 'string' && amount.startsWith('₱')) {
    return amount.replace('₱', 'PHP ');
  }

  return `PHP ${Number(amount).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const ReportsTable = ({
  columns,
  data,
  onExportPDF,
  reportTitle = 'Report',
  dateFrom,
  dateTo,
  preparedBy,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // ------------------- CELL RENDER -------------------
  const renderCellValue = (value, column) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted-foreground">-</span>;
    }

    if (typeof value === 'string') {
      const date = parseISO(value);
      if (isValid(date)) return format(date, 'MMM dd, yyyy');
    }

    if (
      typeof value === 'number' &&
      value >= 0 &&
      value <= 5 &&
      column.key.toLowerCase().includes('rating')
    ) {
      return (
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <svg key={index} className={`h-4 w-4 ${index < value ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.175 0l-3.39 2.462c-.784.57-1.838-.197-1.539-1.118l1.286-3.974a1 1 0 00-.364-1.118L2.034 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
            </svg>
          ))}
        </div>
      );
    }

    if (typeof value === 'object' && value?.type === 'badge') {
      return <Badge variant={value.variant || 'default'}>{value.text}</Badge>;
    }

    const pesoKeys = ['revenue', 'servicecost', 'totalrevenue', 'totalcost', 'price', 'amount'];
    if (typeof value === 'number' && pesoKeys.includes(column.key.toLowerCase().replace(/_/g, ''))) {
      return formatPeso(value);
    }

    if (typeof value === 'string' && value.includes('PHP')) {
      return value;
    }

    return value;
  };

  // ------------------- EXPORT PDF -------------------
  const handleExportPDF = () => {
    if (!preparedBy || preparedBy.trim() === '') {
      alert('Please enter your name in "Prepared By" before exporting.');
      return;
    }

    const doc = new jsPDF();
    const exportedAt = format(new Date(), 'MMM dd, yyyy • hh:mm a');

    const totalPagesExp = "{total_pages_count_string}";

    const headers = columns.map((col) => col.label);

    const rows = sortedData.map((row) =>
      columns.map((col) => {
        const value = row[col.key];
        if (!value) return '-';

        if (typeof value === 'string') {
          const date = parseISO(value);
          if (isValid(date)) return format(date, 'MMM dd, yyyy');
        }

        if (typeof value === 'object' && value?.text) return value.text;

        const pesoKeys = [
          'revenue',
          'servicecost',
          'service_cost',
          'servicecosts',
          'totalrevenue',
          'totalcost',
          'price',
          'amount'
        ];
        if (typeof value === 'number' && pesoKeys.includes(col.key.toLowerCase().replace(/_/g, ''))) return formatPeso(value);
        if (typeof value === 'string' && (value.includes('₱') || value.includes('PHP'))) {
          return value.replace('₱', 'PHP ');
        }

        return String(value);
      })
    );

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 65,
      margin: { top: 65 }, // ✅ THIS FIXES PAGE 2 OVERLAP
      styles: { fontSize: 9 },
      headStyles: { fillColor: [71, 85, 105] },
      showHead: 'everyPage', // optional but recommended

      // 🔥 HEADER + FOOTER EVERY PAGE
      didDrawPage: function (data) {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height || pageSize.getHeight();
        const pageWidth = pageSize.width || pageSize.getWidth();
        const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
        

      
       // ---------- HEADER ----------
        doc.addImage(logo, 'PNG', 14, 5, 25, 25);

        doc.setFontSize(14);
        doc.text(reportTitle, 45, 15);

        doc.setFontSize(9);
        doc.text(COMPANY_NAME, 45, 22);
        doc.text(`Contact: ${COMPANY_CONTACT}`, 45, 27);
        doc.text(`Address: ${COMPANY_ADDRESS}`, 45, 32);

        const from = dateFrom ? format(dateFrom, 'MMM dd, yyyy') : '';
        const to = dateTo ? format(dateTo, 'MMM dd, yyyy') : '';
        if (from || to) {
          doc.text(`Date: ${[from, to].filter(Boolean).join(' - ')}`, 14, 40);
        }

        doc.setFont(undefined, 'bold');
        doc.text('Prepared By:', 14, 47);

        doc.setFont(undefined, 'normal');
        doc.text(preparedBy || '-', 40, 47);

        doc.text(`Exported: ${exportedAt}`, 14, 53);
       
        // ---------- FOOTER ----------
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');

        // Get actual page width
        const pWidth = doc.internal.pageSize.width;
        const pHeight = doc.internal.pageSize.height;

        // 14 is the standard default margin for autoTable
        // If you want it even further to the right, try 10
        const sideMargin = 20; 
        const bottomMargin = 12;

        // LEFT: Company Name (starts at 14)
        doc.text(COMPANY_NAME, sideMargin, pHeight - bottomMargin);

        // RIGHT: Page Number
        // This formula: (Total Width - Margin) ensures it stays 'inside' the right edge
        const xRight = pWidth - sideMargin;

        doc.text(
          `Page ${pageNumber} of ${totalPagesExp}`, 
          xRight, 
          pHeight - bottomMargin, 
          { align: 'center' }
        );
      },
    });

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    doc.save(
      `${reportTitle.replace(/\s+/g, '_').toLowerCase()}_${format(new Date(), 'yyyy-MM-dd')}.pdf`
    );

    if (onExportPDF) onExportPDF(reportTitle, columns, sortedData, preparedBy);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleExportPDF} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export to PDF
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead key={column.key}>
                  {column.sortable !== false ? (
                    <button onClick={() => handleSort(column.key)} className="flex gap-2">
                      {column.label}
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {renderCellValue(row[column.key], column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};