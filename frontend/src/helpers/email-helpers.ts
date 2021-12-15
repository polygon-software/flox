import {SESClient, SendEmailCommand, SendEmailCommandOutput} from '@aws-sdk/client-ses';
import {generatePasswordChangeLink} from 'src/helpers/generator-helpers';
import ROUTES from 'src/router/routes';

// Credentials
const credentials = {
  accessKeyId: process.env.VUE_APP_AWS_KEY_ID ??  '',
  secretAccessKey: process.env.VUE_APP_AWS_SECRET_KEY ?? ''
}

// Create SES service object (seems to be unrecognized by eslint)
// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
const sesClient = new SESClient({
  region: process.env.VUE_APP_SES_REGION,
  credentials: credentials,
});

/**
 * This file contains a collection of helper functions for sending e-mails, using AWS Simple Email Service (SES)
 */

/**
 * Sends an e-mail using AWS SES, using the given parameters
 * @param {string} from - the sender's e-mail address TODO NOTE: in sandbox mode, you can only send from verified addresses!
 * @param {string|string[]} to - list of recipient's email addresses TODO NOTE: in sandbox mode, you can only send to verified addresses!
 * @param {string} subject - E-mail subject
 * @param {string} body - E-mail's HTML body
 * @param {string[]} [replyTo] - list of e-mail addresses to reply to (if not specified, 'from' is also the reply address)
 * @param {string[]} [toCC] - list of CC recipient's email addresses
 * @returns {void}
 */
export async function sendEmail(
  from: string,
  to: string |string[],
  subject: string,
  body: string,
  replyTo?: string[],
  toCC?: string[],
): Promise<void|SendEmailCommandOutput>{
  // E-Mail parameters
  const params = {
    Destination: {
      CcAddresses: toCC ?? [],
      ToAddresses: Array.isArray(to) ? to : [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body,
        },
        Text: {
          Charset: 'UTF-8',
          Data: body
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  return await sesClient.send(new SendEmailCommand(params)) ;
}


/**
 * Sends an initial login e-mail to the given user, containing a one-time password change link
 * @param {string} email - the user's e-mail address
 * @param {string} password - the user's (generated) password
 * @param {string} type - the users type - 'emp' for employee or 'man' for company
 * @async
 * @returns {void}
 */
export async function sendPasswordChangeEmail(email: string, password: string, type: string): Promise<void>{
  // Generate one-time password change link
  const link: string = generatePasswordChangeLink(email, password, type)

  const sender = process.env.VUE_APP_EMAIL_SENDER ??  ''

  // Send login email
  await sendEmail(
    sender,
    email,
    'Your Account',
    `Click the following link: ${link}`
  )
}

/**
 * Sends an e-mail for document upload
 * @param {string} email - e-mail address
 * @param {string} companyId - company UUID
 * @async
 * @returns {void}
 */
export async function sendDocumentUploadEmail(email: string, companyId: string): Promise<void>{
  // Set up e-mail parameters
  const encodedUuid = btoa(companyId); // Base64 encode UUID
  const baseUrl = process.env.VUE_APP_BASE_URL ??  ''
  const url = `${baseUrl}${ROUTES.DOCUMENT_UPLOAD.path}?cid=${encodedUuid}`
  const sender = process.env.VUE_APP_EMAIL_SENDER ??  ''

  // Send e-mail
  await sendEmail(
    sender,
    email,
    'Your account',
    `Upload your documents at the following link: ${url}`
  )
}
