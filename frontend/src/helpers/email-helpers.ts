import {SESClient, SendEmailCommand, SendEmailCommandOutput} from '@aws-sdk/client-ses';

// Credentials
const credentials = {
  accessKeyId: process.env.VUE_APP_AWS_KEY_ID ??  '',
  secretAccessKey: process.env.VUE_APP_AWS_SECRET_KEY ?? ''
}

// Create SES service object
const sesClient: SESClient = new SESClient({
  region: process.env.VUE_APP_AWS_REGION,
  credentials: credentials,
});

/**
 * This file contains a collection of helper functions for sending e-mails, using AWS Simple Email Service (SES)
 */

/**
 * Sends an e-mail using AWS SES, using the given parameters
 * @param {string} from - the sender's e-mail address TODO NOTE: in sandbox mode, you can only send from verified addresses!
 * @param {string[]} to - list of recipient's email addresses TODO NOTE: in sandbox mode, you can only send to verified addresses!
 * @param {string} subject - E-mail subject
 * @param {string} body - E-mail's HTML body
 * @param {string[]} [replyTo] - list of e-mail addresses to reply to (if not specified, 'from' is also the reply address)
 * @param {string[]} [toCC] - list of CC recipient's email addresses
 * @param {string} [textBody] - optional plaintext body
 */
async function sendEmail(from: string, to: string[], subject: string, body: string, replyTo?: string[], toCC?: string[], textBody?: string): Promise<void|SendEmailCommandOutput>{
  // E-Mail parameters
  const params = {
    Destination: {
      CcAddresses: toCC ?? [],
      ToAddresses: to
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
    ReplyToAddresses: replyTo ?? []
  };

  // Send actual e-mail
  return await sesClient.send(new SendEmailCommand(params));
}

export {sendEmail}
