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

  const renderCellValue = (value, column) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted-foreground">-</span>;
    }

    if (typeof value === 'string') {
      const date = parseISO(value);
      if (isValid(date)) {
        return format(date, 'MMM dd, yyyy');
      }
    }

    if (
      typeof value === 'number' &&
      value >= 0 &&
      value <= 5 &&
      column.key.toLowerCase().includes('rating')
    ) {
      return (
        <div className="flex items-center">
          {Array.from({ length: value }).map((_, index) => (
            <svg
              key={index}
              className={`h-4 w-4 ${index < value ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.175 0l-3.39 2.462c-.784.57-1.838-.197-1.539-1.118l1.286-3.974a1 1 0 00-.364-1.118L2.034 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
            </svg>
          ))}
        </div>
      );
    }

    if (typeof value === 'object' && value?.type === 'badge') {
      return <Badge variant={value.variant || 'default'}>{value.text}</Badge>;
    }

    return value;
  };

  const handleExportPDF = () => {
    // ✅ Validation: Prevent export if name is empty
    if (!preparedBy || preparedBy.trim() === '') {
      alert('Please enter your name in "Prepared By" before exporting.');
      return;
    }

    const doc = new jsPDF();

    // Add Logo
    const imgData = logo; // Replace with your logo base64 or path
    doc.addImage(imgData, 'PNG', 14, 1, 35, 35); // x, y, width, height

    // Title
    doc.setFontSize(16);
    doc.text(reportTitle, 60, 20);

    // Date Range
    doc.setFontSize(10);
    const from = dateFrom ? `${format(dateFrom, 'MMM dd, yyyy')}` : '';
    const to = dateTo ? `${format(dateTo, 'MMM dd, yyyy')}` : '';
    if (from || to) {
      const dateRangeText = [from, to].filter(Boolean).join(' - ');
      doc.text(`Date Range: ${dateRangeText}`, 14, 35);
    }

    // Prepared By
    doc.text(`Prepared By: ${preparedBy}`, 14, 42);

    // Table headers + rows
    const headers = columns.map((col) => col.label);
    const rows = sortedData.map((row) =>
      columns.map((col) => {
        const value = row[col.key];
        if (value === null || value === undefined || value === '') return '-';

        if (typeof value === 'string') {
          const date = parseISO(value);
          if (isValid(date)) {
            return format(date, 'MMM dd, yyyy');
          }
        }

        if (typeof value === 'object' && value?.text) {
          return value.text;
        }

        if (typeof value === 'string' && value.includes('₱')) {
          return value.replace('₱', 'PHP ');
        }

        return String(value || '');
      })
    );

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 50,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [71, 85, 105] },
    });

    // Save PDF
    doc.save(
      `${reportTitle.replace(/\s+/g, '_').toLowerCase()}_${new Date()
        .toISOString()
        .split('T')[0]}.pdf`
    );

    if (onExportPDF) {
      onExportPDF(reportTitle, columns, sortedData, preparedBy);
    }
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
        <Button
          onClick={handleExportPDF}
          variant="outline"
        >
          <Download className="h-4 w-4 mr-2" />
          Export to PDF
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead key={column.key} className="font-semibold">
                  {column.sortable !== false ? (
                    <button
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                      onClick={() => handleSort(column.key)}
                    >
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
                <TableRow key={idx} className="hover:bg-muted/50 transition-colors">
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



