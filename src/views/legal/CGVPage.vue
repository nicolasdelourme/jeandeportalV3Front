<script setup lang="ts">
/**
 * Page Conditions Générales de Vente (CGV)
 * CGV pour e-commerce et abonnements numériques - Conformes au droit français
 */
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
</script>

<template>
    <DefaultLayout>
        <section class="min-h-screen bg-white py-12 md:py-16 px-4">
            <div class="max-w-3xl mx-auto">
                <!-- Titre principal -->
                <h1 class="font-heading text-3xl md:text-4xl font-bold text-neutral-900 mb-8 pb-4 border-b-2 border-primary">
                    Conditions Générales de Vente
                </h1>

                <!-- Dernière mise à jour -->
                <p class="text-sm text-neutral-500 mb-8">
                    Dernière mise à jour : [À COMPLÉTER - Date]
                </p>

                <div class="prose prose-neutral max-w-none">
                    <!-- Préambule -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            Préambule
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent les
                            relations contractuelles entre :
                        </p>
                        <ul class="list-disc pl-6 space-y-2 text-neutral-600 mb-4">
                            <li>
                                <strong>[À COMPLÉTER - Nom de la société]</strong>, société [À COMPLÉTER - forme juridique],
                                au capital de [À COMPLÉTER] euros, immatriculée au RCS de [À COMPLÉTER] sous le
                                numéro [À COMPLÉTER], dont le siège social est situé [À COMPLÉTER - Adresse]
                                (ci-après « le Vendeur » ou « Infocash Académie »)
                            </li>
                            <li>
                                Et toute personne physique ou morale effectuant un achat sur le site
                                infocash-academie.fr (ci-après « le Client »)
                            </li>
                        </ul>
                        <p class="text-neutral-600 leading-relaxed">
                            En passant commande sur le Site, le Client reconnaît avoir pris connaissance des
                            présentes CGV et les accepter sans réserve.
                        </p>
                    </section>

                    <!-- Article 1 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            Article 1 - Objet
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Les présentes CGV ont pour objet de définir les droits et obligations des parties
                            dans le cadre de la vente de :
                        </p>
                        <ul class="list-disc pl-6 space-y-2 text-neutral-600">
                            <li><strong>Produits numériques</strong> : ebooks, guides PDF, formations vidéo téléchargeables</li>
                            <li><strong>Abonnements</strong> : accès aux contenus premium de l'Académie (newsletters, tutoriels) selon différentes formules (Essentiel, Standard, Premium)</li>
                        </ul>
                    </section>

                    <!-- Article 2 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            Article 2 - Prix
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Les prix des produits et services sont indiqués en euros toutes taxes comprises (TTC).
                        </p>
                        <div class="bg-neutral-50 p-4 rounded-lg mb-4">
                            <h3 class="font-semibold text-neutral-800 mb-2">Tarifs des abonnements mensuels :</h3>
                            <ul class="list-disc pl-6 space-y-1 text-neutral-600">
                                <li><strong>Essentiel :</strong> 9,90 € / mois</li>
                                <li><strong>Standard :</strong> 14,90 € / mois</li>
                                <li><strong>Premium :</strong> 19,90 € / mois</li>
                            </ul>
                        </div>
                        <p class="text-neutral-600 leading-relaxed">
                            Le Vendeur se réserve le droit de modifier ses prix à tout moment. Les produits
                            seront facturés sur la base des tarifs en vigueur au moment de la validation de
                            la commande.
                        </p>
                    </section>

                    <!-- Article 3 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            Article 3 - Commande
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Pour passer commande, le Client doit :
                        </p>
                        <ol class="list-decimal pl-6 space-y-2 text-neutral-600 mb-4">
                            <li>Créer un compte ou se connecter à son compte existant</li>
                            <li>Sélectionner le(s) produit(s) ou abonnement(s) souhaité(s)</li>
                            <li>Vérifier le récapitulatif de la commande</li>
                            <li>Accepter les présentes CGV</li>
                            <li>Procéder au paiement</li>
                        </ol>
                        <p class="text-neutral-600 leading-relaxed">
                            La commande est définitivement validée après confirmation du paiement. Un email
                            de confirmation est envoyé au Client.
                        </p>
                    </section>

                    <!-- Article 4 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            Article 4 - Paiement
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Le règlement s'effectue par carte bancaire via la plateforme sécurisée Stripe.
                        </p>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Les données bancaires du Client sont chiffrées et ne transitent pas par les
                            serveurs du Vendeur.
                        </p>
                        <div class="bg-neutral-50 p-4 rounded-lg">
                            <h3 class="font-semibold text-neutral-800 mb-2">Pour les abonnements :</h3>
                            <p class="text-neutral-600">
                                Le paiement est prélevé automatiquement chaque mois à date anniversaire de
                                la souscription. Le Client peut annuler son abonnement à tout moment depuis
                                son espace personnel.
                            </p>
                        </div>
                    </section>

                    <!-- Article 5 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            Article 5 - Livraison / Accès aux contenus
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            <strong>Produits numériques :</strong> Les produits téléchargeables sont
                            accessibles immédiatement après validation du paiement depuis l'espace
                            personnel du Client.
                        </p>
                        <p class="text-neutral-600 leading-relaxed">
                            <strong>Abonnements :</strong> L'accès aux contenus premium de l'Académie est activé
                            immédiatement après validation du paiement et reste actif pendant toute
                            la durée de l'abonnement.
                        </p>
                    </section>

                    <!-- Article 6 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            Article 6 - Droit de rétractation
                        </h2>
                        <div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-4">
                            <p class="text-amber-800 font-semibold mb-2">
                                Important - Exception au droit de rétractation
                            </p>
                            <p class="text-amber-700">
                                Conformément à l'article L.221-28 du Code de la consommation, le droit de
                                rétractation ne peut être exercé pour les contrats de fourniture de
                                <strong>contenu numérique non fourni sur support matériel</strong> dont
                                l'exécution a commencé avec l'accord du consommateur.
                            </p>
                        </div>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            En validant sa commande pour un produit numérique ou un abonnement, le Client
                            reconnaît expressément :
                        </p>
                        <ul class="list-disc pl-6 space-y-2 text-neutral-600 mb-4">
                            <li>Demander l'exécution immédiate du contrat</li>
                            <li>Renoncer expressément à son droit de rétractation</li>
                        </ul>
                        <p class="text-neutral-600 leading-relaxed">
                            Cette renonciation est confirmée par une case à cocher lors du processus de commande.
                        </p>
                    </section>

                    <!-- Article 7 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            Article 7 - Abonnements : durée et résiliation
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Les abonnements sont souscrits pour une durée indéterminée avec une période
                            de facturation mensuelle.
                        </p>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            <strong>Résiliation par le Client :</strong> Le Client peut résilier son
                            abonnement à tout moment depuis son espace personnel. La résiliation prend
                            effet à la fin de la période de facturation en cours. Le Client conserve
                            l'accès aux contenus jusqu'à cette date.
                        </p>
                        <p class="text-neutral-600 leading-relaxed">
                            <strong>Résiliation par le Vendeur :</strong> Le Vendeur se réserve le droit
                            de résilier l'abonnement en cas de non-respect des présentes CGV ou des
                            conditions d'utilisation du Site.
                        </p>
                    </section>

                    <!-- Article 8 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            Article 8 - Propriété intellectuelle
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Tous les contenus proposés à la vente (textes, vidéos, PDF, etc.) restent la
                            propriété exclusive de [À COMPLÉTER - Nom de la société] ou de leurs auteurs respectifs.
                        </p>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            L'achat confère au Client un droit d'usage personnel et non cessible. Il est
                            strictement interdit de :
                        </p>
                        <ul class="list-disc pl-6 space-y-2 text-neutral-600">
                            <li>Reproduire ou redistribuer les contenus</li>
                            <li>Partager ses identifiants de connexion</li>
                            <li>Revendre ou céder les produits acquis</li>
                            <li>Utiliser les contenus à des fins commerciales</li>
                        </ul>
                    </section>

                    <!-- Article 9 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            Article 9 - Responsabilité
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Les contenus proposés ont une vocation éducative et informative. Ils ne
                            constituent en aucun cas des conseils financiers personnalisés.
                        </p>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Le Client reconnaît que toute décision d'investissement est prise sous sa
                            seule responsabilité. Le Vendeur ne pourra être tenu responsable des
                            éventuelles pertes financières résultant de l'application des informations
                            fournies.
                        </p>
                        <p class="text-neutral-600 leading-relaxed">
                            Le Vendeur ne garantit pas l'accès continu et ininterrompu au Site et aux
                            contenus.
                        </p>
                    </section>

                    <!-- Article 10 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            Article 10 - Données personnelles
                        </h2>
                        <p class="text-neutral-600 leading-relaxed">
                            Le traitement des données personnelles du Client est détaillé dans notre
                            <router-link to="/confidentialite" class="text-primary hover:underline font-medium">
                                Politique de confidentialité
                            </router-link>.
                        </p>
                    </section>

                    <!-- Article 11 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            Article 11 - Service client
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Pour toute question relative à une commande ou aux services, le Client peut
                            contacter le service client :
                        </p>
                        <ul class="list-none space-y-2 text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                            <li><strong>Email :</strong> [À COMPLÉTER - support@infocash-academie.fr]</li>
                            <li><strong>Délai de réponse :</strong> [À COMPLÉTER - ex: sous 48h ouvrées]</li>
                        </ul>
                    </section>

                    <!-- Article 12 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            Article 12 - Médiation
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Conformément aux articles L.612-1 et suivants du Code de la consommation,
                            en cas de litige, le Client peut recourir gratuitement à un médiateur de
                            la consommation :
                        </p>
                        <ul class="list-none space-y-2 text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                            <li><strong>Médiateur :</strong> [À COMPLÉTER - Nom du médiateur]</li>
                            <li><strong>Site web :</strong> [À COMPLÉTER - URL]</li>
                            <li><strong>Adresse :</strong> [À COMPLÉTER]</li>
                        </ul>
                        <p class="text-neutral-600 leading-relaxed mt-4">
                            Le Client peut également recourir à la plateforme de règlement en ligne des
                            litiges de la Commission européenne :
                            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
                               class="text-primary hover:underline font-medium">
                                https://ec.europa.eu/consumers/odr
                            </a>
                        </p>
                    </section>

                    <!-- Article 13 -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            Article 13 - Droit applicable
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Les présentes CGV sont soumises au droit français.
                        </p>
                        <p class="text-neutral-600 leading-relaxed">
                            En cas de litige et à défaut de résolution amiable ou de médiation, les
                            tribunaux compétents seront ceux du ressort du siège social du Vendeur
                            pour les litiges entre professionnels, ou ceux du domicile du défendeur
                            ou du lieu de livraison pour les litiges avec les consommateurs.
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
</style>
