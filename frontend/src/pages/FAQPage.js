import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

const FAQPage = () => {
  const faqs = [
    {
      question: "Comment commencer à investir sur CashGold ?",
      answer: "C'est simple ! Créez un compte gratuit, effectuez un dépôt minimum de $10 en USDT TRC20, et commencez à investir. Une fois votre dépôt validé par notre équipe, vous pouvez créer votre premier investissement et commencer à gagner 5% par jour."
    },
    {
      question: "Quel est le rendement quotidien ?",
      answer: "Tous les niveaux VIP offrent un rendement garanti de 5% par jour sur votre montant investi. Ce rendement est calculé automatiquement et ajouté à votre solde disponible."
    },
    {
      question: "Quel est l'investissement minimum ?",
      answer: "L'investissement minimum est de $10, ce qui correspond au niveau VIP 1. Vous pouvez investir plus pour accéder à des niveaux VIP supérieurs."
    },
    {
      question: "Quels sont les différents niveaux VIP ?",
      answer: "Il existe 5 niveaux VIP : VIP 1 ($10-$99), VIP 2 ($100-$499), VIP 3 ($500-$999), VIP 4 ($1,000-$4,999), et VIP 5 ($5,000+). Tous offrent le même rendement de 5% par jour."
    },
    {
      question: "Comment puis-je déposer des fonds ?",
      answer: "Nous acceptons les dépôts en USDT TRC20. Une fois connecté, allez dans l'onglet 'Déposer', copiez l'adresse de dépôt, envoyez vos USDT depuis votre portefeuille, puis soumettez le montant et le hash de transaction (optionnel) sur la plateforme. Votre dépôt sera validé par un administrateur."
    },
    {
      question: "Combien de temps prend la validation d'un dépôt ?",
      answer: "Les dépôts sont validés manuellement par notre équipe. Le délai varie généralement entre quelques minutes à 24 heures selon le volume de transactions. Nous nous efforçons de traiter toutes les demandes le plus rapidement possible."
    },
    {
      question: "Comment retirer mes gains ?",
      answer: "Allez dans l'onglet 'Retirer' de votre tableau de bord, entrez le montant souhaité (minimum $10) et votre adresse de portefeuille USDT TRC20. Les retraits sont traités rapidement par notre équipe."
    },
    {
      question: "Y a-t-il des frais de retrait ?",
      answer: "Non, nous ne facturons pas de frais de retrait. Le montant que vous demandez est celui que vous recevrez dans votre portefeuille."
    },
    {
      question: "Puis-je arrêter un investissement ?",
      answer: "Oui, vous pouvez arrêter un investissement actif à tout moment. Votre capital investi sera immédiatement retourné à votre solde disponible, et vous conservez tous les profits générés jusqu'à ce moment."
    },
    {
      question: "Comment fonctionne le programme de parrainage ?",
      answer: "Vous recevez un lien de parrainage unique. Partagez-le avec vos amis ! Lorsqu'ils s'inscrivent et effectuent un dépôt, vous recevez 5% de leur montant déposé en bonus immédiat."
    },
    {
      question: "Mes fonds sont-ils en sécurité ?",
      answer: "Absolument. Nous utilisons un cryptage SSL de niveau bancaire, une authentification à deux facteurs (2FA), et des protocoles de sécurité avancés pour protéger vos fonds et données personnelles."
    },
    {
      question: "Qu'est-ce que la vérification 2FA ?",
      answer: "La vérification 2FA (authentification à deux facteurs) ajoute une couche de sécurité supplémentaire. Lors de la connexion, vous recevrez un code de vérification à 6 chiffres par email que vous devrez saisir pour accéder à votre compte."
    },
    {
      question: "Puis-je avoir plusieurs comptes ?",
      answer: "Non, chaque utilisateur ne peut avoir qu'un seul compte sur la plateforme. Les comptes multiples sont interdits et peuvent entraîner une suspension."
    },
    {
      question: "Comment contacter le support ?",
      answer: "Notre équipe de support est disponible 24/7. Vous pouvez nous contacter via le formulaire de contact sur notre site ou par email à support@cashgold.com. Nous répondons généralement dans les 24 heures."
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="glass fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-xl">
              C
            </div>
            <span className="text-2xl font-bold gold-text">CashGold</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/">
              <Button variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            Questions <span className="gold-text">Fréquentes</span>
          </h1>
          <p className="text-center text-gray-400 text-lg mb-12">
            Trouvez les réponses aux questions les plus courantes
          </p>

          <div className="glass-light rounded-2xl p-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-[#d4af37]/20 rounded-xl px-6 py-2"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:text-[#d4af37] hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 text-base leading-relaxed pt-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-12">
            <h2 className="text-3xl font-bold mb-4">
              Vous n'avez pas trouvé de réponse ?
            </h2>
            <p className="text-gray-400 mb-6">
              Notre équipe de support est là pour vous aider
            </p>
            <Link to="/contact">
              <Button className="btn-gold text-lg px-8 py-6">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
