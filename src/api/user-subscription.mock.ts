/**
 * Mock API pour les abonnements utilisateur
 * Simule la réponse de GET /fetchUserSubscription
 */

import type {
  APIUserSubscriptionResponse,
  APIUpdatePaymentResponse,
} from '@/types/user-subscription-api.types'

/**
 * Données mock pour les abonnements utilisateur
 */
export async function mockFetchUserSubscriptionAPI(): Promise<APIUserSubscriptionResponse> {
  // Simuler latence réseau
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    status: 'success',
    subscription_array: [
      {
        subscriptionId: 1,
        status: 'active',
        dateStart: '2025-12-10 00:00:00',
        dateStop: null,
        planId: 35,
        regularInterval: 'P1Y',
        intervalNumber: 1,
        nextPaymentDate: '2026-12-10 09:00:00',
        technicalTag: 'portefeuillepermanent',
        planName: 'premium',
        planDescription: 'Accès complet aux consultations Portefeuille Permanent',
        oneClickId: 2,
        oneClickName: 'Les consultations privées : Portefeuille permanent',
        oneClickDescription: 'Accès aux consultations portefeuille',
        billingScheme_array: [{ id: 1, oneClickPlanId: 35, price: 14900 }],
      },
      {
        subscriptionId: 2,
        status: 'suspended',
        dateStart: '2025-12-10 00:00:00',
        dateStop: null,
        planId: 36,
        regularInterval: 'P1M',
        intervalNumber: 1,
        nextPaymentDate: null,
        technicalTag: 'libertefinanciere',
        planName: 'standard',
        planDescription: 'Accès standard aux consultations Liberté Financière',
        oneClickId: 3,
        oneClickName: 'Les consultations privées : Liberté financière',
        oneClickDescription: 'Accès aux consultations liberté',
        billingScheme_array: [{ id: 2, oneClickPlanId: 36, price: 1490 }],
      },
      {
        subscriptionId: 3,
        status: 'canceled',
        dateStart: '2025-06-01 00:00:00',
        dateStop: '2025-12-01 00:00:00',
        planId: 34,
        regularInterval: 'P1M',
        intervalNumber: 1,
        nextPaymentDate: null,
        technicalTag: 'metauxprecieux',
        planName: 'standard',
        planDescription: 'Accès standard aux consultations Métaux Précieux',
        oneClickId: 1,
        oneClickName: 'Les consultations privées : Métaux précieux',
        oneClickDescription: 'Accès aux consultations métaux',
        billingScheme_array: [{ id: 3, oneClickPlanId: 34, price: 1490 }],
      },
    ],
    invoice_array: [
      {
        subscriptionId: 1,
        subscriptionName: 'INV-2026-001',
        technicalTag: 'portefeuillepermanent',
        oneClickName: 'Les consultations privées : Portefeuille permanent',
        planName: 'premium',
        execution: '2026-02-10 09:00:00',
        amount: 14900,
        currency: 'eur',
        paymentId: 1001,
        invoiceUrl: 'https://pay.stripe.com/invoice/acct_123/invst_456',
      },
      {
        subscriptionId: 2,
        subscriptionName: 'INV-2026-002',
        technicalTag: 'libertefinanciere',
        oneClickName: 'Les consultations privées : Liberté financière',
        planName: 'standard',
        execution: '2026-01-10 09:00:00',
        amount: 1490,
        currency: 'eur',
        paymentId: 1002,
        invoiceUrl: 'https://pay.stripe.com/invoice/acct_123/invst_789',
      },
      {
        subscriptionId: 3,
        subscriptionName: 'INV-2025-003',
        technicalTag: 'metauxprecieux',
        oneClickName: 'Les consultations privées : Métaux précieux',
        planName: 'standard',
        execution: '2025-12-01 09:00:00',
        amount: 1490,
        currency: 'eur',
        paymentId: 1003,
        invoiceUrl: 'https://pay.stripe.com/invoice/acct_123/invst_101',
      },
      {
        subscriptionId: 3,
        subscriptionName: 'INV-2025-004',
        technicalTag: 'metauxprecieux',
        oneClickName: 'Les consultations privées : Métaux précieux',
        planName: 'standard',
        execution: '2025-11-01 09:00:00',
        amount: 1490,
        currency: 'eur',
        paymentId: 1004,
        invoiceUrl: 'https://pay.stripe.com/invoice/acct_123/invst_102',
      },
    ],
  }
}

/**
 * Mock pour la mise à jour du moyen de paiement
 * Simule la réponse de POST /updateOneClickPayment
 */
export async function mockUpdateOneClickPaymentAPI(): Promise<APIUpdatePaymentResponse> {
  // Simuler latence réseau
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    status: 'success',
    stripePublicKey: 'pk_test_mock_key_123',
    client_secret: 'seti_mock_secret_456',
  }
}
