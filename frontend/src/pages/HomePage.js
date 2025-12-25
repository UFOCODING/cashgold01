import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const HomePage = () => {
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
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-300 hover:text-[#d4af37] transition-colors">Accueil</Link>
            <Link to="/about" className="text-gray-300 hover:text-[#d4af37] transition-colors">À propos</Link>
            <Link to="/faq" className="text-gray-300 hover:text-[#d4af37] transition-colors">FAQ</Link>
            <Link to="/contact" className="text-gray-300 hover:text-[#d4af37] transition-colors">Contact</Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/login">
              <Button data-testid="login-btn" variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button data-testid="register-btn" className="btn-gold">
                Inscription
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Investissez dans votre
              <br />
              <span className="gold-text">Avenir Doré</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Plateforme d'investissement en ligne sécurisée avec des rendements quotidiens garantis de 5%
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/register">
                <Button data-testid="hero-start-btn" className="btn-gold text-lg px-8 py-6">
                  Commencer à investir
                </Button>
              </Link>
              <Link to="/about">
                <Button data-testid="hero-learn-btn" variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black text-lg px-8 py-6">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-light rounded-2xl p-8 hover:border-[#d4af37] border transition-all">
              <div className="text-4xl font-bold gold-text mb-2">5%</div>
              <div className="text-gray-400">Rendement quotidien</div>
            </div>
            <div className="glass-light rounded-2xl p-8 hover:border-[#d4af37] border transition-all">
              <div className="text-4xl font-bold gold-text mb-2">$10</div>
              <div className="text-gray-400">Investissement minimum</div>
            </div>
            <div className="glass-light rounded-2xl p-8 hover:border-[#d4af37] border transition-all">
              <div className="text-4xl font-bold gold-text mb-2">24/7</div>
              <div className="text-gray-400">Support client</div>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Levels */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Niveaux <span className="gold-text">VIP</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">Choisissez votre niveau d'investissement</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { level: 'VIP 1', min: '$10', max: '$99' },
              { level: 'VIP 2', min: '$100', max: '$499' },
              { level: 'VIP 3', min: '$500', max: '$999' },
              { level: 'VIP 4', min: '$1,000', max: '$4,999' },
              { level: 'VIP 5', min: '$5,000', max: '+' }
            ].map((vip, idx) => (
              <div
                key={idx}
                data-testid={`vip-level-${idx + 1}`}
                className="glass-light rounded-2xl p-6 hover:border-[#d4af37] border transition-all transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="gold-text text-2xl font-bold mb-4">{vip.level}</div>
                  <div className="text-gray-300 mb-2">{vip.min} - {vip.max}</div>
                  <div className="text-3xl font-bold text-white mt-4">5%</div>
                  <div className="text-gray-400 text-sm">par jour</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Pourquoi <span className="gold-text">CashGold</span> ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center" data-testid="feature-security">
              <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Sécurité maximale</h3>
              <p className="text-gray-400">Protection SSL, 2FA et cryptage de niveau bancaire pour vos fonds</p>
            </div>

            <div className="card text-center" data-testid="feature-profits">
              <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Profits garantis</h3>
              <p className="text-gray-400">Recevez 5% de rendement quotidien sur tous vos investissements</p>
            </div>

            <div className="card text-center" data-testid="feature-withdrawal">
              <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Retraits instantanés</h3>
              <p className="text-gray-400">Retirez vos gains à tout moment via USDT TRC20</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass-light rounded-3xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à commencer votre <span className="gold-text">voyage d'investissement</span> ?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'investisseurs qui font fructifier leur argent avec CashGold
            </p>
            <Link to="/register">
              <Button data-testid="cta-register-btn" className="btn-gold text-lg px-10 py-6">
                Créer un compte gratuit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-[#d4af37]/20 py-12 px-4 mt-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-xl">
                  C
                </div>
                <span className="text-2xl font-bold gold-text">CashGold</span>
              </div>
              <p className="text-gray-400">Investissez intelligemment, gagnez quotidiennement</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#d4af37]">Liens rapides</h4>
              <div className="space-y-2">
                <Link to="/" className="block text-gray-400 hover:text-[#d4af37] transition-colors">Accueil</Link>
                <Link to="/about" className="block text-gray-400 hover:text-[#d4af37] transition-colors">À propos</Link>
                <Link to="/faq" className="block text-gray-400 hover:text-[#d4af37] transition-colors">FAQ</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#d4af37]">Légal</h4>
              <div className="space-y-2">
                <a href="https://fromsmash.com/EcFphSLM6R-ct" className="block text-gray-400 hover:text-[#d4af37] transition-colors">Conditions d'utilisation</a>
                <a href="https://fromsmash.com/EcFphSLM6R-ct" className="block text-gray-400 hover:text-[#d4af37] transition-colors">Politique de confidentialité</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-[#d4af37]">Contact</h4>
              <div className="space-y-2">
                <Link to="/contact" className="block text-gray-400 hover:text-[#d4af37] transition-colors">Formulaire de contact</Link>
                <a href="mailto:support@cashgold.com" className="block text-gray-400 hover:text-[#d4af37] transition-colors">support@cashgold.com</a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#d4af37]/20 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CashGold. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
