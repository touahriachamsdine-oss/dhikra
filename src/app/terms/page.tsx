import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, ShieldCheck, FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans text-gray-800 dark:text-gray-200">
      <header className="flex justify-between items-center py-4 px-8 max-w-7xl mx-auto w-full border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
            <span className="font-bold text-gray-600 dark:text-gray-300">Retour à l'accueil</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6 sm:px-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Conditions Générales d'Utilisation (CGU)</h1>
          <p className="text-gray-500 dark:text-gray-400">Dernière mise à jour : {new Date().toLocaleDateString('fr-DZ')}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 sm:p-12 prose dark:prose-invert max-w-none">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6" /> 1. Préambule
            </h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation de la plateforme Taswiya (ci-après « la Plateforme »). En accédant ou en utilisant la Plateforme, vous acceptez d'être lié par ces CGU. Si vous n'acceptez pas l'intégralité de ces conditions, veuillez ne pas utiliser nos services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6" /> 2. Description du Service
            </h2>
            <p>
              Taswiya est une plateforme numérique facilitant la génération de documents juridiques (tels que les mises en demeure) et la gestion de dossiers de réclamation ou de litiges. Le service permet notamment :
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>La saisie d'informations relatives à un litige (logement, travail, automobile, etc.).</li>
              <li>La génération automatique de documents au format PDF.</li>
              <li>Le téléchargement de pièces justificatives (jusqu'à 40 Mo par fichier).</li>
              <li>Le suivi du statut des dossiers via un tableau de bord personnel.</li>
            </ul>
            <p className="font-semibold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/30">
              Important : Taswiya fournit un outil d'assistance administrative et de rédaction automatisée. Les documents générés ne constituent en aucun cas un conseil juridique personnalisé. Nous vous recommandons de consulter un avocat ou un professionnel du droit pour toute situation complexe.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              3. Inscription et Compte Utilisateur
            </h2>
            <p>
              L'utilisation de certaines fonctionnalités de la Plateforme nécessite la création d'un compte utilisateur. Vous vous engagez à fournir des informations exactes, à jour et complètes lors de votre inscription (notamment votre nom, adresse email et numéro de téléphone).
            </p>
            <p>
              Vous êtes seul responsable de la confidentialité de vos identifiants de connexion et de toutes les activités effectuées sous votre compte. Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              4. Données Personnelles et Fichiers
            </h2>
            <p>
              Conformément à la réglementation en vigueur concernant la protection des données personnelles, Taswiya s'engage à protéger la vie privée de ses utilisateurs. 
            </p>
            <p>
              Les documents et fichiers téléchargés (pièces justificatives) sont stockés de manière sécurisée et ne sont accessibles que par vous-même et par les administrateurs de la Plateforme (dans le cadre strict du traitement de votre dossier). Vous conservez l'entière propriété intellectuelle et la responsabilité du contenu que vous téléchargez.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              5. Engagements de l'Utilisateur
            </h2>
            <p>L'Utilisateur s'engage à :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ne pas utiliser la Plateforme à des fins illégales ou frauduleuses.</li>
              <li>Ne pas générer des documents contenant des informations fausses, diffamatoires ou portant atteinte aux droits de tiers.</li>
              <li>Ne pas tenter de contourner les mesures de sécurité ou de surcharger l'infrastructure de la Plateforme.</li>
              <li>Ne télécharger que des fichiers exempts de virus ou de codes malveillants.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              6. Limitation de Responsabilité
            </h2>
            <p>
              Taswiya s'efforce d'assurer la disponibilité et le bon fonctionnement de la Plateforme. Toutefois, nous ne pouvons garantir une disponibilité ininterrompue ou exempte d'erreurs.
            </p>
            <p>
              Taswiya ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation des documents générés, des décisions prises sur la base de ces documents, ou d'une perte de données liée à des problèmes techniques échappant à notre contrôle.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              7. Modification des CGU
            </h2>
            <p>
              Taswiya se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entreront en vigueur dès leur publication sur la Plateforme. Nous vous invitons à consulter régulièrement cette page. Votre utilisation continue de la Plateforme après modification vaut acceptation des nouvelles CGU.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              8. Contact
            </h2>
            <p>
              Pour toute question relative aux présentes Conditions Générales d'Utilisation ou pour toute demande de support, vous pouvez nous contacter à l'adresse suivante : <strong>contact@taswiya.dz</strong>
            </p>
          </section>

        </div>
      </main>

      <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Taswiya. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
