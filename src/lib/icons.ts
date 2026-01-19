/**
 * Fichier centralise des icones FontAwesome
 *
 * Importe uniquement les icones utilisees dans le projet pour optimiser le bundle.
 * Au lieu d'importer tout le kit (~49MB), on importe individuellement (~quelques KB).
 *
 * Usage dans les composants:
 * import { icons } from '@/lib/icons'
 * const myIcon = icons.fas.arrowDown
 */

// ============================================================================
// SOLID (fas) - Classic Solid Icons
// ============================================================================
import {
  faArrowDown,
  faArrowDownShortWide,
  faArrowLeft,
  faArrowRight,
  faArrowRightFromBracket,
  faBars,
  faBasketShopping,
  faBolt,
  faBook,
  faBookOpenLines,
  faBox,
  faCalculator,
  faCalendar,
  faCalendarAlt,
  faCalendarDays,
  faCalendarPlus,
  faCartPlus,
  faCartShopping,
  faChartLine,
  faCheck,
  faCheckCircle,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCircle,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faCirclePlay,
  faCircleQuestion,
  faClock as faClockSolid,
  faCoins,
  faComments,
  faCompass,
  faCreditCard,
  faCrown,
  faDownload as faDownloadSolid,
  faEnvelope,
  faEnvelopeOpenText,
  faEuroSign,
  faExclamationTriangle,
  faExpand,
  faEye,
  faEyeSlash,
  faFileContract,
  faFileInvoice,
  faFileLines as faFileLinesSolid,
  faFilePdf,
  faFolder,
  faGift,
  faGraduationCap as faGraduationCapSolid,
  faHandshake,
  faHeart as faHeartSolid,
  faHome,
  faInfinity,
  faInfoCircle,
  faKey,
  faLightbulb,
  faLocationDot,
  faLock,
  faMagnifyingGlass,
  faMedal,
  faPen,
  faPhone,
  faPlay,
  faPlayCircle,
  faPlus as faPlusSolid,
  faPrint,
  faQuoteLeft,
  faRightToBracket,
  faShareNodes,
  faShieldAlt,
  faShieldCheck,
  faShieldHalved,
  faShippingFast,
  faShoppingBag,
  faShoppingCart,
  faSliders,
  faSpinner,
  faSquareCheck,
  faStar,
  faTag,
  faTimes,
  faTimesCircle,
  faTrash,
  faTriangleExclamation,
  faTruck,
  faUmbrellaBeach,
  faUndo,
  faUser,
  faUserCircle,
  faUserPlus,
  faUserSecret,
  faUsers,
  faVideo,
  faXmark,
} from '@awesome.me/kit-0aac173ed2/icons/classic/solid'

// ============================================================================
// REGULAR (far) - Classic Regular Icons
// ============================================================================
import {
  faClock as faClockRegular,
  faDownload as faDownloadRegular,
  faFileLines as faFileLinesRegular,
  faGraduationCap as faGraduationCapRegular,
  faHeart as faHeartRegular,
  faNewspaper,
  faPlus as faPlusRegular,
  faShare,
  faSquare,
} from '@awesome.me/kit-0aac173ed2/icons/classic/regular'

// ============================================================================
// BRANDS (fab) - Brand Icons
// ============================================================================
import {
  faYoutube,
} from '@awesome.me/kit-0aac173ed2/icons/classic/brands'

// ============================================================================
// KIT CUSTOM (fak) - Custom Kit Icons
// ============================================================================
import {
  faConsultationsNd,
} from '@awesome.me/kit-0aac173ed2/icons/kit/custom'

// ============================================================================
// EXPORTS - Organises par prefixe pour compatibilite avec l'ancien code
// ============================================================================

/**
 * Icones Solid (fas)
 * Usage: icons.fas.arrowDown ou icons.fas['arrow-down']
 */
