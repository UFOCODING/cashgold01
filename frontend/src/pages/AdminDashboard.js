import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, depositsRes, withdrawalsRes, usersRes] = await Promise.all([
        axios.get(`${API}/admin/stats`),
        axios.get(`${API}/admin/deposits`),
        axios.get(`${API}/admin/withdrawals`),
        axios.get(`${API}/admin/users`)
      ]);

      setStats(statsRes.data);
      setDeposits(depositsRes.data);
      setWithdrawals(withdrawalsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
      if (error.response?.status === 403) {
        toast.error(t('toast.accessDenied'));
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeposit = async (depositId) => {
    try {
      await axios.post(`${API}/admin/deposits/${depositId}/approve`);
      toast.success(t('toast.depositApproved'));
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || t('toast.error'));
    }
  };

  const handleRejectDeposit = async (depositId) => {
    if (!window.confirm(t('toast.rejectConfirm'))) return;

    try {
      await axios.post(`${API}/admin/deposits/${depositId}/reject`);
      toast.success(t('toast.depositRejected'));
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || t('toast.error'));
    }
  };

  const handleCompleteWithdrawal = async (withdrawalId) => {
    try {
      await axios.post(`${API}/admin/withdrawals/${withdrawalId}/complete`);
      toast.success(t('toast.withdrawCompleted'));
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || t('toast.error'));
    }
  };

  const handleSuspendUser = async (userId) => {
    if (!window.confirm(t('toast.suspendConfirm'))) return;

    try {
      await axios.post(`${API}/admin/users/${userId}/suspend`);
      toast.success(t('toast.userSuspended'));
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || t('toast.error'));
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await axios.post(`${API}/admin/users/${userId}/activate`);
      toast.success(t('toast.userActivated'));
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || t('toast.error'));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
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

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="glass border-b border-[#d4af37]/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-black font-bold text-xl">
              C
            </div>
            <span className="text-2xl font-bold gold-text">{t('admin.title')}</span>
          </Link>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Link to="/dashboard">
              <Button data-testid="user-dashboard-btn" variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
                {t('nav.userDashboard')}
              </Button>
            </Link>
            <Button data-testid="admin-logout-btn" onClick={handleLogout} variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
              {t('nav.logout')}
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass border-[#d4af37]/30">
            <CardHeader>
              <CardTitle className="text-gray-400 text-sm">{t('admin.totalUsers')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold gold-text" data-testid="total-users">{stats?.total_users || 0}</p>
            </CardContent>
          </Card>

          <Card className="glass border-[#d4af37]/30">
            <CardHeader>
              <CardTitle className="text-gray-400 text-sm">{t('admin.totalDeposits')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400" data-testid="total-deposits">${stats?.total_deposits?.toFixed(2) || '0.00'}</p>
            </CardContent>
          </Card>

          <Card className="glass border-[#d4af37]/30">
            <CardHeader>
              <CardTitle className="text-gray-400 text-sm">{t('admin.totalWithdrawals')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-400" data-testid="total-withdrawals">${stats?.total_withdrawals?.toFixed(2) || '0.00'}</p>
            </CardContent>
          </Card>

          <Card className="glass border-[#d4af37]/30">
            <CardHeader>
              <CardTitle className="text-gray-400 text-sm">{t('admin.platformProfit')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold gold-text" data-testid="platform-profit">${stats?.platform_profit?.toFixed(2) || '0.00'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="deposits" className="space-y-6">
          <TabsList className="glass w-full justify-start overflow-x-auto">
            <TabsTrigger data-testid="admin-tab-deposits" value="deposits" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
              {t('admin.tabs.deposits')} ({deposits.filter(d => d.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger data-testid="admin-tab-withdrawals" value="withdrawals" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
              {t('admin.tabs.withdrawals')} ({withdrawals.filter(w => w.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger data-testid="admin-tab-users" value="users" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
              {t('admin.tabs.users')} ({users.length})
            </TabsTrigger>
          </TabsList>

          {/* Deposits Tab */}
          <TabsContent value="deposits">
            <Card className="glass border-[#d4af37]/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t('admin.deposits.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                {deposits.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">{t('common.noDeposits')}</p>
                ) : (
                  <div className="space-y-4">
                    {deposits.map((dep) => {
                      const user = users.find(u => u.id === dep.user_id);
                      return (
                        <div key={dep.id} data-testid={`admin-deposit-${dep.id}`} className="glass-light rounded-xl p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-lg">${dep.amount.toFixed(2)}</p>
                              <p className="text-sm text-gray-400">{t('admin.deposits.user')}: {user?.username || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{user?.email || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{new Date(dep.created_at).toLocaleString()}</p>
                              {dep.tx_hash && <p className="text-xs text-gray-500 mt-1">TX: {dep.tx_hash}</p>}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              dep.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                              (dep.status === 'rejected' || dep.status === 'expired') ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {statusLabel(dep.status)}
                            </span>
                          </div>
                          {dep.status === 'pending' && (
                            <div className="flex space-x-3">
                              <Button
                                data-testid={`approve-deposit-${dep.id}`}
                                onClick={() => handleApproveDeposit(dep.id)}
                                className="btn-gold flex-1"
                              >
                                {t('admin.deposits.approve')}
                              </Button>
                              <Button
                                data-testid={`reject-deposit-${dep.id}`}
                                onClick={() => handleRejectDeposit(dep.id)}
                                variant="destructive"
                                className="flex-1"
                              >
                                {t('admin.deposits.reject')}
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdrawals Tab */}
          <TabsContent value="withdrawals">
            <Card className="glass border-[#d4af37]/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t('admin.withdrawals.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                {withdrawals.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">{t('common.noWithdrawals')}</p>
                ) : (
                  <div className="space-y-4">
                    {withdrawals.map((wtd) => {
                      const user = users.find(u => u.id === wtd.user_id);
                      return (
                        <div key={wtd.id} data-testid={`admin-withdrawal-${wtd.id}`} className="glass-light rounded-xl p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <p className="font-bold text-lg">${wtd.amount.toFixed(2)}</p>
                              <p className="text-sm text-gray-400">{t('admin.deposits.user')}: {user?.username || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{user?.email || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{new Date(wtd.created_at).toLocaleString()}</p>
                              <div className="mt-2 flex items-center space-x-2">
                                <p className="text-sm font-semibold text-[#d4af37]">{t('common.withdrawAddress')}</p>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(wtd.wallet_address);
                                    toast.success(t('toast.addressCopied'));
                                  }}
                                  className="text-xs bg-[#d4af37]/20 hover:bg-[#d4af37]/30 px-2 py-1 rounded transition-colors"
                                >
                                  {t('common.copy')}
                                </button>
                              </div>
                              <p className="text-xs text-white bg-black/50 p-2 rounded mt-1 font-mono break-all">{wtd.wallet_address}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              wtd.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              wtd.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {statusLabel(wtd.status)}
                            </span>
                          </div>
                          {wtd.status === 'pending' && (
                            <Button
                              data-testid={`complete-withdrawal-${wtd.id}`}
                              onClick={() => handleCompleteWithdrawal(wtd.id)}
                              className="btn-gold w-full"
                            >
                              {t('admin.withdrawals.complete')}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="glass border-[#d4af37]/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t('admin.users.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">{t('common.noUsers')}</p>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} data-testid={`admin-user-${user.id}`} className="glass-light rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-bold text-lg">{user.username}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">{t('admin.users.balance')}: </span>
                                <span className="text-white">${user.balance?.toFixed(2) || '0.00'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">{t('admin.users.invested')}: </span>
                                <span className="text-white">${user.invested_balance?.toFixed(2) || '0.00'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">{t('common.vip')}: </span>
                                <span className="gold-text">{user.vip_level}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">{t('common.admin')}: </span>
                                <span className={user.is_admin ? 'text-green-400' : 'text-gray-400'}>
                                  {user.is_admin ? t('common.yes') : t('common.no')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            {user.is_active ? (
                              <Button
                                data-testid={`suspend-user-${user.id}`}
                                onClick={() => handleSuspendUser(user.id)}
                                variant="destructive"
                                size="sm"
                              >
                                {t('admin.users.suspend')}
                              </Button>
                            ) : (
                              <Button
                                data-testid={`activate-user-${user.id}`}
                                onClick={() => handleActivateUser(user.id)}
                                className="btn-gold"
                                size="sm"
                              >
                                {t('admin.users.activate')}
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {user.is_active ? t('admin.users.active') : t('admin.users.suspended')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
