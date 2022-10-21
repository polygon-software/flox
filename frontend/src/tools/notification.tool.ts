import { QVueGlobals } from 'quasar';

/**
 * This file contains functions related to showing notifications
 */

type NotificationOptions = {
  position?:
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom'
    | 'left'
    | 'right'
    | 'center';
  color?: string;
  textColor?: string;
  icon?: string;
  multiLine?: boolean;
  timeout?: number;
};

/**
 * Shows a default success notification
 * @param {QVueGlobals} q - Quasar instance
 * @param {string} message - message text
 * @param {NotificationOptions} options - options
 * @returns {void} - void
 */
export function showSuccessNotification(q: QVueGlobals, message: string, options: NotificationOptions = {}): void {
  showNotification(q, message, { color: 'positive', icon: 'done', ...options });
}

/**
 * Shows a default error notification
 * @param {QVueGlobals} q - Quasar instance
 * @param {string} message - message text
 * @param {NotificationOptions} options - options
 * @returns {void} - void
 */
export function showErrorNotification(q: QVueGlobals, message: string, options: NotificationOptions = {}): void {
  showNotification(q, message, { color: 'negative', icon: 'clear', ...options });
}

/**
 * Shows a notification with the given parameters
 * @param {QVueGlobals} q - Quasar instance
 * @param {string} message - message text
 * @param {NotificationOptions} options - options
 * @returns {void} - void
 */
export function showNotification(
  q: QVueGlobals,
  message: string,
  options: NotificationOptions
): void {
  q.notify({
    message: message,
    position: options.position ?? 'bottom',
    color: options.color ?? 'primary',
    textColor: options.textColor ?? 'white',
    icon: options.icon,
    multiLine: options.multiLine ?? false,
    timeout: options.timeout ?? 3000,
  });
}
