import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses';
import * as nodemailer from 'nodemailer';
import { AttachmentFile } from './AttachmentFile';
import PrivateFile from '../modules/file/entities/private_file.entity';
import axios from 'axios';

/**
 * Sends an e-mail with attachment(s) using Nodemailer
 * @param {string} from - the sender's e-mail address TODO NOTE: in sandbox mode, you can only send from verified addresses!
 * @param {string|string[]} to - list of recipient's email addresses TODO NOTE: in sandbox mode, you can only send to verified addresses!
 * @param {string} subject - E-mail subject
 * @param {string} body - E-mail's HTML body
 * @param {AttachmentFile[]} attachments - file attachments
 * @returns {Promise<void>} - done
 */
export async function sendEmail(
  from: string,
  to: string | string[],
  subject: string,
  body: string,
  attachments?: AttachmentFile[],
): Promise<void> {
  // Credentials
  const credentials = {
    accessKeyId: process.env.AWS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_KEY ?? '',
  };

  // Create SES service object
  const sesClient = new SES({
    region: process.env.SES_REGION,
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

/**
 * Sends an initial login e-mail to the given user, containing a one-time password change link
 * @param {string} email - the user's e-mail address
 * @param {string} password - the user's (generated) password
 * @param {string} type - the users type - 'emp' for employee or 'man' for company
 * @returns {Promise<void>} - void promise
 */
export async function sendPasswordChangeEmail(
  email: string,
  password: string,
  type: string,
): Promise<void> {
  // Generate one-time password change link
  const link: string = generatePasswordChangeLink(
    email,
    password,
    type,
    process.env.BASE_URL,
  );

  const sender = process.env.EMAIL_SENDER ?? '';

  // Send login email
  await sendEmail(
    sender,
    email,
    'Your Account',
    `Click the following link: ${link}`,
  );
}

/**
 * Generates a password change link containing base64-encoded e-mail and password for a given user
 * @param {string} email - user's e-mail address
 * @param {string} password - user's password
 * @param {string} type - user's type
 * @param {string} baseUrl - from env file
 * @returns {string} - a password change link
 */
export function generatePasswordChangeLink(
  email: string,
  password: string,
  type: string,
  baseUrl: string,
): string {
  // Encode base64
  const hiddenEmail = Buffer.from(email).toString('base64');
  const hiddenPw = Buffer.from(password).toString('base64');
  return `${baseUrl}/set-password?u=${hiddenEmail}&k=${hiddenPw}&t=${type}`;
}

/**
 * Send rejection email to rejected company
 * @param {string} email - email
 * @returns {Promise<void>} - email sent
 */
export async function sendCompanyRejectEmail(email: string): Promise<void> {
  const sender = process.env.EMAIL_SENDER ?? '';

  await sendEmail(sender, email, 'Rejected', 'Application is rejected');
}

/**
 * Send dossier document email
 * @param {string} readableId - readable dossier ID
 * @param {string[]} recipients - recipients' e-mail addresses
 * @param {PrivateFile} pdfFile - PDF attachment file; must already contain URL
 * @returns {Promise<void>} - email sent
 */
export async function sendDossierDocumentEmail(
  readableId: string,
  recipients: string[],
  pdfFile: PrivateFile,
): Promise<void> {
  const url = pdfFile.url;

  if (!url) {
    throw new Error('PDF file must contain a URL');
  }

  const sender = process.env.EMAIL_SENDER ?? '';

  // TODO proper text, multilanguage support?
  const subject = `S.O.I Dossier ${readableId}`;
  const body = 'Please see attached file';
  // Download attachment file from given link
  const fileGet = await axios.get(url, {
    responseType: 'arraybuffer',
  });
  if (!fileGet || !fileGet.data) {
    throw new Error(`Could not download File from ${url}`);
  }

  // Get File as buffer
  const arrayBuffer = fileGet.data;
  const fileBuffer = Buffer.from(arrayBuffer);

  // Build AttachmentFile
  const attachmentFile = {
    filename: `Dossier_${readableId}`,
    content: fileBuffer,
    contentType: 'application/pdf',
  };

  // Send actual e-mail
  await sendEmail(sender, recipients, subject, body, [attachmentFile]);
}

/**
 * Sends an e-mail for document upload
 * @param {string} email - e-mail address
 * @param {string} companyId - company UUID
 * @returns {Promise<void>} - done
 */
export async function sendDocumentUploadEmail(
  email: string,
  companyId: string,
): Promise<void> {
  // Set up e-mail parameters
  const encodedUuid = btoa(companyId); // Base64 encode UUID
  const baseUrl = process.env.BASE_URL ?? '';
  const url = `${baseUrl}$/document-upload?cid=${encodedUuid}`;
  const sender = process.env.VUE_APP_EMAIL_SENDER ?? '';

  // Send e-mail
  await sendEmail(
    sender,
    email,
    'Your account',
    `Upload your documents at the following link: ${url}`,
  );
}
