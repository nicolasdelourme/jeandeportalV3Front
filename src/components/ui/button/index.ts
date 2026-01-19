import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Button } from "./Button.vue";

export const buttonVariants = cva(
    // Base styles - reprend le design de .button de JDP
    "inline-block relative cursor-pointer outline-none whitespace-nowrap transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider font-bold",
    {
        variants: {
            variant: {
                default:
                    "text-primary-foreground border-none hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2",
                secondary:
                    "bg-secondary text-secondary-foreground border-none hover:shadow-lg hover:text-primary focus-visible:ring-2 focus-visible:ring-offset-2",
                outline:
                    "border focus-visible:ring-2 focus-visible:ring-offset-2 hover:text-white",
                ghost: "border-none bg-transparent hover:bg-opacity-10 focus-visible:ring-2 focus-visible:ring-offset-2",
                link: "border-none bg-transparent underline-offset-4 hover:underline normal-case tracking-normal font-semibold",
            },
            size: {
                // Tailles basées sur les specs JDP
                xs: "h-7 px-3 text-xs",
                sm: "h-8 px-4 text-xs ",
                default: "h-10 px-5 text-sm ", // 40px hauteur original
                lg: "h-12 px-6 text-base ",
                xl: "h-14 px-8 text-lg ",
                icon: "size-10",
                "icon-sm": "size-8",
                "icon-lg": "size-12",
            },
            rounded: {
                none: "rounded-none",
                sm: "rounded-sm", // 3px comme le .button-rounded original
                default: "rounded",
                lg: "rounded-lg",
                full: "rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            rounded: "sm", // 3px par défaut comme dans JDP
        },
    }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
