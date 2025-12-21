import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Badge } from "./Badge.vue"

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
         "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",

        // ═══ Legacy: Consultations ND (rétro-compatibilité) ═══
        metaux:
          "border-transparent bg-consultations-nd-metauxprecieux text-white [a&]:hover:bg-consultations-nd-metauxprecieux/90",
        argent:
          "border-transparent bg-consultations-nd-argent text-white [a&]:hover:bg-consultations-nd-argent/90",
        patrimoine:
          "border-transparent bg-consultations-nd-patrimoine text-white [a&]:hover:bg-consultations-nd-patrimoine/90",
        immobilier:
          "border-transparent bg-consultations-nd-immobilier text-white [a&]:hover:bg-consultations-nd-immobilier/90",

        // ═══ Thématiques Infocash Académie ═══
        // Filled variants (fond coloré)
        "theme-metaux":
          "border-transparent bg-theme-metaux text-foreground [a&]:hover:bg-theme-metaux/90",
        "theme-portefeuille":
          "border-transparent bg-theme-portefeuille text-foreground [a&]:hover:bg-theme-portefeuille/90",
        "theme-liberte":
          "border-transparent bg-theme-liberte text-foreground [a&]:hover:bg-theme-liberte/90",
        "theme-bonus":
          "border-transparent bg-theme-bonus text-white [a&]:hover:bg-theme-bonus/90",

        // Outlined variants (bordure colorée, fond blanc - style Figma)
        "theme-metaux-outline":
          "border-theme-metaux bg-white text-foreground [a&]:hover:bg-theme-metaux-light",
        "theme-portefeuille-outline":
          "border-theme-portefeuille bg-white text-foreground [a&]:hover:bg-theme-portefeuille-light",
        "theme-liberte-outline":
          "border-theme-liberte bg-white text-foreground [a&]:hover:bg-theme-liberte-light",
        "theme-bonus-outline":
          "border-theme-bonus bg-white text-foreground [a&]:hover:bg-theme-bonus-light",

        // Soft variants (fond clair)
        "theme-metaux-soft":
          "border-transparent bg-theme-metaux-light text-foreground",
        "theme-portefeuille-soft":
          "border-transparent bg-theme-portefeuille-light text-foreground",
        "theme-liberte-soft":
          "border-transparent bg-theme-liberte-light text-foreground",
        "theme-bonus-soft":
          "border-transparent bg-theme-bonus-light text-foreground",

        // Accès badges (style Figma - Accès Abonnés)
        "access-subscriber":
          "border-transparent bg-theme-metaux-light text-foreground font-semibold",
        "access-restricted":
          "border-destructive bg-destructive/10 text-destructive font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)
export type BadgeVariants = VariantProps<typeof badgeVariants>
