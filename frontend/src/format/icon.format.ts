/**
 * Resolves a material design icon from a mime type
 *
 * @param mimetype - like application/pdf or image/png
 * @returns name of fitting material icon
 */
export function mimetypeToIcon(mimetype: string): string {
  if (!mimetype) {
    return 'folder';
  }
  if (mimetype.startsWith('image')) {
    return 'image';
  }
  if (mimetype.startsWith('audio')) {
    return 'library_music';
  }
  if (mimetype.startsWith('video')) {
    return 'videocam';
  }
  if (mimetype.startsWith('text')) {
    return 'text_fields';
  }
  return 'attach_file';
}
