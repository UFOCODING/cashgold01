import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [depositWallet, setDepositWallet] = useState('');
  const [loading, setLoading] = useState(true);

  const [depositAmount, setDepositAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawWallet, setWithdrawWallet] = useState('');
  const [investAmount, setInvestAmount] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userRes, depositsRes, withdrawalsRes, investmentsRes, referralsRes, walletRes] = await Promise.all([
        axios.get(`${API}/auth/me`),
        axios.get(`${API}/deposits/my`),
        axios.get(`${API}/withdrawals/my`),
        axios.get(`${API}/investments/my`),
        axios.get(`${API}/referrals/my`),
        axios.get(`${API}/deposits/wallet`)
      ]);

      setUser(userRes.data);
      setDeposits(depositsRes.data);
      setWithdrawals(withdrawalsRes.data);
      setInvestments(investmentsRes.data);
      setReferrals(referralsRes.data);
      setDepositWallet(walletRes.data.wallet_address);
      localStorage.setItem('user', JSON.stringify(userRes.data));
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/deposits`, {
        amount: parseFloat(depositAmount),
        tx_hash: txHash || null
      });
      toast.success(t('toast.depositSubmitted'));
      setDepositAmount('');
      setTxHash('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || t('toast.depositError'));
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/withdrawals`, {
        amount: parseFloat(withdrawAmount),
        wallet_address: withdrawWallet
      });
      toast.success(t('toast.withdrawSubmitted'));
      setWithdrawAmount('');
      setWithdrawWallet('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || t('toast.withdrawError'));
    }
  };

  const handleInvest = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/investments`, {
        amount: parseFloat(investAmount)
      });
      toast.success(`${t('toast.investCreated')} ${response.data.vip_level}`);
      setInvestAmount('');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || t('toast.investError'));
    }
  };

  const handleStopInvestment = async (investmentId) => {
    if (!window.confirm(t('toast.stopConfirm'))) return;

    try {
      await axios.post(`${API}/investments/${investmentId}/stop`);
      toast.success(t('toast.investStopped'));
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || t('toast.error'));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(t('common.copied'));
  };

  const statusLabel = (status) => {
    const map = {
      approved: t('dashboard.status.approved'),
      rejected: t('dashboard.status.rejected'),
      completed: t('dashboard.status.completed'),
      processing: t('dashboard.status.processing'),
      pending: t('dashboard.status.pending'),
      expired: t('dashboard.status.rejected')
    };
    return map[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const vipLevels = [
    { level: 1, name: 'VIP 1', min: 10, max: 99 },
    { level: 2, name: 'VIP 2', min: 100, max: 499 },
    { level: 3, name: 'VIP 3', min: 500, max: 999 },
    { level: 4, name: 'VIP 4', min: 1000, max: 4999 },
    { level: 5, name: 'VIP 5', min: 5000, max: Infinity }
  ];

  const currentVIP = vipLevels.find(v => v.level === user?.vip_level) || vipLevels[0];

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="glass border-b border-[#d4af37]/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-xl">
              C
            </div>
            <span className="text-2xl font-bold gold-text">CashGold</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-400">{t('dashboard.hello')}</p>
              <p className="font-semibold text-[#d4af37]" data-testid="user-name">{user?.username}</p>
            </div>
            <LanguageSelector />
            {user?.is_admin && (
              <Link to="/admin">
                <Button data-testid="admin-panel-btn" variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
                  {t('nav.admin')}
                </Button>
              </Link>
            )}
            <Button data-testid="logout-btn" onClick={handleLogout} variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
              {t('nav.logout')}
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass border-[#d4af37]/30">
            <CardHeader>
              <CardTitle className="text-gray-400 text-sm">{t('dashboard.availableBalance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold gold-text" data-testid="balance-available">${user?.balance?.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="glass border-[#d4af37]/30">
            <CardHeader>
              <CardTitle className="text-gray-400 text-sm">{t('dashboard.investedBalance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white" data-testid="balance-invested">${user?.invested_balance?.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="glass border-[#d4af37]/30">
            <CardHeader>
              <CardTitle className="text-gray-400 text-sm">{t('dashboard.totalProfits')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400" data-testid="total-profits">${user?.total_profits?.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="glass border-[#d4af37]/30">
            <CardHeader>
              <CardTitle className="text-gray-400 text-sm">{t('dashboard.vipLevel')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold gold-text" data-testid="vip-level">{currentVIP.name}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="invest" className="space-y-6">
          <TabsList className="glass w-full justify-start overflow-x-auto">
            <TabsTrigger data-testid="tab-invest" value="invest" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">{t('dashboard.tabs.invest')}</TabsTrigger>
            <TabsTrigger data-testid="tab-deposit" value="deposit" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">{t('dashboard.tabs.deposit')}</TabsTrigger>
            <TabsTrigger data-testid="tab-withdraw" value="withdraw" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">{t('dashboard.tabs.withdraw')}</TabsTrigger>
            <TabsTrigger data-testid="tab-history" value="history" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">{t('dashboard.tabs.history')}</TabsTrigger>
            <TabsTrigger data-testid="tab-referral" value="referral" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">{t('dashboard.tabs.referral')}</TabsTrigger>
          </TabsList>

          {/* Invest Tab */}
          <TabsContent value="invest" className="space-y-6">
            <Card className="glass border-[#d4af37]/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t('dashboard.invest.title')}</CardTitle>
                <CardDescription className="text-gray-400">{t('dashboard.invest.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInvest} className="space-y-4">
                  <div>
                    <Label className="text-gray-300 mb-2 block">{t('dashboard.invest.amount')}</Label>
                    <Input
                      data-testid="invest-amount-input"
                      type="number"
                      step="0.01"
                      min="10"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      className="input-gold"
                      placeholder={t('dashboard.invest.min')}
                      required
                    />
                  </div>
                  <Button data-testid="invest-submit-btn" type="submit" className="btn-gold w-full">{t('dashboard.invest.button')}</Button>
                </form>
              </CardContent>
            </Card>

            {/* Active Investments */}
            <Card className="glass border-[#d4af37]/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t('dashboard.invest.active')}</CardTitle>
              </CardHeader>
              <CardContent>
                {investments.filter(inv => inv.is_active).length === 0 ? (
                  <p className="text-gray-400 text-center py-8">{t('dashboard.invest.noActive')}</p>
                ) : (
                  <div className="space-y-4">
                    {investments.filter(inv => inv.is_active).map((inv) => (
                      <div key={inv.id} data-testid={`investment-${inv.id}`} className="glass-light rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold">${inv.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-400">VIP {inv.vip_level} - {inv.daily_return_rate}%/{t('common.day')}</p>
                          <p className="text-sm text-green-400">{t('dashboard.invest.earned')}: ${inv.total_earned.toFixed(2)}</p>
                        </div>
                        <Button
                          data-testid={`stop-investment-${inv.id}`}
                          onClick={() => handleStopInvestment(inv.id)}
                          variant="destructive"
                          size="sm"
                        >
                          {t('dashboard.invest.stop')}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deposit Tab */}
          <TabsContent value="deposit" className="space-y-6">
            <Card className="glass border-[#d4af37]/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t('dashboard.deposit.title')}</CardTitle>
                <CardDescription className="text-gray-400">{t('dashboard.deposit.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="glass-light rounded-xl p-6">
                  <Label className="text-gray-300 mb-2 block">{t('dashboard.deposit.address')}</Label>
                  <div className="flex space-x-2">
                    <Input
                      data-testid="deposit-wallet-address"
                      value={depositWallet}
                      readOnly
                      className="input-gold flex-1"
                    />
                    <Button
                      data-testid="copy-wallet-btn"
                      onClick={() => copyToClipboard(depositWallet)}
                      variant="outline"
                      className="border-[#d4af37] text-[#d4af37]"
                    >
                      {t('dashboard.deposit.copy')}
                    </Button>
                  </div>
                </div>

                <form onSubmit={handleDeposit} className="space-y-4">
                  <div>
                    <Label className="text-gray-300 mb-2 block">{t('dashboard.deposit.amount')}</Label>
                    <Input
                      data-testid="deposit-amount-input"
                      type="number"
                      step="0.01"
                      min="10"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="input-gold"
                      placeholder={t('dashboard.invest.min')}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">{t('dashboard.deposit.txHash')}</Label>
                    <Input
                      data-testid="deposit-tx-hash-input"
                      type="text"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      className="input-gold"
                      placeholder="Hash"
                    />
                  </div>
                  <Button data-testid="deposit-submit-btn" type="submit" className="btn-gold w-full">{t('dashboard.deposit.button')}</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdraw Tab */}
          <TabsContent value="withdraw" className="space-y-6">
            <Card className="glass border-[#d4af37]/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t('dashboard.withdraw.title')}</CardTitle>
                <CardDescription className="text-gray-400">{t('dashboard.withdraw.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div>
                    <Label className="text-gray-300 mb-2 block">{t('dashboard.withdraw.amount')}</Label>
                    <Input
                      data-testid="withdraw-amount-input"
                      type="number"
                      step="0.01"
                      min="10"
                      max={user?.balance}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="input-gold"
                      placeholder={`${t('dashboard.withdraw.available')}: $${user?.balance?.toFixed(2)}`}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">{t('dashboard.withdraw.wallet')}</Label>
                    <Input
                      data-testid="withdraw-wallet-input"
                      type="text"
                      value={withdrawWallet}
                      onChange={(e) => setWithdrawWallet(e.target.value)}
                      className="input-gold"
                      placeholder="T..."
                      required
                    />
                  </div>
                  <Button data-testid="withdraw-submit-btn" type="submit" className="btn-gold w-full">{t('dashboard.withdraw.button')}</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="glass border-[#d4af37]/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t('dashboard.deposit.history')}</CardTitle>
              </CardHeader>
              <CardContent>
                {deposits.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">{t('dashboard.deposit.noDeposits')}</p>
                ) : (
                  <div className="space-y-3">
                    {deposits.map((dep) => (
                      <div key={dep.id} data-testid={`deposit-${dep.id}`} className="glass-light rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold">${dep.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-400">{new Date(dep.created_at).toLocaleString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          dep.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          (dep.status === 'rejected' || dep.status === 'expired') ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {statusLabel(dep.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-[#d4af37]/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t('dashboard.withdraw.history')}</CardTitle>
              </CardHeader>
              <CardContent>
                {withdrawals.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">{t('dashboard.withdraw.noWithdrawals')}</p>
                ) : (
                  <div className="space-y-3">
                    {withdrawals.map((wtd) => (
                      <div key={wtd.id} data-testid={`withdrawal-${wtd.id}`} className="glass-light rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold">${wtd.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-400">{new Date(wtd.created_at).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{wtd.wallet_address}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          wtd.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          wtd.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {statusLabel(wtd.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referral Tab */}
          <TabsContent value="referral" className="space-y-6">
            <Card className="glass border-[#d4af37]/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t('dashboard.referral.title')}</CardTitle>
                <CardDescription className="text-gray-400">{t('dashboard.referral.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="glass-light rounded-xl p-6">
                  <Label className="text-gray-300 mb-2 block">{t('dashboard.referral.yourLink')}</Label>
                  <div className="flex space-x-2">
                    <Input
                      data-testid="referral-link"
                      value={`${window.location.origin}/register?ref=${user?.referral_code}`}
                      readOnly
                      className="input-gold flex-1"
                    />
                    <Button
                      data-testid="copy-referral-btn"
                      onClick={() => copyToClipboard(`${window.location.origin}/register?ref=${user?.referral_code}`)}
                      variant="outline"
                      className="border-[#d4af37] text-[#d4af37]"
                    >
                      {t('dashboard.deposit.copy')}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">{t('dashboard.referral.myReferrals')} ({referrals.length})</h3>
                  {referrals.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">{t('dashboard.referral.noReferrals')}</p>
                  ) : (
                    <div className="space-y-3">
                      {referrals.map((ref, idx) => (
                        <div key={idx} data-testid={`referral-${idx}`} className="glass-light rounded-xl p-4">
                          <p className="font-bold">{ref.username}</p>
                          <p className="text-sm text-gray-400">{ref.email}</p>
                          <p className="text-sm text-green-400">{t('dashboard.referral.bonusEarned')}: ${ref.bonus_earned?.toFixed(2) || '0.00'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
