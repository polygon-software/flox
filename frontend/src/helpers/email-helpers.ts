import {SESClient, SendEmailCommand, SendEmailCommandOutput} from '@aws-sdk/client-ses';

// Set the AWS Region.
const REGION = 'eu-central-1';

// TODO
const CREDENTIALS = {
  accessKeyId: 'AKIA5OA2ITKTM3NQNA2Z',
  secretAccessKey: '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',
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

// TODO parametrize
async function sendEmail(): Promise<void|SendEmailCommandOutput>{
  // Set the parameters TODO
  const params = {
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        // TODO NOTE: in sandbox mode, you can only send to verified adresses!
        'david.wyss@hotmail.ch', //RECEIVER_ADDRESS
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: 'HTML_FORMAT_BODY',
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'TEXT_FORMAT_BODY',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'AWS test mail!',
      },
    },
    Source: 'david.wyss@polygon-software.ch', // SENDER_ADDRESS
    ReplyToAddresses: [
      'david.wyss@polygon-software.ch'
    ],
  };

  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log('Success', data);
    return data; // For unit tests.
  } catch (err) {
    console.error(err);
  }

}

export {sendEmail}
