import {SESClient, SendEmailCommand, SendEmailCommandOutput} from '@aws-sdk/client-ses';

// Set the AWS Region.
const REGION = 'eu-central-1'; //e.g. "us-east-1"
// Create SES service object.
const sesClient: SESClient = new SESClient({ region: REGION });

/**
 * This file contains a collection of helper functions for sending e-mails, using AWS Simple Email Service (SES)
 */


async function sendEmail(): Promise<void|SendEmailCommandOutput>{
  // Set the parameters TODO
  const params = {
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
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
        Data: 'EMAIL_SUBJECT',
      },
    },
    Source: 'david.wyss@polygon-software.ch', // SENDER_ADDRESS
    ReplyToAddresses: [
      /* more items */
    ],
  };

  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log('Success', data);
    return data; // For unit tests.
  } catch (err) {
    console.log('Error', err);
  }

}

export {sendEmail}
