import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
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

      if (response.data.requires_2fa) {
        localStorage.setItem('pending_email', formData.email);
        toast.success('Code de vérification envoyé par email (consultez les logs)');
        navigate('/verify-2fa');
      } else {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Connexion réussie !');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-2xl">
              C
            </div>
            <span className="text-3xl font-bold gold-text">CashGold</span>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Connexion</h1>
          <p className="text-gray-400">Accédez à votre tableau de bord</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-300 mb-2 block">Email</Label>
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
              <Label htmlFor="password" className="text-gray-300 mb-2 block">Mot de passe</Label>
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
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-[#d4af37] hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-[#d4af37] transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