export const fas = {
  // Arrows
  'arrow-down': faArrowDown,
  'arrow-down-short-wide': faArrowDownShortWide,
  'arrow-left': faArrowLeft,
  'arrow-right': faArrowRight,
  'arrow-right-from-bracket': faArrowRightFromBracket,

  // Navigation
  'bars': faBars,
  'chevron-down': faChevronDown,
  'chevron-left': faChevronLeft,
  'chevron-right': faChevronRight,
  'home': faHome,
  'magnifying-glass': faMagnifyingGlass,

  // Shopping
  'basket-shopping': faBasketShopping,
  'cart-plus': faCartPlus,
  'cart-shopping': faCartShopping,
  'shopping-bag': faShoppingBag,
  'shopping-cart': faShoppingCart,
  'tag': faTag,
  'credit-card': faCreditCard,
  'euro-sign': faEuroSign,

  // User
  'user': faUser,
  'user-circle': faUserCircle,
  'user-plus': faUserPlus,
  'user-secret': faUserSecret,
  'users': faUsers,
  'right-to-bracket': faRightToBracket,

  // Calendar & Time
  'calendar': faCalendar,
  'calendar-alt': faCalendarAlt,
  'calendar-days': faCalendarDays,
  'calendar-plus': faCalendarPlus,
  'clock': faClockSolid,

  // Files & Documents
  'book': faBook,
  'book-open-lines': faBookOpenLines,
  'file-contract': faFileContract,
  'file-invoice': faFileInvoice,
  'file-lines': faFileLinesSolid,
  'file-pdf': faFilePdf,
  'folder': faFolder,
  'envelope': faEnvelope,
  'envelope-open-text': faEnvelopeOpenText,

  // Media
  'play': faPlay,
  'play-circle': faPlayCircle,
  'circle-play': faCirclePlay,
  'video': faVideo,
  'expand': faExpand,

  // Actions
  'check': faCheck,
  'check-circle': faCheckCircle,
  'circle-check': faCircleCheck,
  'square-check': faSquareCheck,
  'plus': faPlusSolid,
  'times': faTimes,
  'times-circle': faTimesCircle,
  'xmark': faXmark,
  'trash': faTrash,
  'pen': faPen,
  'download': faDownloadSolid,
  'print': faPrint,
  'share-nodes': faShareNodes,
  'undo': faUndo,
  'eye': faEye,
  'eye-slash': faEyeSlash,

  // Status & Info
  'circle': faCircle,
  'circle-exclamation': faCircleExclamation,
  'circle-info': faCircleInfo,
  'circle-question': faCircleQuestion,
  'exclamation-triangle': faExclamationTriangle,
  'triangle-exclamation': faTriangleExclamation,
  'info-circle': faInfoCircle,
  'spinner': faSpinner,

  // Security
  'lock': faLock,
  'key': faKey,
  'shield-alt': faShieldAlt,
  'shield-check': faShieldCheck,
  'shield-halved': faShieldHalved,

  // Business & Finance
  'box': faBox,
  'calculator': faCalculator,
  'chart-line': faChartLine,
  'coins': faCoins,
  'handshake': faHandshake,

  // Communication
  'comments': faComments,
  'phone': faPhone,
  'quote-left': faQuoteLeft,

  // Misc
  'bolt': faBolt,
  'compass': faCompass,
  'crown': faCrown,
  'gift': faGift,
  'graduation-cap': faGraduationCapSolid,
  'heart': faHeartSolid,
  'infinity': faInfinity,
  'lightbulb': faLightbulb,
  'location-dot': faLocationDot,
  'medal': faMedal,
  'shipping-fast': faShippingFast,
  'sliders': faSliders,
  'star': faStar,
  'truck': faTruck,
  'umbrella-beach': faUmbrellaBeach,
} as const

/**
 * Icones Regular (far)
 * Usage: icons.far.clock ou icons.far['clock']
 */
export const far = {
  'clock': faClockRegular,
  'download': faDownloadRegular,
  'file-lines': faFileLinesRegular,
  'graduation-cap': faGraduationCapRegular,
  'heart': faHeartRegular,
  'newspaper': faNewspaper,
  'plus': faPlusRegular,
  'share': faShare,
  'square': faSquare,
} as const

/**
 * Icones Brands (fab)
 * Usage: icons.fab.youtube ou icons.fab['youtube']
 */
export const fab = {
  'youtube': faYoutube,
} as const

/**
 * Icones Custom Kit (fak)
 * Usage: icons.fak['consultations-nd']
 */
export const fak = {
  'consultations-nd': faConsultationsNd,
} as const

/**
 * Export principal - Compatible avec l'ancien pattern byPrefixAndName
 *
 * Les composants utilisent: byPrefixAndName.fas?.['arrow-down']
 * On garde le meme nom pour minimiser les changements
 */
export const byPrefixAndName = {
  fas,
  far,
  fab,
  fak,
} as const

// Alias pour nouveau code
export const icons = byPrefixAndName

// Export par defaut
export default byPrefixAndName
