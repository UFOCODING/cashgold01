import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    referral_code: refCode || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('toast.passwordMismatch'));
      return;
    }

    if (formData.password.length < 8) {
      toast.error(t('toast.passwordTooShort'));
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/register`, {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        referral_code: formData.referral_code || null
      });

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success(t('toast.registerSuccess'));
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || t('toast.registerError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-2xl">
              C
            </div>
            <span className="text-3xl font-bold gold-text">CashGold</span>
          </Link>
          <h1 className="text-4xl font-bold mb-2">{t('auth.registerTitle')}</h1>
          <p className="text-gray-400">{t('auth.registerSubtitle')}</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-300 mb-2 block">{t('auth.email')}</Label>
              <Input
                id="email"
                data-testid="register-email-input"
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
              <Label htmlFor="username" className="text-gray-300 mb-2 block">{t('auth.username')}</Label>
              <Input
                id="username"
                data-testid="register-username-input"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-gold"
                placeholder="votrenom"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300 mb-2 block">{t('auth.password')}</Label>
              <Input
                id="password"
                data-testid="register-password-input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-gold"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">{t('auth.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                data-testid="register-confirm-password-input"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-gold"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <Label htmlFor="referral_code" className="text-gray-300 mb-2 block">{t('auth.referralCode')}</Label>
              <Input
                id="referral_code"
                data-testid="register-referral-input"
                type="text"
                name="referral_code"
                value={formData.referral_code}
                onChange={handleChange}
                className="input-gold"
                placeholder="Code de parrainage"
              />
            </div>

            <Button
              data-testid="register-submit-btn"
              type="submit"
              className="btn-gold w-full"
              disabled={loading}
            >
              {loading ? '...' : t('auth.signUp')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t('auth.haveAccount')}{' '}
              <Link to="/login" className="text-[#d4af37] hover:underline">
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-[#d4af37] transition-colors">
            ← {t('common.backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
