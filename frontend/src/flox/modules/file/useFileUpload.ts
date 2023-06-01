import { QFile, QVueGlobals, useQuasar } from 'quasar';
import { Ref, ref } from 'vue';

import { i18n } from 'boot/i18n';
import {
  SelectedFile,
  uploadFile,
} from 'src/flox/modules/file/tools/upload.tools';
import { UploadStatus } from 'src/flox/modules/file/enums/uploadStatus.enum';

/**
 * Composable to get all functions needed to handle file upload
 *
 * @param filePicker - Vue ref to a quasar file picker component
 * @returns composition
 */
export default function useFileUpload(filePicker: Ref<QFile | null>): {
  selectedFiles: Ref<SelectedFile[]>;
  onFailed: (failedEntries: SelectedFile[]) => void;
  onSuccess: (successfulEntries: SelectedFile[]) => void;
  addFile: () => void;
  removeFile: (index: number) => void;
  clearFileList: () => void;
  onFilePicked: (newFiles: File[]) => void;
  uploadFiles: (path: string) => Promise<void>;
} {
  const $q: QVueGlobals = useQuasar();
  const selectedFiles: Ref<SelectedFile[]> = ref([]);

  /**
   * Notify the user that the upload failed
   *
   * @param failedEntries - failed entries
   */
  function onFailed(failedEntries: SelectedFile[]): void {
    $q.notify({
      type: 'negative',
      message: i18n.global.t('files.failed_upload', {
        value: failedEntries.length,
      }),
    });
  }

  /**
   * Notify the user that the upload succeeded
   *
   * @param successfulEntries - successful entries
   */
  function onSuccess(successfulEntries: SelectedFile[]): void {
    $q.notify({
      type: 'positive',
      message: i18n.global.t('files.successfully_uploaded', {
        value: successfulEntries.length,
      }),
    });
  }

  /**
   * Open the dialog to select files for upload
   */
  function addFile(): void {
    filePicker.value?.pickFiles();
  }

  /**
   * Removes a file from the file list
   *
   * @param index - The index of file to remove
   */
  function removeFile(index: number): void {
    selectedFiles.value.splice(index);
  }

  /**
   * Removes all files that have been selected so far
   */
  function clearFileList(): void {
    selectedFiles.value = [];
  }

  /**
   * Triggered when a file is picked from the file picker dialog
   *
   * @param newFiles - the newly picked files
   */
  function onFilePicked(newFiles: File[] | File): void {
    let fileArray;
    if (!Array.isArray(newFiles)) {
      fileArray = [newFiles];
    } else {
      fileArray = newFiles;
    }
    fileArray.forEach((file) => {
      const newSelectedFile: SelectedFile = {
        content: file,
        url: URL.createObjectURL(file),
        status: UploadStatus.READY,
      };
      selectedFiles.value = selectedFiles.value.concat(newSelectedFile);
    });
  }

  /**
   * Triggers a separate upload for each file. Only uploads files that haven't been successfully uploaded before.
   *
   * @param path - path to which file shall be uploaded to
   */
  async function uploadFiles(path: string): Promise<void> {
    const uploads = selectedFiles.value.map(async (file) => {
      if (file.status !== UploadStatus.DONE) {
        // eslint-disable-next-line no-param-reassign
        file.status = UploadStatus.LOADING;
        try {
          const createdFile = await uploadFile(file, { path });
          // eslint-disable-next-line no-param-reassign
          file.status = UploadStatus.DONE;
          // eslint-disable-next-line no-param-reassign
          file.fileEntity = createdFile;
        } catch (e: any) {
          console.error(e);
          // eslint-disable-next-line no-param-reassign
          file.status = UploadStatus.FAILED;
        }
      }
    });
    await Promise.allSettled(uploads);

    // Check for successful uploads
    const successfulUploads = selectedFiles.value.filter(
      (file) => file.status === UploadStatus.DONE
    );
    if (successfulUploads.length > 0) {
      onSuccess(successfulUploads);
    }

    // Check for failed uploads
    const failedUploads = selectedFiles.value.filter(
      (file) => file.status === UploadStatus.FAILED
    );
    if (failedUploads.length > 0) {
      onFailed(failedUploads);
    }
  }

  return {
    selectedFiles,
    onFailed,
    onSuccess,
    addFile,
    removeFile,
    clearFileList,
    onFilePicked,
    uploadFiles,
  };
}
