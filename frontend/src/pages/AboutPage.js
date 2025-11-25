import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const AboutPage = () => {
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
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center">
            À propos de <span className="gold-text">CashGold</span>
          </h1>

          <div className="space-y-8">
            <div className="glass-light rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 gold-text">Notre Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                CashGold est né de la vision de démocratiser l'accès aux opportunités d'investissement de haute qualité. 
                Notre mission est de fournir à chacun, indépendamment de son expérience financière ou de son capital de départ, 
                la possibilité de faire fructifier son argent de manière sécurisée et transparente.
              </p>
            </div>

            <div className="glass-light rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 gold-text">Notre Vision</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Nous aspirons à devenir la plateforme d'investissement en ligne de référence, reconnue pour sa fiabilité, 
                sa transparence et ses rendements constants. Notre engagement est de construire une communauté d'investisseurs 
                prospères qui atteignent leurs objectifs financiers grâce à nos services.
              </p>
            </div>

            <div className="glass-light rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 gold-text">Pourquoi CashGold ?</h2>
              <div className="space-y-4 text-gray-300 text-lg">
                <div className="flex items-start space-x-3">
                  <span className="text-[#d4af37] text-2xl">✓</span>
                  <p><strong>Rendements garantis</strong> - 5% de profit quotidien sur tous vos investissements</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-[#d4af37] text-2xl">✓</span>
                  <p><strong>Investissement accessible</strong> - Commencez avec seulement $10</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-[#d4af37] text-2xl">✓</span>
                  <p><strong>Sécurité maximale</strong> - Protection SSL, 2FA et cryptage bancaire</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-[#d4af37] text-2xl">✓</span>
                  <p><strong>Retraits rapides</strong> - Accédez à vos fonds quand vous le souhaitez</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-[#d4af37] text-2xl">✓</span>
                  <p><strong>Support 24/7</strong> - Notre équipe est toujours là pour vous aider</p>
                </div>
              </div>
            </div>

            <div className="glass-light rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 gold-text">Nos Valeurs</h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Transparence</h3>
                  <p className="text-gray-400">Communication claire et honnête avec nos investisseurs</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Sécurité</h3>
                  <p className="text-gray-400">Protection maximale de vos fonds et données</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Innovation</h3>
                  <p className="text-gray-400">Technologies de pointe pour une expérience optimale</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <h2 className="text-3xl font-bold mb-6">
                Prêt à commencer votre voyage avec <span className="gold-text">CashGold</span> ?
              </h2>
              <Link to="/register">
                <Button className="btn-gold text-lg px-10 py-6">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
