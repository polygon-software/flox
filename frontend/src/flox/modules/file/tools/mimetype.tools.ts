/**
 * Decides whether the given mimetype is image
 * @param mimetype - file mimetype
 * @returns whether mimetype is image
 */
export function isImage(mimetype: string): boolean {
  return mimetype.startsWith('image');
}

/**
 * Decides whether the given mimetype is audio
 * @param mimetype - file mimetype
 * @returns whether mimetype is audio
 */
export function isAudio(mimetype: string): boolean {
  return mimetype.startsWith('audio');
}

/**
 * Decides whether the given mimetype is video
 * @param mimetype - file mimetype
 * @returns whether mimetype is video
 */
export function isVideo(mimetype: string): boolean {
  return mimetype.startsWith('video');
}

/**
 * Decides whether the given mimetype is video
 * @param mimetype - file mimetype
 * @returns whether mimetype is video
 */
export function isPdf(mimetype: string): boolean {
  return mimetype.endsWith('pdf');
}

/**
 * Resolves a material design icon from a mime type
 * @param mimetype - like application/pdf or image/png
 * @returns name of fitting material icon
 */
export function mimetypeToIcon(mimetype: string): string {
  if (!mimetype) {
    return 'folder';
  }
  if (isImage(mimetype)) {
    return 'image';
  }
  if (isAudio(mimetype)) {
    return 'library_music';
  }
  if (isVideo(mimetype)) {
    return 'videocam';
  }
  if (isPdf(mimetype)) {
    return 'picture_as_pdf';
  }
  if (mimetype.startsWith('text')) {
    return 'text_fields';
  }
  return 'attach_file';
}
