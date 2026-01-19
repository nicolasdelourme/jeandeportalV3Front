<script setup lang="ts">
/**
 * Page Mentions Légales
 * Informations légales obligatoires conformément à la loi française (LCEN)
 */
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
</script>

<template>
    <DefaultLayout>
        <section class="min-h-screen bg-white py-12 md:py-16 px-4">
            <div class="max-w-3xl mx-auto">
                <!-- Titre principal -->
                <h1 class="font-heading text-3xl md:text-4xl font-bold text-neutral-900 mb-8 pb-4 border-b-2 border-primary">
                    Mentions légales
                </h1>

                <!-- Dernière mise à jour -->
                <p class="text-sm text-neutral-500 mb-8">
                    Dernière mise à jour : [À COMPLÉTER - Date]
                </p>

                <div class="prose prose-neutral max-w-none">
                    <!-- 1. Éditeur du site -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            1. Éditeur du site
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Le site <strong>Infocash Académie</strong> (ci-après « le Site ») est édité par :
                        </p>
                        <ul class="list-none space-y-2 text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                            <li><strong>Raison sociale :</strong> [À COMPLÉTER - Nom de la société]</li>
                            <li><strong>Forme juridique :</strong> [À COMPLÉTER - SAS, SARL, etc.]</li>
                            <li><strong>Capital social :</strong> [À COMPLÉTER] euros</li>
                            <li><strong>Siège social :</strong> [À COMPLÉTER - Adresse complète]</li>
                            <li><strong>RCS :</strong> [À COMPLÉTER - Ville et numéro]</li>
                            <li><strong>SIRET :</strong> [À COMPLÉTER]</li>
                            <li><strong>Numéro TVA intracommunautaire :</strong> [À COMPLÉTER]</li>
                        </ul>
                    </section>

                    <!-- 2. Directeur de publication -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            2. Directeur de la publication
                        </h2>
                        <ul class="list-none space-y-2 text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                            <li><strong>Nom :</strong> [À COMPLÉTER - Prénom NOM]</li>
                            <li><strong>Qualité :</strong> [À COMPLÉTER - Président, Gérant, etc.]</li>
                        </ul>
                    </section>

                    <!-- 3. Contact -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            3. Contact
                        </h2>
                        <ul class="list-none space-y-2 text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                            <li><strong>Email :</strong> [À COMPLÉTER - contact@infocash-academie.fr]</li>
                            <li><strong>Téléphone :</strong> [À COMPLÉTER - Optionnel]</li>
                            <li><strong>Formulaire de contact :</strong> [À COMPLÉTER - URL si disponible]</li>
                        </ul>
                    </section>

                    <!-- 4. Hébergeur -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            4. Hébergeur
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Le Site est hébergé par :
                        </p>
                        <ul class="list-none space-y-2 text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                            <li><strong>Raison sociale :</strong> [À COMPLÉTER - Nom de l'hébergeur]</li>
                            <li><strong>Adresse :</strong> [À COMPLÉTER]</li>
                            <li><strong>Téléphone :</strong> [À COMPLÉTER]</li>
                        </ul>
                    </section>

                    <!-- 5. Propriété intellectuelle -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            5. Propriété intellectuelle
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            L'ensemble du contenu du Site (textes, images, vidéos, logos, graphismes, icônes,
                            logiciels, bases de données, etc.) est protégé par les lois françaises et
                            internationales relatives à la propriété intellectuelle.
                        </p>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Toute reproduction, représentation, modification, publication, transmission ou
                            dénaturation, totale ou partielle, du Site ou de son contenu, par quelque procédé
                            que ce soit et sur quelque support que ce soit, est interdite sans l'autorisation
                            écrite préalable de [À COMPLÉTER - Nom de la société].
                        </p>
                        <p class="text-neutral-600 leading-relaxed">
                            Toute exploitation non autorisée du Site ou de son contenu sera considérée comme
                            constitutive d'une contrefaçon et poursuivie conformément aux dispositions des
                            articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
                        </p>
                    </section>

                    <!-- 6. Crédits -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            6. Crédits
                        </h2>
                        <ul class="list-none space-y-2 text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                            <li><strong>Conception et développement :</strong> [À COMPLÉTER]</li>
                            <li><strong>Design :</strong> [À COMPLÉTER]</li>
                            <li><strong>Crédits photos/vidéos :</strong> [À COMPLÉTER si applicable]</li>
                        </ul>
                    </section>

                    <!-- 7. Données personnelles -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            7. Données personnelles
                        </h2>
                        <p class="text-neutral-600 leading-relaxed">
                            Pour toute information concernant le traitement de vos données personnelles,
                            veuillez consulter notre
                            <router-link to="/confidentialite" class="text-primary hover:underline font-medium">
                                Politique de confidentialité
                            </router-link>.
                        </p>
                    </section>

                    <!-- 8. Cookies -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            8. Cookies
                        </h2>
                        <p class="text-neutral-600 leading-relaxed">
                            Pour toute information concernant l'utilisation des cookies sur le Site,
                            veuillez consulter notre
                            <router-link to="/cookies" class="text-primary hover:underline font-medium">
                                Politique de cookies
                            </router-link>.
                        </p>
                    </section>

                    <!-- 9. Litiges -->
                    <section class="mb-10">
                        <h2 class="text-xl font-bold text-neutral-800 mb-4">
                            9. Droit applicable et juridiction compétente
                        </h2>
                        <p class="text-neutral-600 leading-relaxed mb-4">
                            Les présentes mentions légales sont régies par le droit français.
                        </p>
                        <p class="text-neutral-600 leading-relaxed">
                            En cas de litige et à défaut de résolution amiable, les tribunaux français
                            seront seuls compétents pour connaître du différend.
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
