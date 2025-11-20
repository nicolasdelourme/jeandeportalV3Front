/**
 * Types pour la page Player des consultations
 *
 * Ces types définissent la structure complète des données nécessaires
 * pour afficher une consultation en direct ou en replay.
 */

export type CategorieConsultation = 'argent' | 'metaux' | 'patrimoine' | 'immobilier';

export type VisibiliteConsultation = 'public' | 'restricted' | 'premium';

export type IconeType = 'pdf' | 'guide' | 'rapport';

/**
 * Informations sur un participant à la consultation
 */
export interface Participant {
  nom: string;
  role: string;
  photo?: string;
}

/**
 * Chapitre d'une vidéo (pour navigation rapide en replay)
 */
export interface Chapitre {
  titre: string;
  timestamp: string; // Format HH:MM:SS
  duree: string; // Format HH:MM:SS
}

/**
 * Dossier de consultation (disponible uniquement en replay)
 */
export interface DossierConsultation {
  titre: string;
  description: string;
  urlPdf?: string;
  urlExcel?: string;
  urlPowerPoint?: string;
  tailleMb?: number;
  datePublication?: string;
}

/**
 * Annexe (dossier lié à la consultation)
 */
export interface Annexe {
  id: number;
  titre: string;
  description: string;
  prix: number;
  notation: number; // Note sur 5
  couleurIcone: string; // Couleur hex
  urlAchat: string;
  iconeType: IconeType;
  gratuitAbonnement?: boolean;
}

/**
 * Promotion pour l'abonnement Premium
 */
export interface AbonnementPromo {
  titre: string;
  avantages: string[];
  offreSpeciale?: string;
  ctaTexte: string;
  ctaUrl: string;
}

/**
 * Métadonnées spécifiques pour consultation en direct
 */
export interface MetadataLive {
  nombreInscrits: number;
  rappelEnvoye: boolean;
  chatActif: boolean;
  questionsOuvertes: boolean;
  enregistrementDisponible: boolean;
}

/**
 * Métadonnées spécifiques pour consultation en replay
 */
export interface MetadataReplay {
  nombreVues: number;
  dureeReelle: number; // En minutes
  chapitres?: Chapitre[];
  questionsRepondues?: number;
  documentsPartages?: number;
  enregistrementDisponible: boolean;
  transcriptionDisponible?: boolean;
}

/**
 * Structure complète d'une consultation
 */
export interface PlayerConsultation {
  // Informations principales
  id: number;
  titre: string;
  description: string;
  categorie: CategorieConsultation;

  // Informations temporelles
  date: string; // Format ISO YYYY-MM-DD
  dateFormatted: string;
  heureDebut: string; // Format HH:MM
  heureFin: string; // Format HH:MM
  dureeMinutes: number;

  // Participants
  participants: Participant[];

  // Vidéo
  videoId: string; // ID YouTube
  isLive: boolean;
  isReplay: boolean;

  // Dossier (uniquement en replay)
  dossier: DossierConsultation | null;

  // Annexes
  annexes: Annexe[];

  // Promotion abonnement
  abonnementPromo: AbonnementPromo;

  // Visibilité et accès
  visibilite: VisibiliteConsultation;

  // Métadonnées additionnelles
  metadata: MetadataLive | MetadataReplay;
}

/**
 * Configuration du player vidéo
 */
export interface PlayerSettings {
  autoplay: boolean;
  qualiteParDefaut: string;
  sousTitresActifs: boolean;
  vitesseLecture: number;
  volumeParDefaut: number;
}

/**
 * Configuration du chat en direct
 */
export interface ChatSettings {
  actif: boolean;
  moderationActive: boolean;
  delaiMessages: number; // En secondes
  maxCaracteres: number;
  emoticonsActives: boolean;
}

/**
 * Droits d'accès par niveau
 */
export interface AccessRights {
  voirVideo: boolean;
  voirChat: boolean;
  poserQuestions: boolean;
  telechargerDossier: boolean;
  voirAnnexes: boolean;
  acheterAnnexes: boolean;
}

/**
 * Contrôle d'accès global
 */
export interface AccessControl {
  public: AccessRights;
  restricted: AccessRights;
  premium: AccessRights;
}

/**
 * Configuration complète de l'application
 */
export interface PlayerConfiguration {
  playerSettings: PlayerSettings;
  chatSettings: ChatSettings;
  accessControl: AccessControl;
}

/**
 * Structure racine du fichier JSON
 */
export interface PlayerConsultationData {
  consultations: PlayerConsultation[];
  configuration: PlayerConfiguration;
}

/**
 * Helper pour vérifier le type de métadonnées
 */
export function isMetadataLive(metadata: MetadataLive | MetadataReplay): metadata is MetadataLive {
  return 'nombreInscrits' in metadata;
}

export function isMetadataReplay(metadata: MetadataLive | MetadataReplay): metadata is MetadataReplay {
  return 'nombreVues' in metadata;
}
