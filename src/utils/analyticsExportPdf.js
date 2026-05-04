import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import logo from '@/assets/logo.png';

// ------------------- COMPANY CONSTANTS -------------------
const COMPANY_NAME = "Tierodman Auto Center";
const COMPANY_CONTACT = "0917-849-6894";
const COMPANY_ADDRESS = "246 P. Ocampo Ext., cor. Sampoloc St., San Antonio Makati City";

/**
 * Export Services Analytics to PDF with text-based format
 * @param {Array} chartData - The chart data from the API
 * @param {Object} dateRange - { from, to } date range object
 * @param {string} preparedBy - The name/info of who prepared the report
 * @param {Array} serviceNames - Array of service names
 * @param {string} activeChart - Currently active chart view ('combined' or specific service name)
 * @param {Object} insights - AI insights data { insights: string, summary: { totalCompleted, averageRating, topService } }
 */
export const exportAnalyticsToPDF = ({
  chartData,
  dateRange,
  preparedBy,
  serviceNames,
  activeChart,
  insights = null,
}) => {
  if (!preparedBy || preparedBy.trim() === '') {
    alert('Please enter your name in "Prepared By" before exporting.');
    return;
  }

  const doc = new jsPDF();
  const exportedAt = format(new Date(), 'MMM dd, yyyy • hh:mm a');
  const totalPagesExp = "{total_pages_count_string}";

  let startY = 65;

  // =============== PAGE 1: HEADER + INSIGHTS SECTION ===============
  // Add header and insights on the first page
  let tableData = [];

  if (!chartData || chartData.length === 0) {
    tableData = [['No data available', '-']];
  } else {
    // Calculate service totals
    const serviceTotals = {};
    const serviceNames_filtered = serviceNames.filter(name => name !== 'combined');

    // totals for each service
    serviceNames_filtered.forEach(service => {
      serviceTotals[service] = 0;
    });

    // Sum up the counts for each service
    chartData.forEach(item => {
      serviceNames_filtered.forEach(service => {
        if (item[service]) {
          serviceTotals[service] += item[service];
        }
      });
    });

    // Determine what data to show based on active chart
    if (activeChart === 'combined') {
      // Show all services with their totals
      tableData = serviceNames_filtered.map(service => [
        service.charAt(0).toUpperCase() + service.slice(1), // Capitalize service name
        String(serviceTotals[service] || 0),
      ]);
    } else {
      // Show period-by-period breakdown for the active service
      tableData = chartData.map(item => [
        format(new Date(item.date), 'MMM dd, yyyy'),
        String(item[activeChart] || 0),
      ]);
    }
  }

  // =============== ADD AI INSIGHTS SECTION (IF AVAILABLE) ===============
  if (insights?.data?.insights) {
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('AI Insights & Recommendations', 14, startY);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    startY += 6;

    // Add insights text with text wrapping
    const insightsText = insights.data.insights;
    const insightLines = doc.splitTextToSize(insightsText, 180);
    doc.text(insightLines, 14, startY);
    startY += insightLines.length * 4 + 5;

    // Add summary stats if available
    if (insights.data.summary) {
      const summary = insights.data.summary;
      doc.setFont(undefined, 'bold');
      doc.setFontSize(9);
      doc.text('Summary Statistics:', 14, startY);
      startY += 4;

      doc.setFont(undefined, 'normal');
      const summaryLines = [];
      summaryLines.push(`Total Completed: ${summary.totalCompleted || 0}`);
      summaryLines.push(`Average Rating: ${summary.averageRating || 'N/A'} ⭐`);
      if (summary.topService) {
        summaryLines.push(`Top Service: ${summary.topService._id || 'N/A'}`);
      }

      summaryLines.forEach((line) => {
        doc.text(line, 14, startY);
        startY += 4;
      });
      
      startY += 3;
    }
  }

  // ------------------- GENERATE PDF STRUCTURE -------------------
  autoTable(doc, {
    head: [['Period / Service', activeChart === 'combined' ? 'Total Count' : 'Count']],
    body: tableData,
    startY: startY,
    margin: { top: 65 },
    styles: { fontSize: 9 },
    headStyles: { fillColor: [71, 85, 105] },
    showHead: 'everyPage',

    // ------------------- HEADER + FOOTER EVERY PAGE -------------------
    didDrawPage: function (data) {
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height || pageSize.getHeight();
      const pageWidth = pageSize.width || pageSize.getWidth();
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;

      // ---------- HEADER ----------
      doc.addImage(logo, 'PNG', 14, 5, 25, 25);

      doc.setFontSize(14);
      doc.text('Services Analytics Report', 45, 15);

      doc.setFontSize(9);
      doc.text(COMPANY_NAME, 45, 22);
      doc.text(`Contact: ${COMPANY_CONTACT}`, 45, 27);
      doc.text(`Address: ${COMPANY_ADDRESS}`, 45, 32);

      // Date range info
      const from = dateRange?.from ? format(dateRange.from, 'MMM dd, yyyy') : '';
      const to = dateRange?.to ? format(dateRange.to, 'MMM dd, yyyy') : 'Present';
      if (from) {
        doc.text(`Date: ${from} - ${to}`, 14, 40);
      }

      // Active chart view info
      doc.setFont(undefined, 'bold');
      doc.text('View:', 14, 47);
      doc.setFont(undefined, 'normal');
      const viewLabel = activeChart === 'combined' 
        ? 'All Services Combined' 
        : `${activeChart.charAt(0).toUpperCase() + activeChart.slice(1)} Service`;
      doc.text(viewLabel, 40, 47);

      // Prepared by
      doc.setFont(undefined, 'bold');
      doc.text('Prepared By:', 14, 53);
      doc.setFont(undefined, 'normal');
      doc.text(preparedBy || '-', 40, 53);

      doc.text(`Exported: ${exportedAt}`, 14, 59);

      // ---------- FOOTER ----------
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');

      const pWidth = doc.internal.pageSize.width;
      const pHeight = doc.internal.pageSize.height;
      const sideMargin = 20;
      const bottomMargin = 12;

      // LEFT: Company Name
      doc.text(COMPANY_NAME, sideMargin, pHeight - bottomMargin);

      // RIGHT: Page Number
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

  // Save the PDF
  doc.save(`services_analytics_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
