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
 * Shows a notification with the given parameters
 * @param q - Quasar instance
 * @param message - message text
 * @param options - options
 * @returns void
 */
export function showNotification(
  q: QVueGlobals,
  message: string,
  options: NotificationOptions
): void {
  q.notify({
    message,
    position: options.position ?? 'bottom',
    color: options.color ?? 'primary',
    textColor: options.textColor ?? 'white',
    icon: options.icon,
    multiLine: options.multiLine ?? false,
    timeout: options.timeout ?? 3000,
  });
}

/**
 * Shows a default success notification
 * @param q - Quasar instance
 * @param message - message text
 * @returns - void
 */
export function showSuccessNotification(q: QVueGlobals, message: string): void {
  showNotification(q, message, { color: 'positive' });
}

/**
 * Shows a default error notification
 * @param q - Quasar instance
 * @param message - message text
 * @returns void
 */
export function showErrorNotification(q: QVueGlobals, message: string): void {
  showNotification(q, message, { color: 'negative' });
}
