<script setup lang="ts">
/**
 * Page Politique de Cookies
 * Conforme à la directive ePrivacy et au RGPD
 */
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
</script>

<template>
    <DefaultLayout>
        <section class="min-h-screen bg-white py-12 md:py-16 px-4">
            <div class="max-w-3xl mx-auto">
                <!-- Titre principal -->
                <h1 class="font-heading text-3xl md:text-4xl font-bold text-neutral-900 mb-8 pb-4 border-b-2 border-primary">
                    Politique de cookies
                </h1>

                <!-- Dernière mise à jour -->
                <p class="text-sm text-neutral-500 mb-8">
                    Dernière mise à jour : Janvier 2026
                </p>

                <div class="prose prose-neutral max-w-none">
                    <!-- Introduction -->
                    <section class="mb-10">
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Cette politique de cookies explique ce que sont les cookies, comment
                            <strong>Infocash</strong> les utilise sur le site
                            <strong>infocash.fr</strong> (ci-après « le Site ») et comment
                            vous pouvez les gérer.
                        </p>
                    </section>

                    <!-- Article 1 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            1. Qu'est-ce qu'un cookie ?
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur,
                            tablette, smartphone) lors de votre visite sur un site web. Il permet au site
                            de mémoriser vos actions et préférences (identifiant de connexion, langue,
                            taille d'affichage, etc.) pendant une durée déterminée.
                        </p>
                        <p class="text-neutral-600 leading-relaxed">
                            Les cookies peuvent être « de session » (supprimés à la fermeture du navigateur)
                            ou « persistants » (conservés pendant une période définie).
                        </p>
                    </section>

                    <!-- Article 2 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            2. Cookies utilisés sur le Site
                        </h2>

                        <!-- 2.1 Cookies essentiels -->
                        <div class="mb-6">
                            <h3 class="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                                <span class="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                                2.1 Cookies strictement nécessaires (essentiels)
                            </h3>
                            <p class="text-neutral-600 leading-relaxed mb-4">
                                Ces cookies sont indispensables au fonctionnement du Site. Ils ne peuvent
                                pas être désactivés. Ils ne nécessitent pas votre consentement.
                            </p>
                            <div class="overflow-x-auto">
                                <table class="min-w-full border border-neutral-200 rounded-lg overflow-hidden text-sm">
                                    <thead class="bg-neutral-100">
                                        <tr>
                                            <th class="px-3 py-2 text-left font-semibold text-neutral-700">Cookie</th>
                                            <th class="px-3 py-2 text-left font-semibold text-neutral-700">Finalité</th>
                                            <th class="px-3 py-2 text-left font-semibold text-neutral-700">Durée</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-neutral-200">
                                        <tr>
                                            <td class="px-3 py-2 text-neutral-600 font-mono text-xs">auth_token</td>
                                            <td class="px-3 py-2 text-neutral-600">Authentification utilisateur (JWT HttpOnly)</td>
                                            <td class="px-3 py-2 text-neutral-600">Session / 30 jours (si "Se souvenir de moi")</td>
                                        </tr>
                                        <tr>
                                            <td class="px-3 py-2 text-neutral-600 font-mono text-xs">cart_id</td>
                                            <td class="px-3 py-2 text-neutral-600">Identification du panier</td>
                                            <td class="px-3 py-2 text-neutral-600">7 jours</td>
                                        </tr>
                                        <tr>
                                            <td class="px-3 py-2 text-neutral-600 font-mono text-xs">XSRF-TOKEN</td>
                                            <td class="px-3 py-2 text-neutral-600">Protection contre les attaques CSRF</td>
                                            <td class="px-3 py-2 text-neutral-600">Session</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- 2.2 Cookies fonctionnels -->
                        <div class="mb-6">
                            <h3 class="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                                <span class="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                                2.2 Cookies fonctionnels (préférences)
                            </h3>
                            <p class="text-neutral-600 leading-relaxed mb-4">
                                Ces cookies permettent d'améliorer votre expérience en mémorisant vos préférences.
                            </p>
                            <div class="overflow-x-auto">
                                <table class="min-w-full border border-neutral-200 rounded-lg overflow-hidden text-sm">
                                    <thead class="bg-neutral-100">
                                        <tr>
                                            <th class="px-3 py-2 text-left font-semibold text-neutral-700">Cookie</th>
                                            <th class="px-3 py-2 text-left font-semibold text-neutral-700">Finalité</th>
                                            <th class="px-3 py-2 text-left font-semibold text-neutral-700">Durée</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-neutral-200">
                                        <tr>
                                            <td class="px-3 py-2 text-neutral-600 font-mono text-xs">video_quality</td>
                                            <td class="px-3 py-2 text-neutral-600">Préférences de lecture vidéo</td>
                                            <td class="px-3 py-2 text-neutral-600">1 an</td>
                                        </tr>
                                        <tr>
                                            <td class="px-3 py-2 text-neutral-600 font-mono text-xs">theme_preference</td>
                                            <td class="px-3 py-2 text-neutral-600">Thème d'affichage (si applicable)</td>
                                            <td class="px-3 py-2 text-neutral-600">1 an</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- 2.3 Cookies analytiques -->
                        <div class="mb-6">
                            <h3 class="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                                <span class="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
                                2.3 Cookies analytiques (statistiques)
                            </h3>
                            <div class="bg-neutral-50 p-4 rounded-lg mb-4">
                                <p class="text-neutral-600 text-sm">
                                    <strong>Statut actuel :</strong> Aucun cookie analytique tiers n'est
                                    actuellement utilisé sur le Site.
                                </p>
                                <p class="text-neutral-600 text-sm mt-2 italic">
                                    [À COMPLÉTER - Si Google Analytics ou autre outil est ajouté,
                                    mettre à jour cette section]
                                </p>
                            </div>
                        </div>

                        <!-- 2.4 Cookies marketing -->
                        <div class="mb-6">
                            <h3 class="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                                <span class="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                                2.4 Cookies marketing (publicité)
                            </h3>
                            <div class="bg-neutral-50 p-4 rounded-lg">
                                <p class="text-neutral-600 text-sm">
                                    <strong>Statut actuel :</strong> Aucun cookie marketing ou publicitaire
                                    n'est utilisé sur le Site.
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- Article 3 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            3. Cookies tiers
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Certains services tiers peuvent déposer des cookies sur votre appareil :
                        </p>

                        <!-- Stripe -->
                        <div class="bg-neutral-50 p-4 rounded-lg mb-4">
                            <h4 class="font-semibold text-neutral-700 mb-2">Stripe (paiement sécurisé)</h4>
                            <p class="text-neutral-600 text-sm mb-2">
                                Lors du processus de paiement, Stripe peut déposer des cookies pour
                                la détection de fraude et la sécurisation des transactions.
                            </p>
                            <p class="text-neutral-600 text-sm">
                                <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer"
                                   class="text-primary hover:underline">
                                    Politique de confidentialité Stripe →
                                </a>
                            </p>
                        </div>

                        <!-- YouTube (si applicable) -->
                        <div class="bg-neutral-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-neutral-700 mb-2">YouTube (vidéos intégrées)</h4>
                            <p class="text-neutral-600 text-sm mb-2">
                                Les vidéos YouTube intégrées utilisent le mode "nocookie" lorsque possible,
                                limitant le dépôt de cookies jusqu'à l'interaction avec le lecteur.
                            </p>
                            <p class="text-neutral-600 text-sm">
                                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
                                   class="text-primary hover:underline">
                                    Politique de confidentialité Google →
                                </a>
                            </p>
                        </div>
                    </section>

                    <!-- Article 4 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            4. Gestion de vos préférences
                        </h2>

                        <!-- 4.1 Bandeau cookies -->
                        <h3 class="font-semibold text-neutral-700 mb-3 mt-6">
                            4.1 Bandeau de consentement
                        </h3>
                        <div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-4">
                            <p class="text-amber-800 text-sm">
                                <strong>Note :</strong> Actuellement, le Site n'utilise que des cookies
                                strictement nécessaires qui ne requièrent pas de consentement préalable.
                                En cas d'ajout de cookies analytiques ou marketing, un bandeau de
                                consentement sera mis en place.
                            </p>
                        </div>

                        <!-- 4.2 Paramètres navigateur -->
                        <h3 class="font-semibold text-neutral-700 mb-3 mt-6">
                            4.2 Paramètres de votre navigateur
                        </h3>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Vous pouvez également gérer les cookies via les paramètres de votre navigateur :
                        </p>
                        <ul class="list-disc pl-6 space-y-2 text-neutral-600">
                            <li>
                                <strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies
                            </li>
                            <li>
                                <strong>Firefox :</strong> Paramètres → Vie privée et sécurité → Cookies
                            </li>
                            <li>
                                <strong>Safari :</strong> Préférences → Confidentialité → Cookies
                            </li>
                            <li>
                                <strong>Edge :</strong> Paramètres → Cookies et autorisations de site
                            </li>
                        </ul>
                        <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mt-4">
                            <p class="text-red-800 text-sm">
                                <strong>Attention :</strong> Le blocage des cookies essentiels peut empêcher
                                certaines fonctionnalités du Site de fonctionner correctement (connexion,
                                panier, paiement).
                            </p>
                        </div>
                    </section>

                    <!-- Article 5 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            5. Stockage local (LocalStorage)
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            En complément des cookies, le Site utilise le stockage local du navigateur
                            (LocalStorage) pour améliorer votre expérience :
                        </p>
                        <div class="overflow-x-auto">
                            <table class="min-w-full border border-neutral-200 rounded-lg overflow-hidden text-sm">
                                <thead class="bg-neutral-100">
                                    <tr>
                                        <th class="px-3 py-2 text-left font-semibold text-neutral-700">Clé</th>
                                        <th class="px-3 py-2 text-left font-semibold text-neutral-700">Finalité</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-neutral-200">
                                    <tr>
                                        <td class="px-3 py-2 text-neutral-600 font-mono text-xs">cart</td>
                                        <td class="px-3 py-2 text-neutral-600">Persistance du panier (7 jours TTL)</td>
                                    </tr>
                                    <tr>
                                        <td class="px-3 py-2 text-neutral-600 font-mono text-xs">shop_cache</td>
                                        <td class="px-3 py-2 text-neutral-600">Cache du catalogue produits (5 min TTL)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p class="text-neutral-600 text-sm mt-4 italic">
                            Ces données sont stockées uniquement sur votre appareil et ne sont pas
                            transmises à nos serveurs.
                        </p>
                    </section>

                    <!-- Article 6 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            6. Modifications de cette politique
                        </h2>
                        <p class="text-neutral-600 leading-relaxed">
                            Cette politique de cookies peut être mise à jour pour refléter les évolutions
                            du Site ou de la réglementation. La date de dernière mise à jour est indiquée
                            en haut de cette page.
                        </p>
                    </section>

                    <!-- Contact -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            7. Contact
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Pour toute question concernant cette politique de cookies :
                        </p>
                        <ul class="list-none space-y-2 text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                            <li><strong>Email :</strong> privacy@infocash.fr</li>
                        </ul>
                        <p class="text-neutral-600 leading-relaxed mt-4">
                            Pour plus d'informations sur la gestion de vos données personnelles,
                            consultez notre
                            <router-link to="/confidentialite" class="text-primary hover:underline font-medium">
                                Politique de confidentialité
                            </router-link>.
                        </p>
                    </section>
                </div>
            </div>
        </section>
    </DefaultLayout>
</template>

<style scoped>
.prose h2 {
    font-family: 'Bernina Sans Condensed', sans-serif;
}

.prose table {
    margin: 0;
}
</style>
