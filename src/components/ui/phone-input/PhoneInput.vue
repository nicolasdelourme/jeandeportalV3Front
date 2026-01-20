<script setup lang="ts">
/**
 * PhoneInput - Composant téléphone international
 * Basé sur intl-tel-input avec style shadcn
 */
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import intlTelInput from 'intl-tel-input'
import type { Iti } from 'intl-tel-input'
import 'intl-tel-input/build/css/intlTelInput.css'
import { cn } from '@/lib/utils'

interface Props {
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    initialCountry?: string
    preferredCountries?: string[]
    class?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: '',
    disabled: false,
    initialCountry: 'fr',
    preferredCountries: () => ['fr', 'be', 'ch', 'ca'],
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'validityChange': [isValid: boolean]
    'countryChange': [countryData: unknown]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const iti = ref<Iti | null>(null)
const isValid = ref(true)
const isFocused = ref(false)

// Références pour le cleanup des event listeners
let inputHandler: (() => void) | null = null
let countryChangeHandler: (() => void) | null = null

/**
 * Classes CSS pour l'input (style shadcn)
 */
const inputClasses = computed(() => cn(
    // Base shadcn input styles
    'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
    'flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    // Focus styles
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    // Validation styles
    !isValid.value && 'ring-destructive/20 dark:ring-destructive/40 border-destructive',
    isValid.value && 'border-input',
    // Custom padding for flag
    'pl-[52px]',
    props.class
))

/**
 * Mettre à jour le numéro formaté
 */
const updateNumber = () => {
    if (!iti.value) return

    // Récupérer le numéro au format E.164 (international)
    const number = iti.value.getNumber()
    emit('update:modelValue', number)

    // Vérifier la validité
    const validResult = iti.value.isValidNumber()
    const valid = validResult === true
    isValid.value = valid || !inputRef.value?.value // Valid si vide ou numéro valide
    emit('validityChange', valid)
}

/**
 * Initialiser intl-tel-input
 */
onMounted(() => {
    if (!inputRef.value) return

    iti.value = intlTelInput(inputRef.value, {
        initialCountry: props.initialCountry as 'fr' | 'be' | 'ch' | 'ca',
        countryOrder: props.preferredCountries as ('fr' | 'be' | 'ch' | 'ca')[],
        separateDialCode: false,
        formatAsYouType: true,
        nationalMode: false,
        autoPlaceholder: 'aggressive',
        i18n: {
            searchPlaceholder: 'Rechercher un pays',
            fr: 'France',
            be: 'Belgique',
            ch: 'Suisse',
            ca: 'Canada',
        },
        loadUtils: () => import('intl-tel-input/utils'),
    })

    // Définir la valeur initiale si présente
    if (props.modelValue) {
        iti.value.setNumber(props.modelValue)
    }

    // Définir les handlers pour pouvoir les supprimer dans onUnmounted
    inputHandler = updateNumber
    countryChangeHandler = () => {
        if (iti.value) {
            emit('countryChange', iti.value.getSelectedCountryData())
            updateNumber()
        }
    }

    // Écouter les événements
    inputRef.value.addEventListener('input', inputHandler)
    inputRef.value.addEventListener('countrychange', countryChangeHandler)
})

/**
 * Watcher pour mettre à jour depuis l'extérieur
 */
watch(() => props.modelValue, (newValue) => {
    if (iti.value && newValue !== iti.value.getNumber()) {
        iti.value.setNumber(newValue || '')
    }
})

/**
 * Cleanup - supprimer les event listeners et détruire l'instance
 */
onUnmounted(() => {
    // Supprimer les event listeners
    if (inputRef.value) {
        if (inputHandler) {
            inputRef.value.removeEventListener('input', inputHandler)
        }
        if (countryChangeHandler) {
            inputRef.value.removeEventListener('countrychange', countryChangeHandler)
        }
    }

    // Détruire l'instance intl-tel-input
    if (iti.value) {
        iti.value.destroy()
    }

    // Nettoyer les références
    inputHandler = null
    countryChangeHandler = null
})

const handleFocus = () => {
    isFocused.value = true
}

const handleBlur = () => {
    isFocused.value = false
    updateNumber()
}
</script>

<template>
    <div class="phone-input-wrapper relative">
        <input
            ref="inputRef"
            type="tel"
            :placeholder="placeholder"
            :disabled="disabled"
            :class="inputClasses"
            @focus="handleFocus"
            @blur="handleBlur"
        />
    </div>
</template>

<style>
/* Override intl-tel-input styles pour matcher shadcn */
.phone-input-wrapper .iti {
    width: 100%;
}

.phone-input-wrapper .iti__country-container {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    padding: 1px;
}

.phone-input-wrapper .iti__selected-country {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 6px 0 8px;
    border-radius: calc(var(--radius) - 1px) 0 0 calc(var(--radius) - 1px);
    background: transparent;
    cursor: pointer;
}

.phone-input-wrapper .iti__selected-country:hover {
    background: hsl(var(--muted));
}

.phone-input-wrapper .iti__selected-country:focus {
    outline: none;
}

.phone-input-wrapper .iti__arrow {
    margin-left: 4px;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-top: 4px solid hsl(var(--foreground) / 0.5);
}

.phone-input-wrapper .iti__arrow--up {
    border-top: none;
    border-bottom: 4px solid hsl(var(--foreground) / 0.5);
}
</style>

<!-- Styles globaux pour le dropdown (rendu hors du composant) -->
<style>
/* Dropdown container - fond blanc obligatoire */
.iti__dropdown-content {
    background-color: white !important;
    background: white !important;
    border: 1px solid #e5e5e5 !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
    margin-top: 4px !important;
    max-height: 300px !important;
    overflow-y: auto !important;
    z-index: 9999 !important;
}

/* Search input - padding-left pour la loupe */
.iti__search-input {
    width: 100% !important;
    padding: 8px 12px 8px 32px !important;
    border: none !important;
    border-bottom: 1px solid #e5e5e5 !important;
    background: white !important;
    font-size: 14px !important;
    outline: none !important;
    color: #171717 !important;
}

/* Icône loupe dans la recherche */
.iti__search-container {
    position: relative !important;
    background: white !important;
}

.iti__search-container .iti__search-icon {
    position: absolute !important;
    left: 10px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    width: 14px !important;
    height: 14px !important;
    color: #a3a3a3 !important;
    pointer-events: none !important;
}

.iti__search-input:focus {
    outline: none !important;
    box-shadow: none !important;
}

.iti__search-input::placeholder {
    color: #a3a3a3 !important;
}

/* Country list */
.iti__country-list {
    list-style: none !important;
    padding: 4px 0 !important;
    margin: 0 !important;
    background: white !important;
}

/* Country item */
.iti__country {
    display: flex !important;
    align-items: center !important;
    padding: 8px 12px !important;
    cursor: pointer !important;
    font-size: 14px !important;
    color: #171717 !important;
    background: white !important;
}

.iti__country:hover {
    background: #f5f5f5 !important;
}

.iti__country--highlight {
    background: #f5f5f5 !important;
}

/* Flag box */
.iti__flag-box {
    margin-right: 8px !important;
}

/* Country name */
.iti__country-name {
    flex: 1 !important;
    margin-right: 8px !important;
    color: #171717 !important;
}

/* Dial code */
.iti__dial-code {
    color: #737373 !important;
}

/* No results */
.iti__no-results {
    padding: 8px 12px !important;
    color: #737373 !important;
    font-size: 14px !important;
    background: white !important;
}

/* Divider for preferred countries */
.iti__divider {
    border-bottom: 1px solid #e5e5e5 !important;
    margin: 4px 0 !important;
    padding: 0 !important;
    background: transparent !important;
}
</style>
