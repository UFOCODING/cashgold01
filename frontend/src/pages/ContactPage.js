import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In MVP, just show success message
    toast.success('Message envoyé ! Nous vous répondrons bientôt.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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
            Contactez <span className="gold-text">CashGold</span>
          </h1>
          <p className="text-center text-gray-400 text-lg mb-12">
            Notre équipe est là pour répondre à toutes vos questions
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="glass-light rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-300 mb-2 block">Nom complet</Label>
                  <Input
                    id="name"
                    data-testid="contact-name-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-gold"
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300 mb-2 block">Email</Label>
                  <Input
                    id="email"
                    data-testid="contact-email-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-gold"
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-gray-300 mb-2 block">Sujet</Label>
                  <Input
                    id="subject"
                    data-testid="contact-subject-input"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input-gold"
                    placeholder="Sujet de votre message"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-300 mb-2 block">Message</Label>
                  <Textarea
                    id="message"
                    data-testid="contact-message-input"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="input-gold min-h-[150px]"
                    placeholder="Votre message..."
                    required
                  />
                </div>

                <Button data-testid="contact-submit-btn" type="submit" className="btn-gold w-full">
                  Envoyer le message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="glass-light rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Email</h3>
                    <p className="text-gray-400">support@cashgold.com</p>
                    <p className="text-sm text-gray-500 mt-1">Réponse sous 24h</p>
                  </div>
                </div>
              </div>

              <div className="glass-light rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Horaires</h3>
                    <p className="text-gray-400">Support 24/7</p>
                    <p className="text-sm text-gray-500 mt-1">Toujours disponibles pour vous</p>
                  </div>
                </div>
              </div>

              <div className="glass-light rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Localisation</h3>
                    <p className="text-gray-400">Service en ligne mondial</p>
                    <p className="text-sm text-gray-500 mt-1">Accessible de partout</p>
                  </div>
                </div>
              </div>

              <div className="glass-light rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-4">Besoin d'aide immédiate ?</h3>
                <p className="text-gray-400 mb-4">
                  Consultez notre page FAQ pour des réponses rapides aux questions courantes.
                </p>
                <Link to="/faq">
                  <Button variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black w-full">
                    Voir la FAQ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
