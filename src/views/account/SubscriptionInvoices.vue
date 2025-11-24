<script setup lang="ts">
/**
 * Page des factures d'abonnement
 * Liste toutes les factures liées à l'abonnement consultations
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-0aac173ed2/icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { SubscriptionInvoice, InvoiceStatus } from '@/types/subscription.types'

import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const router = useRouter()

/**
 * Icônes
 */
const icons = computed(() => ({
  arrowLeft: byPrefixAndName.fas?.['arrow-left'],
  arrowRight: byPrefixAndName.fas?.['arrow-right'],
  fileInvoice: byPrefixAndName.fas?.['file-invoice'],
  euroSign: byPrefixAndName.fas?.['euro-sign'],
  creditCard: byPrefixAndName.fas?.['credit-card'],
  download: byPrefixAndName.fas?.['download']
}))

const getIcon = (iconKey: keyof typeof icons.value): IconDefinition => {
  return icons.value[iconKey] as IconDefinition
}

// Données simulées (à remplacer par appel API)
const invoices = ref<SubscriptionInvoice[]>([
  {
    id: '1',
    subscriptionId: 'sub-123',
    date: '2024-11-10',
    period: 'Novembre 2024',
    amount: 75,
    status: 'paid',
    pdfUrl: '/invoices/inv-001.pdf',
    paymentMethod: 'Carte •••• 1234',
    createdAt: '2024-11-10T10:00:00Z'
  },
  {
    id: '2',
    subscriptionId: 'sub-123',
    date: '2024-10-10',
    period: 'Octobre 2024',
    amount: 75,
    status: 'paid',
    pdfUrl: '/invoices/inv-002.pdf',
    paymentMethod: 'Carte •••• 1234',
    createdAt: '2024-10-10T10:00:00Z'
  },
  {
    id: '3',
    subscriptionId: 'sub-123',
    date: '2024-09-10',
    period: 'Septembre 2024',
    amount: 100,
    status: 'paid',
    pdfUrl: '/invoices/inv-003.pdf',
    paymentMethod: 'Carte •••• 1234',
    createdAt: '2024-09-10T10:00:00Z'
  }
])

// Filtres
const selectedYear = ref<string>('all')
const selectedStatus = ref<InvoiceStatus | 'all'>('all')

// Années disponibles
const availableYears = computed(() => {
  const years = new Set(invoices.value.map((inv) => new Date(inv.date).getFullYear().toString()))
  return ['all', ...Array.from(years).sort().reverse()]
})

// Factures filtrées
const filteredInvoices = computed(() => {
  return invoices.value.filter((invoice) => {
    const yearMatch =
      selectedYear.value === 'all' ||
      new Date(invoice.date).getFullYear().toString() === selectedYear.value
    const statusMatch = selectedStatus.value === 'all' || invoice.status === selectedStatus.value
    return yearMatch && statusMatch
  })
})

// Statistiques
const totalAmount = computed(() => {
  return filteredInvoices.value.reduce((sum, inv) => sum + inv.amount, 0)
})

// Badge de statut
const getStatusBadge = (status: InvoiceStatus) => {
  const badges = {
    paid: { label: 'Payée', variant: 'default' as const, class: 'bg-green-500' },
    pending: { label: 'En attente', variant: 'secondary' as const, class: '' },
    failed: { label: 'Échouée', variant: 'destructive' as const, class: '' },
    refunded: { label: 'Remboursée', variant: 'outline' as const, class: '' }
  }
  return badges[status] || badges.pending
}

// Télécharger une facture
const downloadInvoice = (invoice: SubscriptionInvoice) => {
  // TODO: Implémenter le téléchargement réel
  console.log('Téléchargement facture:', invoice.id)
  window.open(invoice.pdfUrl, '_blank')
}

// Retour
const goBack = () => {
  router.push('/mon-compte?tab=subscription')
}
</script>

