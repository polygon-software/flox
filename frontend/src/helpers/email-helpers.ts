import {SESClient, SendEmailCommand, SendEmailCommandOutput} from '@aws-sdk/client-ses';

// Set the AWS Region.
const REGION = 'eu-central-1';

// TODO
const CREDENTIALS = {
  accessKeyId: '***REMOVED***',
  secretAccessKey: 'ZHhTQgfGUFT6uPk8wwi//L7AiuN9ETliaLhFRsEH',
  // sessionToken: 'TODOASDF'
}

// Create SES service object
const sesClient: SESClient = new SESClient({
  region: REGION,
  credentials: CREDENTIALS
});

/**
 * This file contains a collection of helper functions for sending e-mails, using AWS Simple Email Service (SES)
 */

/**
 *
 * @param {string} from
 * @param {string[]} to - list of recipient's email addresses TODO NOTE: in sandbox mode, you can only send to verified adresses!
 * @param {string} subject
 * @param {string} body - HTML body
 * @param {string[]} [replyTo]
 * @param {string[]} [toCC]
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
