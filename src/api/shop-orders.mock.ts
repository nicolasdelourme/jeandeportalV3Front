/**
 * Mock API pour les factures de commandes (shop orders)
 * Endpoint simulé: GET /fetchPaidInvoicePerOrder
 */

import type { APIShopOrdersResponse } from '@/types/shop-orders-api.types'

/**
 * Simule un délai réseau
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Mock de GET /fetchPaidInvoicePerOrder
 * Retourne des factures de commandes fictives
 */
export async function mockFetchShopOrdersAPI(): Promise<APIShopOrdersResponse> {
  // Simuler un délai réseau
  await delay(500)

  return {
    status: 'success',
    invoice_array: [
      {
        orderId: 746,
        name: '2026-01-2233',
        execution: '2026-01-23 09:00:00',
        amount: 4990,
        currency: 'eur',
        paymentId: 1535,
        invoiceUrl: 'https://pay.stripe.com/invoice/mock_1',
      },
      {
        orderId: 745,
        name: '2026-01-2232',
        execution: '2026-01-15 14:30:00',
        amount: 2990,
        currency: 'eur',
        paymentId: 1534,
        invoiceUrl: 'https://pay.stripe.com/invoice/mock_2',
      },
      {
        orderId: 744,
        name: '2025-12-1890',
        execution: '2025-12-20 10:00:00',
        amount: 0,
        currency: 'jdp',
        paymentId: 1533,
        // Pas d'invoiceUrl car currency=jdp et amount=0
      },
      {
        orderId: 743,
        name: '2025-11-1654',
        execution: '2025-11-05 16:45:00',
        amount: 1990,
        currency: 'eur',
        paymentId: 1532,
        invoiceUrl: 'https://pay.stripe.com/invoice/mock_3',
      },
    ],
  }
}
