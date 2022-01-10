import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {i18n} from 'boot/i18n';

/**
 * This file contains all helper functions related to generating PDFs
 */

/**
 * Generates a PDF file from a given HTML element
 * @param {string} elementId - the HTML ID of the element to be exported
 * @param {string} filename - name to give to the resulting PDF file
 * @param {boolean} [download] - whether to download the file automatically (defaults to false)
 * @returns {Promise<File>} - the PDF, as a file
 */
export async function generatePdf(elementId: string, filename: string, download = false): Promise<File>{
  const element = document.getElementById(elementId)

  if(!element){
    throw new Error(i18n.global.t('errors.pdf_generation_error'))
  }

  const canvas = await html2canvas(element)

  // Generate image from canvas
  const imgData = canvas.toDataURL('image/png');

  // PDF setup
  const doc = new jsPDF('p', 'mm');

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Add to pdf
  doc.addImage(
    imgData,
    'PNG',
    0,
    0,
    width,
    height
  );

  // Download (if applicable)
  if(download){
    doc.save(filename);
  }

  // Create blob & return as file
  const blob = doc.output('blob')
  return new File([blob], `${filename}.pdf`)
}
