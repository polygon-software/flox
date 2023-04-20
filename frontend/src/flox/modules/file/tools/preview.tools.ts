import { QVueGlobals } from 'quasar';

import FileEntity from 'src/flox/modules/file/entities/file.entity';
import MusicPlayerDialog from 'src/flox/modules/file/components/dialogs/MusicPlayerDialog.vue';
import ImageDialog from 'src/flox/modules/file/components/dialogs/ImageDialog.vue';
import PdfDialog from 'src/flox/modules/file/components/dialogs/PdfDialog.vue';
import VideoDialog from 'src/flox/modules/file/components/dialogs/VideoDialog.vue';
import {
  isAudio,
  isImage,
  isPdf,
  isVideo,
} from 'src/flox/modules/file/tools/mimetype.tools';
import { showErrorNotification } from 'src/tools/notification.tool';
import { i18n } from 'boot/i18n';

/**
 * Previews an unknown file by opening it in a new browser tab and let the
 * browser decide how to display it
 * @param $q - quasar globals to handle dialog
 * @param file - file to be previewed
 */
export function previewUnknownfile($q: QVueGlobals, file: FileEntity): void {
  if (!file.url) {
    showErrorNotification($q, i18n.global.t('file.preview_error_no_file'));
    throw new Error('Cannot preview file without an URL');
  }
  window.open(file.url, '_blank');
}

/**
 * Previews an audio file in a dialog
 * @param $q - quasar globals to handle dialog
 * @param file - file to be previewed
 */
export function previewAudio($q: QVueGlobals, file: FileEntity): void {
  if (!(file.mimetype && isAudio(file.mimetype))) {
    showErrorNotification($q, i18n.global.t('file.preview_error_no_audio'));
    throw new Error('File is not audio, unable to render preview');
  }
  $q.dialog({
    component: MusicPlayerDialog,
    componentProps: {
      file,
      autoplay: true,
    },
  });
}

/**
 * Previews an video file in a dialog
 * @param $q - quasar globals to handle dialog
 * @param file - file to be previewed
 */
export function previewVideo($q: QVueGlobals, file: FileEntity): void {
  if (!(file.mimetype && isVideo(file.mimetype))) {
    showErrorNotification($q, i18n.global.t('file.preview_error_no_video'));
    throw new Error('File is not video, unable to render preview');
  }
  $q.dialog({
    component: VideoDialog,
    componentProps: {
      video: file,
      autoplay: true,
    },
  });
}

/**
 * Previews an image file in a dialog
 * @param $q - quasar globals to handle dialog
 * @param file - file to be previewed
 */
export function previewImage($q: QVueGlobals, file: FileEntity): void {
  if (!(file.mimetype && isImage(file.mimetype))) {
    showErrorNotification($q, i18n.global.t('file.preview_error_no_image'));
    throw new Error('File is not image, unable to render preview');
  }
  $q.dialog({
    component: ImageDialog,
    componentProps: {
      image: file,
    },
  });
}

/**
 * Previews a pdf file in a dialog
 * @param $q - quasar globals to handle dialog
 * @param file - file to be previewed
 */
export function previewPdf($q: QVueGlobals, file: FileEntity): void {
  if (!(file.mimetype && isPdf(file.mimetype))) {
    showErrorNotification($q, i18n.global.t('file.preview_error_no_pdf'));
    throw new Error('File is not pdf, unable to render preview');
  }
  $q.dialog({
    component: PdfDialog,
    componentProps: {
      pdf: file,
    },
  });
}
