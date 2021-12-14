import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandOutput,
} from '@aws-sdk/client-ses';

/**
 * Sends an e-mail using AWS SES, using the given parameters
 * @param {string} from - the sender's e-mail address TODO NOTE: in sandbox mode, you can only send from verified addresses!
 * @param {string|string[]} to - list of recipient's email addresses TODO NOTE: in sandbox mode, you can only send to verified addresses!
 * @param {string} subject - E-mail subject
 * @param {string} body - E-mail's HTML body
 * @param {string[]} [replyTo] - list of e-mail addresses to reply to (if not specified, 'from' is also the reply address)
 * @param {string[]} [toCC] - list of CC recipient's email addresses
 * @param {string} [textBody] - optional plaintext body
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

  // Create SES service object (seems to be unrecognized by eslint)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
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
  return await sesClient.send(new SendEmailCommand(params));
}

/**
 * Sends an initial login e-mail to the given user, containing a one-time password change link
 * @param {string} email - the user's e-mail address
 * @param {string} password - the user's (generated) password
 * @param {string} type - the users type - 'emp' for employee or 'man' for company
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
