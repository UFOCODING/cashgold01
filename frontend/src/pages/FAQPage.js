import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const FAQPage = () => {
  const { t } = useLanguage();
  const faqs = t('faqPage.faqs');

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
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Link to="/">
              <Button variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
                {t('common.backHome')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            {t('faqPage.title')} <span className="gold-text">{t('faqPage.titleGold')}</span>
          </h1>
          <p className="text-center text-gray-400 text-lg mb-12">
            {t('faqPage.subtitle')}
          </p>

          <div className="glass-light rounded-2xl p-8">
            <Accordion type="single" collapsible className="space-y-4">
              {(Array.isArray(faqs) ? faqs : []).map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  data-testid={`faq-item-${index}`}
                  className="border border-[#d4af37]/20 rounded-xl px-6 py-2"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:text-[#d4af37] hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 text-base leading-relaxed pt-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('faqPage.notFoundTitle')}
            </h2>
            <p className="text-gray-400 mb-6">
              {t('faqPage.notFoundSubtitle')}
            </p>
            <Link to="/contact">
              <Button className="btn-gold text-lg px-8 py-6">
                {t('faqPage.contactBtn')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
