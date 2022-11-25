import { executeMutation } from 'src/apollo/mutation';
import { TEST_PAYMENT } from 'src/flox/modules/payment/payment.mutations';
import PaymentEntity from 'src/flox/modules/payment/entities/payment.enttity';
import { executeQuery } from 'src/apollo/query';
import { GET_PAYMENT } from 'src/flox/modules/payment/payment.query';

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
