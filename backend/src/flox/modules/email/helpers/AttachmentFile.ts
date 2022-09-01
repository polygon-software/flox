/**
 * Data Type for a file attachment to be used sent via e-mail using Nodemailer
 */

export type AttachmentFile = {
  filename: string;
  content: Buffer;
  contentType: string; // MIME content type (e.g. 'application/pdf')
};
