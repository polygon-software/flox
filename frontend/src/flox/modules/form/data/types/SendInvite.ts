import { isEmpty } from 'class-validator';

import DELIVERY_MEDIUMS from '../../../../enum/DELIVERY_MEDIUMS';

/**
 * This class represnts the contents of a send invite field, used
 * when an admin creates a new user.
 */
export default class SendInvite {
  mediums?: string;

  phoneNumber?: string;

  // eslint-disable-next-line require-jsdoc
  constructor(mediums?: string, phoneNumber?: string) {
    this.mediums = mediums;
    this.phoneNumber = phoneNumber;
  }

  /**
   * Determines whether it's a valid storable output
   * @returns - whether it's valid
   */
  isComplete(): boolean {
    return (
      !!this.mediums &&
      ((this.mediums.includes(DELIVERY_MEDIUMS.SMS) && !!this.phoneNumber) ||
        (!this.mediums.includes(DELIVERY_MEDIUMS.SMS) &&
          isEmpty(this.phoneNumber)))
    );
  }
}
