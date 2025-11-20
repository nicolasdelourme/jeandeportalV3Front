/**
 * Composable pour gérer les consultations Player
 *
 * Fournit des méthodes utilitaires pour accéder et manipuler
 * les données de consultations (live et replay)
 */

import { computed, ref, type Ref } from 'vue'
import type {
  PlayerConsultation,
  PlayerConsultationData,
  CategorieConsultation,
  VisibiliteConsultation,
  AccessRights
} from '@/types/player-consultation.types'
import playerData from '@/data/player-consultation.json'

export function usePlayerConsultation(consultationId?: number | Ref<number>) {
  // Import des données brutes
  const data = playerData as PlayerConsultationData

  // ID de la consultation (peut être réactif)
  const id = typeof consultationId === 'number' ? ref(consultationId) : consultationId

  /**
   * Récupère une consultation par son ID
   */
  const consultation = computed<PlayerConsultation | undefined>(() => {
    if (!id) return undefined
    return data.consultations.find((c) => c.id === id.value)
  })

  /**
   * Récupère toutes les consultations
   */
  const allConsultations = computed(() => data.consultations)

  /**
   * Configuration globale
   */
  const configuration = computed(() => data.configuration)

  /**
   * Vérifie si la consultation est en direct
   */
  const isLive = computed(() => consultation.value?.isLive ?? false)

  /**
   * Vérifie si la consultation est en replay
   */
  const isReplay = computed(() => consultation.value?.isReplay ?? false)

  /**
   * Vérifie si un dossier est disponible
   */
  const hasDossier = computed(() => consultation.value?.dossier !== null)

  /**
   * Récupère le badge de catégorie avec sa couleur
   */
  const categorieBadge = computed(() => {
    const categorie = consultation.value?.categorie
    if (!categorie) return null

    const badges: Record<
      CategorieConsultation,
      { label: string; color: string; bgColor: string }
    > = {
      argent: {
        label: 'Argent',
        color: '#374151',
        bgColor: '#F3F4F6'
      },
      metaux: {
        label: 'Métaux Précieux',
        color: '#92400E',
        bgColor: '#FEF3C7'
      },
      patrimoine: {
        label: 'Patrimoine',
        color: '#1E40AF',
        bgColor: '#DBEAFE'
      },
      immobilier: {
        label: 'Immobilier',
        color: '#047857',
        bgColor: '#D1FAE5'
      }
    }

    return badges[categorie]
  })

  /**
   * Récupère les annexes gratuites pour abonnés premium
   */
  const annexesGratuitesPremium = computed(() => {
    return consultation.value?.annexes.filter((a) => a.gratuitAbonnement) ?? []
  })

  /**
   * Récupère les annexes payantes
   */
  const annexesPayantes = computed(() => {
    return consultation.value?.annexes.filter((a) => !a.gratuitAbonnement) ?? []
  })

  /**
   * Calcule le prix total de toutes les annexes payantes
   */
  const prixTotalAnnexes = computed(() => {
    return annexesPayantes.value.reduce((total, annexe) => total + annexe.prix, 0)
  })

  /**
   * Récupère les droits d'accès pour un niveau de visibilité
   */
  const getAccessRights = (visibilite: VisibiliteConsultation): AccessRights => {
    return data.configuration.accessControl[visibilite]
  }

  /**
   * Vérifie si l'utilisateur a accès à une fonctionnalité
   */
  const hasAccess = (feature: keyof AccessRights, userLevel: VisibiliteConsultation): boolean => {
    const rights = getAccessRights(userLevel)
    return rights[feature]
  }

  /**
   * Formate la durée en heures et minutes
   */
  const formatDuree = (minutes: number): string => {
    const heures = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (heures > 0) {
      return `${heures}h${mins > 0 ? mins.toString().padStart(2, '0') : ''}`
    }
    return `${mins} min`
  }

  /**
   * Récupère la durée formatée de la consultation
   */
  const dureeFormatee = computed(() => {
    if (!consultation.value) return ''
    return formatDuree(consultation.value.dureeMinutes)
  })

  /**
   * Récupère l'horaire complet formaté (ex: "18:30 - 19:45")
   */
  const horaireComplet = computed(() => {
    if (!consultation.value) return ''
    return `${consultation.value.heureDebut} - ${consultation.value.heureFin}`
  })

  /**
   * Vérifie si la consultation est programmée dans le futur
   */
  const isFuture = computed(() => {
    if (!consultation.value) return false
    const consultationDate = new Date(consultation.value.date)
    const now = new Date()
    return consultationDate > now
  })

  /**
   * Vérifie si la consultation est en cours
   */
  const isOngoing = computed(() => {
    if (!consultation.value || !isLive.value) return false

    const now = new Date()
    const consultationDate = new Date(consultation.value.date)

    // Vérifier si c'est le bon jour
    if (consultationDate.toDateString() !== now.toDateString()) {
      return false
    }

    // Parser l'heure de début et de fin
    const [heureDebutH, heureDebutM] = consultation.value.heureDebut.split(':').map(Number)
    const [heureFinH, heureFinM] = consultation.value.heureFin.split(':').map(Number)

    const debut = new Date(consultationDate)
    debut.setHours(heureDebutH, heureDebutM, 0, 0)

    const fin = new Date(consultationDate)
    fin.setHours(heureFinH, heureFinM, 0, 0)

    return now >= debut && now <= fin
  })

  /**
   * Récupère le statut de la consultation
   */
  const status = computed<'future' | 'live' | 'replay'>(() => {
    if (isOngoing.value) return 'live'
    if (isFuture.value) return 'future'
    return 'replay'
  })

  /**
   * Filtre les consultations par catégorie
   */
  const getConsultationsByCategorie = (
    categorie: CategorieConsultation
  ): PlayerConsultation[] => {
    return data.consultations.filter((c) => c.categorie === categorie)
  }

  /**
   * Filtre les consultations par statut
   */
  const getConsultationsByStatus = (
    statusFilter: 'future' | 'live' | 'replay'
  ): PlayerConsultation[] => {
    return data.consultations.filter((c) => {
      if (statusFilter === 'live') return c.isLive
      if (statusFilter === 'replay') return c.isReplay

      // Pour 'future', vérifier la date
      const consultationDate = new Date(c.date)
      return consultationDate > new Date() && !c.isLive
    })
  }

  /**
   * Récupère les dernières consultations (triées par date décroissante)
   */
  const getLatestConsultations = (limit?: number): PlayerConsultation[] => {
    const sorted = [...data.consultations].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return limit ? sorted.slice(0, limit) : sorted
  }

  /**
   * Recherche de consultations par titre ou description
   */
  const searchConsultations = (query: string): PlayerConsultation[] => {
    const lowerQuery = query.toLowerCase()
    return data.consultations.filter(
      (c) =>
        c.titre.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery)
    )
  }

  return {
    // Données
    consultation,
    allConsultations,
    configuration,

    // États
    isLive,
    isReplay,
    hasDossier,
    status,
    isFuture,
    isOngoing,

    // Formatage
    categorieBadge,
    dureeFormatee,
    horaireComplet,

    // Annexes
    annexesGratuitesPremium,
    annexesPayantes,
    prixTotalAnnexes,

    // Contrôle d'accès
    getAccessRights,
    hasAccess,

    // Méthodes de filtrage
    getConsultationsByCategorie,
    getConsultationsByStatus,
    getLatestConsultations,
    searchConsultations,

    // Utilitaires
    formatDuree
  }
}
