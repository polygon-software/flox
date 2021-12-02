import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandOutput,
} from '@aws-sdk/client-ses';
import ROUTES from '../../../../frontend/src/router/routes';

/**
 * Sends an e-email using AWS SES, using the given parameters
 * @param {string} from - the sender's e-email address TODO NOTE: in sandbox mode, you can only send from verified addresses!
 * @param {string|string[]} to - list of recipient's email addresses TODO NOTE: in sandbox mode, you can only send to verified addresses!
 * @param {string} subject - E-email subject
 * @param {string} body - E-email's HTML body
 * @param {string[]} [replyTo] - list of e-email addresses to reply to (if not specified, 'from' is also the reply address)
 * @param {string[]} [toCC] - list of CC recipient's email addresses
 * @param {string} [textBody] - optional plaintext body
 * @param sesClient
 */
export async function sendEmail(
  from: string,
  to: string | string[],
  subject: string,
  body: string,
  sesClient: SESClient,
  replyTo?: string[],
  toCC?: string[],
  textBody?: string,
): Promise<void | SendEmailCommandOutput> {
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

  // Send actual e-email
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  return await sesClient.send(new SendEmailCommand(params));
}

/**
 * Sends an initial login e-email to the given user, containing a one-time password change link
 * @param {string} email - the user's e-email address
 * @param {string} password - the user's (generated) password
 * @param {string} type - the users type - 'emp' for employee or 'man' for company
 * @param {string} baseURL
 * @param {SESClient} sesClient
 */
export async function sendPasswordChangeEmail(
  email: string,
  password: string,
  type: string,
  baseURL: string,
  sesClient: SESClient,
): Promise<void> {
  // Generate one-time password change link
  const link: string = generatePasswordChangeLink(
    email,
    password,
    type,
    baseURL,
  );

  const sender = process.env.VUE_APP_EMAIL_SENDER ?? '';

  // Send login email
  await sendEmail(
    sender,
    email,
    'Your Account',
    `Click the following link: ${link}`,
    sesClient,
  );
}

/**
 * Generates a password change link containing base64-encoded e-email and password for a given user
 * @param {string} email - user's e-email address
 * @param {string} password - user's password
 * @param {string} type - user's type
 * @param {string} baseUrl - from env file
 */
export function generatePasswordChangeLink(
  email: string,
  password: string,
  type: string,
  baseUrl: string,
): string {
  // Encode base64
  const hiddenEmail = btoa(email);
  const hiddenPw = btoa(password);
  return `${baseUrl}${ROUTES.SET_PASSWORD.path}?u=${hiddenEmail}&k=${hiddenPw}&t=${type}`;
}
