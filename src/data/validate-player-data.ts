/**
 * Script de validation des données de consultation Player
 * Vérifie que le fichier player-consultation.json est valide
 *
 * Usage: npm run validate:player-data
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import type { PlayerConsultationData } from '../types/player-consultation.types'

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function validatePlayerData() {
  try {
    log('\n🔍 Validation des données player-consultation.json...', colors.blue)

    // Lire le fichier JSON
    const filePath = join(__dirname, 'player-consultation.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    const data: PlayerConsultationData = JSON.parse(fileContent)

    // Validation de la structure racine
    if (!data.consultations) {
      throw new Error('❌ Propriété "consultations" manquante')
    }
    if (!data.configuration) {
      throw new Error('❌ Propriété "configuration" manquante')
    }

    log(`✅ Structure racine valide`, colors.green)
    log(`   - ${data.consultations.length} consultation(s) trouvée(s)`, colors.green)

    // Validation de la configuration
    if (!data.configuration.playerSettings) {
      throw new Error('❌ Propriété "configuration.playerSettings" manquante')
    }
    if (!data.configuration.chatSettings) {
      throw new Error('❌ Propriété "configuration.chatSettings" manquante')
    }
    if (!data.configuration.accessControl) {
      throw new Error('❌ Propriété "configuration.accessControl" manquante')
    }

    log(`✅ Configuration valide`, colors.green)

    // Validation de l'accessControl
    const requiredLevels = ['public', 'restricted', 'premium']
    for (const level of requiredLevels) {
      if (!data.configuration.accessControl[level as keyof typeof data.configuration.accessControl]) {
        throw new Error(`❌ Niveau d'accès "${level}" manquant dans accessControl`)
      }
    }

    log(`✅ Contrôle d'accès valide (3 niveaux: public, restricted, premium)`, colors.green)

    // Validation des consultations (si présentes)
    if (data.consultations.length > 0) {
      log(`\n📋 Validation des consultations individuelles...`, colors.blue)

      data.consultations.forEach((consultation, index) => {
        const requiredFields = [
          'id', 'titre', 'description', 'categorie', 'date',
          'dateFormatted', 'heureDebut', 'heureFin', 'dureeMinutes',
          'participants', 'videoId', 'isLive', 'isReplay',
          'dossier', 'annexes', 'abonnementPromo', 'visibilite', 'metadata'
        ]

        for (const field of requiredFields) {
          if (!(field in consultation)) {
            throw new Error(`❌ Consultation ${index + 1}: champ "${field}" manquant`)
          }
        }

        log(`   ✅ Consultation ${index + 1}: "${consultation.titre}" valide`, colors.green)
      })
    } else {
      log(`\n⚠️  Aucune consultation dans le fichier (structure vide mais valide)`, colors.yellow)
    }

    // Résultat final
    log(`\n${'='.repeat(60)}`, colors.green)
    log(`✅ VALIDATION RÉUSSIE !`, colors.green)
    log(`${'='.repeat(60)}\n`, colors.green)

    process.exit(0)

  } catch (error) {
    log(`\n${'='.repeat(60)}`, colors.red)
    log(`❌ VALIDATION ÉCHOUÉE !`, colors.red)
    log(`${'='.repeat(60)}`, colors.red)

    if (error instanceof Error) {
      log(`\n${error.message}\n`, colors.red)
    } else {
      log(`\nErreur inconnue: ${String(error)}\n`, colors.red)
    }

    process.exit(1)
  }
}

// Exécuter la validation
validatePlayerData()
