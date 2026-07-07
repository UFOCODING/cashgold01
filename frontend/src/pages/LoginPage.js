import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (response.data.user.is_admin) {
        toast.success(t('toast.adminLoginSuccess'));
        navigate('/admin');
      } else {
        toast.success(t('toast.loginSuccess'));
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || t('toast.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
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
          <h1 className="text-4xl font-bold mb-2">{t('auth.loginTitle')}</h1>
          <p className="text-gray-400">{t('auth.loginSubtitle')}</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-300 mb-2 block">{t('auth.email')}</Label>
              <Input
                id="email"
                data-testid="login-email-input"
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
              <Label htmlFor="password" className="text-gray-300 mb-2 block">{t('auth.password')}</Label>
              <Input
                id="password"
                data-testid="login-password-input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-gold"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              data-testid="login-submit-btn"
              type="submit"
              className="btn-gold w-full"
              disabled={loading}
            >
              {loading ? '...' : t('auth.signIn')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="text-[#d4af37] hover:underline">
                {t('auth.signUp')}
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

export default LoginPage;
