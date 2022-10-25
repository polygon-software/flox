import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { createTransport } from 'nodemailer';
import { AttachmentFile } from './AttachmentFile';
import { ENV, extractStringEnvVar } from '../../../../env';

export type Credentials = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
};

/**
 * Sends an e-mail, optionally with attachment(s) using SES and Nodemailer
 * @param credentials - SES credentials object
 * @param from - the sender's e-mail address
 * @param to - list of recipient's e-mail addresses
 * @param subject - E-mail subject
 * @param body - E-mail's HTML body
 * @param attachments - file attachments
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
    region: extractStringEnvVar(ENV.AWS_MAIN_REGION),
    credentials: credentials,
  });

  // Create Nodemailer SES transporter
  const transporter = createTransport({
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
  } catch (e: any) {
    throw new Error(`Error while sending e-mail: ${e.name}: ${e.message}`);
  }
}