<template>
  <DefaultLayout>
    <div class="container max-w-6xl mx-auto py-8 px-4">
    <!-- En-tête -->
    <div class="mb-6">
      <Button variant="ghost" @click="goBack" class="mb-4">
        <FontAwesomeIcon v-if="getIcon('arrowLeft')" :icon="getIcon('arrowLeft')" class="mr-2" />
        Retour à Mon Compte
      </Button>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold" style="font-family: Roboto, sans-serif">
            Factures d'abonnement
          </h1>
          <p class="text-muted-foreground mt-2">
            Consultez et téléchargez vos factures d'abonnement
          </p>
        </div>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Total des factures</p>
              <p class="text-2xl font-bold" style="font-family: Roboto, sans-serif">
                {{ filteredInvoices.length }}
              </p>
            </div>
            <FontAwesomeIcon v-if="getIcon('fileInvoice')" :icon="getIcon('fileInvoice')" class="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Montant total</p>
              <p class="text-2xl font-bold" style="font-family: Roboto, sans-serif">
                {{ totalAmount }}€
              </p>
            </div>
            <FontAwesomeIcon v-if="getIcon('euroSign')" :icon="getIcon('euroSign')" class="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Dernier paiement</p>
              <p class="text-2xl font-bold" style="font-family: Roboto, sans-serif">
                {{ invoices[0]?.amount }}€
              </p>
            </div>
            <FontAwesomeIcon v-if="getIcon('creditCard')" :icon="getIcon('creditCard')" class="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Filtres et tableau -->
    <Card>
      <CardHeader>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle style="font-family: Roboto, sans-serif">
              Historique des factures
            </CardTitle>
            <CardDescription style="font-family: Roboto, sans-serif">
              Liste complète de vos factures d'abonnement
            </CardDescription>
          </div>

          <!-- Filtres -->
          <div class="flex gap-3">
            <select
              v-model="selectedYear"
              class="flex h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">Toutes</option>
              <option v-for="year in availableYears.slice(1)" :key="year" :value="year">
                {{ year }}
              </option>
            </select>

            <select
              v-model="selectedStatus"
              class="flex h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">Tous</option>
              <option value="paid">Payées</option>
              <option value="pending">En attente</option>
              <option value="failed">Échouées</option>
              <option value="refunded">Remboursées</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <!-- Vue Desktop -->
        <div class="hidden md:block">
          <Table v-if="filteredInvoices.length > 0">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="invoice in filteredInvoices" :key="invoice.id">
                <TableCell class="font-medium">
                  {{ new Date(invoice.date).toLocaleDateString('fr-FR') }}
                </TableCell>
                <TableCell>{{ invoice.period }}</TableCell>
                <TableCell class="font-semibold">{{ invoice.amount }}€</TableCell>
                <TableCell>
                  <Badge
                    :variant="getStatusBadge(invoice.status).variant"
                    :class="getStatusBadge(invoice.status).class"
                  >
                    {{ getStatusBadge(invoice.status).label }}
                  </Badge>
                </TableCell>
                <TableCell class="text-sm text-muted-foreground">
                  {{ invoice.paymentMethod }}
                </TableCell>
                <TableCell class="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="downloadInvoice(invoice)"
                    :disabled="!invoice.pdfUrl"
                  >
                    <FontAwesomeIcon v-if="getIcon('download')" :icon="getIcon('download')" class="mr-2" />
                    Télécharger
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <!-- Aucune facture -->
          <div v-else class="text-center py-12">
            <FontAwesomeIcon
              v-if="getIcon('fileInvoice')"
              :icon="getIcon('fileInvoice')"
              class="w-12 h-12 text-muted-foreground mx-auto mb-4"
            />
            <p class="text-muted-foreground">Aucune facture trouvée</p>
          </div>
        </div>

        <!-- Vue Mobile -->
        <div class="md:hidden space-y-4">
          <Card
            v-for="invoice in filteredInvoices"
            :key="invoice.id"
            class="border-l-4"
            :class="{
              'border-l-green-500': invoice.status === 'paid',
              'border-l-yellow-500': invoice.status === 'pending',
              'border-l-red-500': invoice.status === 'failed',
              'border-l-gray-500': invoice.status === 'refunded'
            }"
          >
            <CardContent class="pt-6">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-lg">{{ invoice.amount }}€</span>
                  <Badge
                    :variant="getStatusBadge(invoice.status).variant"
                    :class="getStatusBadge(invoice.status).class"
                  >
                    {{ getStatusBadge(invoice.status).label }}
                  </Badge>
                </div>

                <div class="text-sm space-y-1">
                  <p class="text-muted-foreground">
                    <strong>Période :</strong> {{ invoice.period }}
                  </p>
                  <p class="text-muted-foreground">
                    <strong>Date :</strong>
                    {{ new Date(invoice.date).toLocaleDateString('fr-FR') }}
                  </p>
                  <p class="text-muted-foreground">
                    <strong>Paiement :</strong> {{ invoice.paymentMethod }}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  @click="downloadInvoice(invoice)"
                  :disabled="!invoice.pdfUrl"
                  class="w-full"
                >
                  <FontAwesomeIcon v-if="getIcon('download')" :icon="getIcon('download')" class="mr-2" />
                  Télécharger la facture
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Aucune facture -->
          <div v-if="filteredInvoices.length === 0" class="text-center py-12">
            <FontAwesomeIcon
              v-if="getIcon('fileInvoice')"
              :icon="getIcon('fileInvoice')"
              class="w-12 h-12 text-muted-foreground mx-auto mb-4"
            />
            <p class="text-muted-foreground">Aucune facture trouvée</p>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  </DefaultLayout>
</template>
