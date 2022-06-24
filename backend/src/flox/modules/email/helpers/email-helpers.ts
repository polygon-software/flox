import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses';
import * as nodemailer from 'nodemailer';
import { AttachmentFile } from './AttachmentFile';

export type Credentials = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
};

/**
 * Sends an e-mail, optionally with attachment(s) using SES and Nodemailer
 * @param {Record<string, string>} credentials - SES credentials object
 * @param {string} from - the sender's e-mail address
 * @param {string|string[]} to - list of recipient's email addresses
 * @param {string} subject - E-mail subject
 * @param {string} body - E-mail's HTML body
 * @param {AttachmentFile[]} attachments - file attachments
 * @returns {Promise<void>} - done
 */
export async function sendEmail(
  credentials: Credentials,
  from: string,
  to: string | string[],
  subject: string,
  body: string,
  attachments?: AttachmentFile[],
): Promise<void> {
  // Create SES service object
  const sesClient = new SES({
    region: process.env.AWS_REGION,
    credentials: credentials,
  });

  // Create Nodemailer SES transporter
  const transporter = nodemailer.createTransport({
    secure: true,
    requireTLS: true,
    secured: true,
    SES: {
      ses: sesClient,
      aws: { SendRawEmailCommand },
    },
  });

  const emailParams = {
    from,
    to,
    subject,
    html: body,
    attachments: attachments ?? [],
  };

  try {
    await transporter.sendMail(emailParams);
  } catch (e) {
    throw new Error(`Error while sending e-mail: ${e.name}: ${e.message}`);
  }
}

// /**
//  * Send dossier document email
//  * @param {string} readableId - readable dossier ID
//  * @param {string[]} recipients - recipients' e-mail addresses
//  * @param {PrivateFile} pdfFile - PDF attachment file; must already contain URL
//  * @returns {Promise<void>} - email sent
//  */
// export async function sendDossierDocumentEmail(
//   readableId: string,
//   recipients: string[],
//   pdfFile: PrivateFile,
// ): Promise<void> {
//   const url = pdfFile.url;
//
//   if (!url) {
//     throw new Error('PDF file must contain a URL');
//   }
//
//   const sender = process.env.EMAIL_SENDER ?? '';
//
//   // TODO proper text, multilanguage support?
//   const subject = `S.O.I Dossier ${readableId}`;
//   const body = 'Please see attached file';
//   // Download attachment file from given link
//   const fileGet = await axios.get(url, {
//     responseType: 'arraybuffer',
//   });
//   if (!fileGet || !fileGet.data) {
//     throw new Error(`Could not download File from ${url}`);
//   }
//
//   // Get File as buffer
//   const arrayBuffer = fileGet.data;
//   const fileBuffer = Buffer.from(arrayBuffer);
//
//   // Build AttachmentFile
//   const attachmentFile = {
//     filename: `Dossier_${readableId}`,
//     content: fileBuffer,
//     contentType: 'application/pdf',
//   };
//
//   // Send actual e-mail
//   await sendEmail(sender, recipients, subject, body, [attachmentFile]);
// }
