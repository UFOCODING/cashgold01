import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const AboutPage = () => {
  const { t } = useLanguage();
  const whyItems = t('aboutPage.whyItems');
  const values = t('aboutPage.values');
  const valueIcons = [
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    "M13 10V3L4 14h7v7l9-11h-7z"
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
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center">
            {t('aboutPage.title')} <span className="gold-text">{t('aboutPage.titleGold')}</span>
          </h1>

          <div className="space-y-8">
            <div className="glass-light rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 gold-text">{t('aboutPage.missionTitle')}</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{t('aboutPage.missionText')}</p>
            </div>

            <div className="glass-light rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 gold-text">{t('aboutPage.visionTitle')}</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{t('aboutPage.visionText')}</p>
            </div>

            <div className="glass-light rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 gold-text">{t('aboutPage.whyTitle')}</h2>
              <div className="space-y-4 text-gray-300 text-lg">
                {(Array.isArray(whyItems) ? whyItems : []).map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <span className="text-[#d4af37] text-2xl">✓</span>
                    <p><strong>{item.bold}</strong> - {item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-light rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 gold-text">{t('aboutPage.valuesTitle')}</h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                {(Array.isArray(values) ? values : []).map((val, idx) => (
                  <div key={idx} className="text-center">
                    <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={valueIcons[idx]} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{val.title}</h3>
                    <p className="text-gray-400">{val.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <h2 className="text-3xl font-bold mb-6">
                {t('aboutPage.ctaTitle')} <span className="gold-text">{t('aboutPage.ctaTitleGold')}</span> ?
              </h2>
              <Link to="/register">
                <Button className="btn-gold text-lg px-10 py-6">
                  {t('aboutPage.ctaBtn')}
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
