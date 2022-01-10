import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {i18n} from 'boot/i18n';


/**
 * This file contains all helper functions related to generating PDFs
 */

/**
 * Generates
 * @param {string} elementId - the HTML ID of the element to be exported
 * @param {boolean} [download] - whether to download the file automatically (defaults to false)
 * @returns {Promise<File>} - the PDF, as a file
 */
export async function generatePdf(elementId: string, download = false): Promise<File>{
  const element = document.getElementById(elementId)

  if(!element){
    throw new Error(i18n.global.t('errors.pdf_generation_error'))
  }

  const canvas = await html2canvas(
    element,
    {
      // dpi: 600, // Set to 300 DPI
      scale: 1, // Adjusts your resolution
    }
  )

  // Generate image from canvas
  const imgData = canvas.toDataURL('image/png');

  // PDF setup
  const doc = new jsPDF('p', 'mm');

  // Add to pdf
  doc.addImage(imgData, 'PNG', 0, 0, 1000, 2000);


  if(download){
    doc.save('sample-file.pdf');
  }

  // Create blob & return as file
  const blob = doc.output('blob')
  return new File([blob], 'name')
}
