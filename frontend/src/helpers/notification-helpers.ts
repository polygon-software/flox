import {QVueGlobals} from 'quasar';

/**
 * This file contains functions related to showing notifications
 */

/**
 * Shows a notification with the given parameters
 * @param q - Quasar instance
 * @param message - message text
 * @param {'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom' | 'left' | 'right' | 'center' | undefined} [position] - position of the notification
 * @param {string} [color] - background color
 * @param {string} [textColor] - color of text
 * @param {string} [icon] - the icon to show, if any
 * @param {boolean} [multiLine] - whether the message spans multiple lines
 * @param {number} [timeout] - amount of time (in ms) to display the notification
 */
export function showNotification(
  q: QVueGlobals,
  message: string,
  position: 'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom' | 'left' | 'right' | 'center' | undefined = 'bottom',
  color = 'primary',
  textColor = 'white',
  icon: string|undefined = undefined,
  multiLine = false,
  timeout = 3000
): void {
  console.log('show notif')
  q.notify({
    color,
    textColor,
    icon,
    message,
    position,
    multiLine,
    timeout
  })
}
