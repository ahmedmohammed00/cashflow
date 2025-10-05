import ExcelJS from 'exceljs';
import moment from 'moment';

/**
 * Generate an Excel file from data
 * @param {Object} options - Configuration options
 * @param {string} options.title - Report title
 * @param {Array} options.headers - Column headers
 * @param {Array} options.data - Data rows
 * @param {Array} options.columns - Column definitions with keys matching data properties
 * @param {Object} options.styling - Optional styling configuration
 * @returns {Buffer} Excel file as buffer
 */
export const generateExcelReport = async (options) => {
  const { title, headers, data, columns, styling = {} } = options;
  
  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title);
  
  // Add title
  worksheet.mergeCells('A1:' + String.fromCharCode(64 + headers.length) + '1');
  const titleRow = worksheet.getCell('A1');
  titleRow.value = title;
  titleRow.font = { size: 16, bold: true };
  titleRow.alignment = { horizontal: 'center' };
  
  // Add date
  worksheet.mergeCells('A2:' + String.fromCharCode(64 + headers.length) + '2');
  const dateRow = worksheet.getCell('A2');
  dateRow.value = `Generated on: ${moment().format('YYYY-MM-DD HH:mm:ss')}`;
  dateRow.font = { size: 12, italic: true };
  dateRow.alignment = { horizontal: 'center' };
  
  // Add headers
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
  
  // Add data rows
  data.forEach(item => {
    const rowData = columns.map(column => {
      // Handle nested properties using dot notation (e.g., 'user.name')
      if (column.key.includes('.')) {
        const props = column.key.split('.');
        let value = item;
        for (const prop of props) {
          value = value?.[prop];
        }
        return formatCellValue(value, column.type);
      }
      
      return formatCellValue(item[column.key], column.type);
    });
    
    worksheet.addRow(rowData);
  });
  
  // Apply styling to data cells
  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex > 3) { // Skip title, date and header rows
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }
  });
  
  // Auto-size columns
  worksheet.columns.forEach(column => {
    column.width = 15;
  });
  
  // Apply custom styling if provided
  if (styling.columnWidths) {
    styling.columnWidths.forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });
  }
  
  // Generate buffer
  return await workbook.xlsx.writeBuffer();
};

/**
 * Format cell value based on type
 * @param {any} value - The cell value
 * @param {string} type - The data type (date, currency, number, etc.)
 * @returns {any} Formatted value
 */

const formatCellValue = (value, type) => {
  if (value === undefined || value === null) return '';
  
  switch (type) {
    case 'date':
      return value ? moment(value).format('YYYY-MM-DD') : '';
    case 'datetime':
      return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '';
    case 'currency':
      return Number(value);
    case 'number':
      return Number(value);
    case 'boolean':
      return value ? 'Yes' : 'No';
    default:
      return value;
  }
};

/**
 * Create a dynamic report based on filters and configuration
 * @param {Object} options - Report options
 * @param {string} options.reportType - Type of report
 * @param {Object} options.filters - Query filters
 * @param {Array} options.data - Data to include in report
 * @param {Object} options.config - Report configuration
 * @returns {Buffer} Excel file as buffer
 */
export const createDynamicReport = async (options) => {
  const { reportType, filters, data, config } = options;
  
  // Set up report configuration based on type
  const reportConfig = {
    title: config.title || `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
    headers: config.headers,
    columns: config.columns,
    data: data,
    styling: config.styling || {}
  };
  
  // Add filter information to report
  if (filters && Object.keys(filters).length > 0) {
    reportConfig.filters = filters;
  }
  
  return await generateExcelReport(reportConfig);
};

export default {
  generateExcelReport,
  createDynamicReport
};