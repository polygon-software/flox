import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { createTransport } from 'nodemailer';
import { AttachmentFile } from './AttachmentFile';
import { ENV, extractStringEnvVar } from "../../../../env";

export type Credentials = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
};

/**
 * Sends an e-mail, optionally with attachment(s) using SES and Nodemailer
 * @param {Record<string, string>} credentials - SES credentials object
 * @param {string} from - the sender's e-mail address
 * @param {string|string[]} to - list of recipient's e-mail addresses
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
