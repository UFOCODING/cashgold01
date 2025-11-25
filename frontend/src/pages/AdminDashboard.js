import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
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
        toast.error('Accès refusé. Droits administrateur requis.');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeposit = async (depositId) => {
    try {
      await axios.post(`${API}/admin/deposits/${depositId}/approve`);
      toast.success('Dépôt approuvé !');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur');
    }
  };

  const handleRejectDeposit = async (depositId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir rejeter ce dépôt ?')) return;

    try {
      await axios.post(`${API}/admin/deposits/${depositId}/reject`);
      toast.success('Dépôt rejeté');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur');
    }
  };

  const handleCompleteWithdrawal = async (withdrawalId) => {
    try {
      await axios.post(`${API}/admin/withdrawals/${withdrawalId}/complete`);
      toast.success('Retrait complété !');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur');
    }
  };

  const handleSuspendUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir suspendre cet utilisateur ?')) return;

    try {
      await axios.post(`${API}/admin/users/${userId}/suspend`);
      toast.success('Utilisateur suspendu');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur');
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await axios.post(`${API}/admin/users/${userId}/activate`);
      toast.success('Utilisateur activé');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement...</p>
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
            <span className="text-2xl font-bold gold-text">CashGold Admin</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button data-testid="user-dashboard-btn" variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
                Dashboard Utilisateur
              </Button>
            </Link>
            <Button data-testid="admin-logout-btn" onClick={handleLogout} variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass border-[#d4af37]/30">
            <CardHeader>
              <CardTitle className="text-gray-400 text-sm">Utilisateurs totaux</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold gold-text" data-testid="total-users">{stats?.total_users || 0}</p>
            </CardContent>
          </Card>

          <Card className="glass border-[#d4af37]/30">
            <CardHeader>
              <CardTitle className="text-gray-400 text-sm">Dépôts totaux</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400" data-testid="total-deposits">${stats?.total_deposits?.toFixed(2) || '0.00'}</p>
            </CardContent>
          </Card>

          <Card className="glass border-[#d4af37]/30">
            <CardHeader>
              <CardTitle className="text-gray-400 text-sm">Retraits totaux</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-400" data-testid="total-withdrawals">${stats?.total_withdrawals?.toFixed(2) || '0.00'}</p>
            </CardContent>
          </Card>

          <Card className="glass border-[#d4af37]/30">
            <CardHeader>
              <CardTitle className="text-gray-400 text-sm">Profit plateforme</CardTitle>
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
              Dépôts ({deposits.filter(d => d.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger data-testid="admin-tab-withdrawals" value="withdrawals" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
              Retraits ({withdrawals.filter(w => w.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger data-testid="admin-tab-users" value="users" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
              Utilisateurs ({users.length})
            </TabsTrigger>
          </TabsList>

          {/* Deposits Tab */}
          <TabsContent value="deposits">
            <Card className="glass border-[#d4af37]/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Gestion des dépôts</CardTitle>
              </CardHeader>
              <CardContent>
                {deposits.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Aucun dépôt</p>
                ) : (
                  <div className="space-y-4">
                    {deposits.map((dep) => {
                      const user = users.find(u => u.id === dep.user_id);
                      return (
                        <div key={dep.id} data-testid={`admin-deposit-${dep.id}`} className="glass-light rounded-xl p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-lg">${dep.amount.toFixed(2)}</p>
                              <p className="text-sm text-gray-400">Utilisateur: {user?.username || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{user?.email || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{new Date(dep.created_at).toLocaleString()}</p>
                              {dep.tx_hash && <p className="text-xs text-gray-500 mt-1">TX: {dep.tx_hash}</p>}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              dep.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                              dep.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {dep.status === 'approved' ? 'Approuvé' : dep.status === 'rejected' ? 'Rejeté' : 'En attente'}
                            </span>
                          </div>
                          {dep.status === 'pending' && (
                            <div className="flex space-x-3">
                              <Button
                                data-testid={`approve-deposit-${dep.id}`}
                                onClick={() => handleApproveDeposit(dep.id)}
                                className="btn-gold flex-1"
                              >
                                Approuver
                              </Button>
                              <Button
                                data-testid={`reject-deposit-${dep.id}`}
                                onClick={() => handleRejectDeposit(dep.id)}
                                variant="destructive"
                                className="flex-1"
                              >
                                Rejeter
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
                <CardTitle className="text-2xl font-bold">Gestion des retraits</CardTitle>
              </CardHeader>
              <CardContent>
                {withdrawals.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Aucun retrait</p>
                ) : (
                  <div className="space-y-4">
                    {withdrawals.map((wtd) => {
                      const user = users.find(u => u.id === wtd.user_id);
                      return (
                        <div key={wtd.id} data-testid={`admin-withdrawal-${wtd.id}`} className="glass-light rounded-xl p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-lg">${wtd.amount.toFixed(2)}</p>
                              <p className="text-sm text-gray-400">Utilisateur: {user?.username || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{user?.email || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{new Date(wtd.created_at).toLocaleString()}</p>
                              <p className="text-xs text-gray-500 mt-1">Wallet: {wtd.wallet_address}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              wtd.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              wtd.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {wtd.status === 'completed' ? 'Complété' : wtd.status === 'rejected' ? 'Rejeté' : 'En attente'}
                            </span>
                          </div>
                          {wtd.status === 'pending' && (
                            <Button
                              data-testid={`complete-withdrawal-${wtd.id}`}
                              onClick={() => handleCompleteWithdrawal(wtd.id)}
                              className="btn-gold w-full"
                            >
                              Marquer comme complété
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
                <CardTitle className="text-2xl font-bold">Gestion des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Aucun utilisateur</p>
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
                                <span className="text-gray-500">Solde: </span>
                                <span className="text-white">${user.balance?.toFixed(2) || '0.00'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Investi: </span>
                                <span className="text-white">${user.invested_balance?.toFixed(2) || '0.00'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">VIP: </span>
                                <span className="gold-text">{user.vip_level}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Admin: </span>
                                <span className={user.is_admin ? 'text-green-400' : 'text-gray-400'}>
                                  {user.is_admin ? 'Oui' : 'Non'}
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
                                Suspendre
                              </Button>
                            ) : (
                              <Button
                                data-testid={`activate-user-${user.id}`}
                                onClick={() => handleActivateUser(user.id)}
                                className="btn-gold"
                                size="sm"
                              >
                                Activer
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {user.is_active ? 'Actif' : 'Suspendu'}
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
