<script setup lang="ts">
/**
 * Page Politique de Confidentialité
 * Conforme au RGPD (Règlement Général sur la Protection des Données)
 */
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
</script>

<template>
    <DefaultLayout>
        <section class="min-h-screen bg-white py-12 md:py-16 px-4">
            <div class="max-w-3xl mx-auto">
                <!-- Titre principal -->
                <h1 class="font-heading text-3xl md:text-4xl font-bold text-neutral-900 mb-8 pb-4 border-b-2 border-primary">
                    Politique de confidentialité
                </h1>

                <!-- Dernière mise à jour -->
                <p class="text-sm text-neutral-500 mb-8">
                    Dernière mise à jour : [À COMPLÉTER - Date]
                </p>

                <div class="prose prose-neutral max-w-none">
                    <!-- Introduction -->
                    <section class="mb-10">
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            <strong>[À COMPLÉTER - Nom de la société]</strong> (ci-après « nous », « notre »,
                            « Infocash Académie ») s'engage à protéger la vie privée des utilisateurs de son
                            site <strong>infocash-academie.fr</strong> (ci-après « le Site »).
                        </p>
                        <p class="text-neutral-600 leading-relaxed">
                            Cette politique de confidentialité décrit comment nous collectons, utilisons et
                            protégeons vos données personnelles, conformément au Règlement Général sur la
                            Protection des Données (RGPD) et à la loi Informatique et Libertés.
                        </p>
                    </section>

                    <!-- Article 1 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            1. Responsable du traitement
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Le responsable du traitement des données personnelles est :
                        </p>
                        <ul class="list-none space-y-2 text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                            <li><strong>Société :</strong> [À COMPLÉTER - Nom de la société]</li>
                            <li><strong>Adresse :</strong> [À COMPLÉTER]</li>
                            <li><strong>Email DPO/Contact :</strong> [À COMPLÉTER - privacy@infocash-academie.fr]</li>
                        </ul>
                    </section>

                    <!-- Article 2 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            2. Données collectées
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Nous collectons les données suivantes :
                        </p>

                        <!-- 2.1 -->
                        <h3 class="font-semibold text-neutral-700 mb-2 mt-6">
                            2.1 Données d'identification et de contact
                        </h3>
                        <ul class="list-disc pl-6 space-y-1 text-neutral-600 mb-4">
                            <li>Nom et prénom</li>
                            <li>Adresse email</li>
                            <li>Mot de passe (chiffré)</li>
                            <li>Adresse postale (si nécessaire pour la facturation)</li>
                        </ul>

                        <!-- 2.2 -->
                        <h3 class="font-semibold text-neutral-700 mb-2 mt-6">
                            2.2 Données de transaction
                        </h3>
                        <ul class="list-disc pl-6 space-y-1 text-neutral-600 mb-4">
                            <li>Historique des commandes</li>
                            <li>Informations de facturation</li>
                            <li>Abonnements actifs</li>
                        </ul>
                        <p class="text-neutral-600 text-sm italic mb-4">
                            Note : Les données bancaires sont traitées directement par Stripe et ne sont
                            jamais stockées sur nos serveurs.
                        </p>

                        <!-- 2.3 -->
                        <h3 class="font-semibold text-neutral-700 mb-2 mt-6">
                            2.3 Données de navigation
                        </h3>
                        <ul class="list-disc pl-6 space-y-1 text-neutral-600">
                            <li>Adresse IP</li>
                            <li>Type de navigateur et appareil</li>
                            <li>Pages visitées et actions effectuées</li>
                            <li>Cookies (voir notre <router-link to="/cookies" class="text-primary hover:underline">Politique de cookies</router-link>)</li>
                        </ul>
                    </section>

                    <!-- Article 3 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            3. Finalités et bases légales du traitement
                        </h2>
                        <div class="overflow-x-auto">
                            <table class="min-w-full border border-neutral-200 rounded-lg overflow-hidden">
                                <thead class="bg-neutral-100">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Finalité</th>
                                        <th class="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Base légale</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-neutral-200">
                                    <tr>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Création et gestion de compte</td>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Exécution du contrat</td>
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Traitement des commandes et paiements</td>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Exécution du contrat</td>
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Gestion des abonnements</td>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Exécution du contrat</td>
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Service client et support</td>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Exécution du contrat</td>
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Envoi de newsletters thématiques</td>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Exécution du contrat (abonnés)</td>
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Communications marketing</td>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Consentement</td>
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Analyse et amélioration du Site</td>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Intérêt légitime</td>
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Obligations légales (facturation, fiscalité)</td>
                                        <td class="px-4 py-3 text-sm text-neutral-600">Obligation légale</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <!-- Article 4 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            4. Destinataires des données
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Vos données peuvent être partagées avec :
                        </p>
                        <ul class="list-disc pl-6 space-y-2 text-neutral-600">
                            <li>
                                <strong>Stripe</strong> : prestataire de paiement sécurisé
                                (<a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer"
                                    class="text-primary hover:underline">politique de confidentialité Stripe</a>)
                            </li>
                            <li>
                                <strong>Hébergeur</strong> : [À COMPLÉTER - Nom de l'hébergeur] pour le stockage des données
                            </li>
                            <li>
                                <strong>Prestataires techniques</strong> : maintenance, envoi d'emails transactionnels
                            </li>
                        </ul>
                        <p class="text-neutral-600 leading-relaxed mt-4">
                            Nous ne vendons jamais vos données personnelles à des tiers.
                        </p>
                    </section>

                    <!-- Article 5 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            5. Durée de conservation
                        </h2>
                        <ul class="list-disc pl-6 space-y-2 text-neutral-600">
                            <li>
                                <strong>Données de compte</strong> : conservées pendant la durée de
                                l'inscription, puis 3 ans après la dernière activité
                            </li>
                            <li>
                                <strong>Données de transaction</strong> : 10 ans (obligations comptables et fiscales)
                            </li>
                            <li>
                                <strong>Données de navigation</strong> : 13 mois maximum
                            </li>
                        </ul>
                    </section>

                    <!-- Article 6 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            6. Vos droits
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Conformément au RGPD, vous disposez des droits suivants :
                        </p>
                        <ul class="list-disc pl-6 space-y-2 text-neutral-600 mb-4">
                            <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
                            <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
                            <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
                            <li><strong>Droit à la limitation</strong> : restreindre le traitement de vos données</li>
                            <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
                            <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
                            <li><strong>Droit de retirer votre consentement</strong> : à tout moment pour les traitements basés sur le consentement</li>
                        </ul>
                        <div class="bg-neutral-50 p-4 rounded-lg">
                            <p class="text-neutral-600 mb-2">
                                <strong>Pour exercer vos droits :</strong>
                            </p>
                            <ul class="list-disc pl-6 space-y-1 text-neutral-600">
                                <li>Email : [À COMPLÉTER - privacy@infocash-academie.fr]</li>
                                <li>Courrier : [À COMPLÉTER - Adresse]</li>
                            </ul>
                            <p class="text-neutral-600 text-sm mt-2 italic">
                                Nous répondrons dans un délai d'un mois. Une pièce d'identité peut être demandée.
                            </p>
                        </div>
                    </section>

                    <!-- Article 7 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            7. Réclamation auprès de la CNIL
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Si vous estimez que le traitement de vos données personnelles constitue une
                            violation du RGPD, vous avez le droit d'introduire une réclamation auprès de
                            la Commission Nationale de l'Informatique et des Libertés (CNIL) :
                        </p>
                        <ul class="list-none space-y-2 text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                            <li><strong>Site web :</strong> <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">www.cnil.fr</a></li>
                            <li><strong>Adresse :</strong> CNIL - 3 Place de Fontenoy - TSA 80715 - 75334 Paris Cedex 07</li>
                        </ul>
                    </section>

                    <!-- Article 8 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            8. Sécurité des données
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Nous mettons en œuvre des mesures techniques et organisationnelles pour
                            protéger vos données contre tout accès non autorisé, modification ou destruction :
                        </p>
                        <ul class="list-disc pl-6 space-y-2 text-neutral-600">
                            <li>Chiffrement des communications (HTTPS/TLS)</li>
                            <li>Chiffrement des mots de passe</li>
                            <li>Authentification sécurisée (JWT via cookies HttpOnly)</li>
                            <li>Accès restreint aux données (principe du moindre privilège)</li>
                            <li>Sauvegardes régulières</li>
                        </ul>
                    </section>

                    <!-- Article 9 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            9. Transferts de données hors UE
                        </h2>
                        <p class="text-neutral-600 leading-relaxed">
                            Certains de nos prestataires (notamment Stripe) peuvent être situés en dehors
                            de l'Union Européenne. Dans ce cas, nous nous assurons que ces transferts sont
                            encadrés par des garanties appropriées (clauses contractuelles types de la
                            Commission Européenne, certification Privacy Shield, etc.).
                        </p>
                    </section>

                    <!-- Article 10 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            10. Modifications de la politique
                        </h2>
                        <p class="text-neutral-600 leading-relaxed">
                            Nous nous réservons le droit de modifier cette politique de confidentialité à
                            tout moment. En cas de modification substantielle, nous vous en informerons par
                            email ou par une notification sur le Site. La date de dernière mise à jour est
                            indiquée en haut de cette page.
                        </p>
                    </section>

                    <!-- Contact -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            11. Contact
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Pour toute question relative à cette politique ou à vos données personnelles :
                        </p>
                        <ul class="list-none space-y-2 text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                            <li><strong>Email :</strong> [À COMPLÉTER - privacy@infocash-academie.fr]</li>
                            <li><strong>Adresse :</strong> [À COMPLÉTER]</li>
                        </ul>
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
