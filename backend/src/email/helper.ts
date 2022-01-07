import {
  SESClient,
  SES,
  SendEmailCommand,
  SendEmailCommandOutput,
  SendRawEmailCommand,
} from '@aws-sdk/client-ses';
import * as nodemailer from 'nodemailer';
import { AttachmentFile } from './AttachmentFile';

/**
 * Sends an e-mail using AWS SES, using the given parameters
 * @param {string} from - the sender's e-mail address TODO NOTE: in sandbox mode, you can only send from verified addresses!
 * @param {string|string[]} to - list of recipient's email addresses TODO NOTE: in sandbox mode, you can only send to verified addresses!
 * @param {string} subject - E-mail subject
 * @param {string} body - E-mail's HTML body
 * @param {string[]} [replyTo] - list of e-mail addresses to reply to (if not specified, 'from' is also the reply address)
 * @param {string[]} [toCC] - list of CC recipient's email addresses
 * @param {string} [textBody] - optional plaintext body
 * @returns {Promise<void | SendEmailCommandOutput>} - the output from the send email
 */
export async function sendEmail(
  from: string,
  to: string | string[],
  subject: string,
  body: string,
  replyTo?: string[],
  toCC?: string[],
  textBody?: string,
): Promise<void | SendEmailCommandOutput> {
  // Credentials
  const credentials = {
    accessKeyId: process.env.AWS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_KEY ?? '',
  };

  // Create SES service object
  const sesClient = new SESClient({
    region: process.env.SES_REGION,
    credentials: credentials,
  });
  // E-Mail parameters
  const params = {
    Destination: {
      CcAddresses: toCC ?? [],
      ToAddresses: Array.isArray(to) ? to : [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body,
        },
        Text: {
          Charset: 'UTF-8',
          Data: textBody ?? body,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: from,
    ReplyToAddresses: replyTo ?? [],
  };
  // Send actual e-mail
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  return sesClient.send(new SendEmailCommand(params));
}

/**
 * Sends an e-mail with attachment(s) using nodemailer
 * @param {string} from - the sender's e-mail address TODO NOTE: in sandbox mode, you can only send from verified addresses!
 * @param {string|string[]} to - list of recipient's email addresses TODO NOTE: in sandbox mode, you can only send to verified addresses!
 * @param {string} subject - E-mail subject
 * @param {string} body - E-mail's HTML body
 * @param {string[]} [replyTo] - list of e-mail addresses to reply to (if not specified, 'from' is also the reply address)
 * @param {string[]} [toCC] - list of CC recipient's email addresses
 * @param {AttachmentFile[]} attachments - file attachments
 * @returns {Promise<void | SendEmailCommandOutput>} - the output from the send email
 * @returns {Promise<void>} - done
 */
export async function sendDocumentEmail(
  from: string,
  to: string | string[],
  subject: string,
  body: string,
  replyTo?: string[],
  toCC?: string[],
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

  return new Promise((resolve, reject) => {
    transporter.sendMail(emailParams, (error, info) => {
      if (error) {
        console.error(error);
        return reject(error);
      }
      console.log('transporter.sendMail result', info);
      resolve(info);
    });
  });
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
