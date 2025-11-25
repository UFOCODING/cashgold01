import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const Verify2FAPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem('pending_email');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Session expirée. Veuillez vous reconnecter.');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/verify-2fa`, {
        email,
        code
      });

      localStorage.removeItem('pending_email');
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Vérification réussie !');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Code de vérification invalide');
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
          <h1 className="text-4xl font-bold mb-2">Vérification 2FA</h1>
          <p className="text-gray-400">Entrez le code de vérification envoyé à votre email</p>
          <p className="text-sm text-gray-500 mt-2">(Consultez les logs du serveur backend)</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="code" className="text-gray-300 mb-2 block">Code de vérification (6 chiffres)</Label>
              <Input
                id="code"
                data-testid="verify-2fa-code-input"
                type="text"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input-gold text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <Button
              data-testid="verify-2fa-submit-btn"
              type="submit"
              className="btn-gold w-full"
              disabled={loading || code.length !== 6}
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Vous n'avez pas reçu le code ?{' '}
              <button className="text-[#d4af37] hover:underline">
                Renvoyer
              </button>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/login" className="text-gray-400 hover:text-[#d4af37] transition-colors">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verify2FAPage;
