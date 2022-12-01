import { executeMutation } from 'src/apollo/mutation';
import { TEST_PAYMENT } from 'src/flox/modules/payment/payment.mutations';
import PaymentEntity from 'src/flox/modules/payment/entities/payment.enttity';
import { executeQuery } from 'src/apollo/query';
import {
  GET_PAYMENT,
  SEARCH_PAYMENT,
} from 'src/flox/modules/payment/payment.query';
import CountQuery from 'src/flox/modules/interfaces/entities/count.entity';

/**
 * Fetches a payment
 *
 * @param uuid - uuid of payment
 * @returns payment
 */
export async function getPayment(uuid: string): Promise<PaymentEntity> {
  const { data } = await executeQuery<PaymentEntity>(GET_PAYMENT, {
    uuid,
  });
  return data;
}

/**
 * Creates a test payment intent of 1 CHF
 */
export async function createTestPayment(): Promise<PaymentEntity | null> {
  const { data } = await executeMutation<PaymentEntity>(TEST_PAYMENT, {});
  return data ?? null;
}

/**
 * Search payment
 *
 * @param take - pagination take
 * @param skip - pagination skip
 * @param filter - search input for username
 * @param sortBy - column to sort results by
 * @param descending - sort ascending or descending
 * @returns search results
 */
export async function searchPayment(
  take = 10,
  skip = 0,
  filter = '',
  sortBy = 'uuid',
  descending = false
): Promise<CountQuery<PaymentEntity>> {
  const { data } = await executeQuery<CountQuery<PaymentEntity>>(
    SEARCH_PAYMENT,
    {
      take,
      skip,
      filter,
      sortBy,
      descending,
    }
  );
  return data;
}
