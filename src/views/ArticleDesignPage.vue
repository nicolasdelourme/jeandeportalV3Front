<script setup lang="ts">
/**
 * Page de test TipTap - Design Preview
 * Permet de visualiser et ajuster les styles CSS des blocs TipTap
 */
import { ref } from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ProseContent } from '@/components/ui/prose-content'

type ThemeType = 'metaux' | 'portefeuille' | 'liberte' | 'bonus'

const selectedTheme = ref<ThemeType>('metaux')

const themes: { id: ThemeType; label: string; color: string }[] = [
    { id: 'metaux', label: 'Metaux', color: 'metaux' },
    { id: 'portefeuille', label: 'Portefeuille', color: 'portefeuille' },
    { id: 'liberte', label: 'Liberte', color: 'liberte' },
    { id: 'bonus', label: 'Bonus', color: 'bonus' },
]

const setTheme = (theme: ThemeType) => {
    selectedTheme.value = theme
}

// Exemple de contenu TipTap avec table HTML
const tiptapContent = `
<h1>Titre Principal (h1)</h1>
<p>
    Paragraphe d'introduction avec du texte <strong>en gras</strong>,
    en <em>italique</em>, <u>souligne</u> et <s>barre</s>.
    Voici un <a href="#">lien thematique</a> et du texte <mark>surligne</mark>.
</p>

<h2>Sous-titre (h2)</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

<h3>Section (h3)</h3>
<ul>
    <li>Premier element de liste</li>
    <li>Deuxieme element avec sous-liste
        <ul>
            <li>Sous-element A</li>
            <li>Sous-element B</li>
        </ul>
    </li>
    <li>Troisieme element</li>
</ul>

<h4>Sous-section (h4)</h4>
<ol>
    <li>Premiere etape</li>
    <li>Deuxieme etape</li>
    <li>Troisieme etape</li>
</ol>

<blockquote>
    <p>"L'or est la monnaie ultime, celle que les gouvernements ne peuvent pas devaluer."</p>
</blockquote>

<h5>Note technique (h5)</h5>
<p>Utilisez le code <code>const ratio = prix_or / prix_argent;</code> pour calculer le ratio.</p>

<pre><code>// Exemple de code block
function calculateRatio(gold, silver) {
  return gold / silver;
}

const ratio = calculateRatio(2000, 25);
console.log(ratio); // 80</code></pre>

<h6>Donnees comparatives (h6)</h6>
<table>
    <thead>
        <tr>
            <th>Critere</th>
            <th>Or</th>
            <th>Argent</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Volatilite</td>
            <td>Faible</td>
            <td>Moyenne</td>
        </tr>
        <tr>
            <td>Stockage</td>
            <td>Facile</td>
            <td>Volumineux</td>
        </tr>
        <tr>
            <td>Liquidite</td>
            <td>Excellente</td>
            <td>Bonne</td>
        </tr>
    </tbody>
</table>

<figure>
    <img src="https://placehold.co/800x400/F2CC00/1D1D1D?text=Image+Article" alt="Illustration" />
    <figcaption>Legende de l'image avec description</figcaption>
</figure>
`
</script>

<template>
    <DefaultLayout>
        <!-- Hero Section -->
        <section class="bg-white py-12">
            <div class="max-w-4xl mx-auto px-4">
                <h1 class="font-heading text-3xl md:text-4xl font-bold text-neutral-800 mb-2">
                    Design des Blocs Article
                </h1>
                <p class="text-neutral-600 mb-6">
                    Preview des styles TipTap avec ProseContent (tables converties en shadcn)
                </p>

                <!-- Selecteur de theme -->
                <div class="flex flex-wrap gap-2">
                    <Button
                        v-for="theme in themes"
                        :key="theme.id"
                        :color="theme.color"
                        :variant="selectedTheme === theme.id ? 'default' : 'outline'"
                        size="sm"
                        @click="setTheme(theme.id)"
                    >
                        {{ theme.label }}
                    </Button>
                </div>
            </div>
        </section>

        <!-- Content with ProseContent -->
        <section class="bg-neutral-50 py-16" :class="['theme-' + selectedTheme]">
            <div class="max-w-4xl mx-auto px-4">
                <ProseContent :html="tiptapContent" />

                <Separator class="my-12" />

                <!-- Chart Placeholder -->
                <div>
                    <h3 class="font-heading font-bold text-xl mb-4">Graphique (placeholder)</h3>
                    <Skeleton class="h-64 w-full rounded-sm" />
                    <p class="text-center text-muted-foreground mt-2 text-sm">
                        Graphique Highcharts (a implementer)
                    </p>
                </div>
            </div>
        </section>
    </DefaultLayout>
</template>
