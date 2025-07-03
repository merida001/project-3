
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Plus, Search, History, Settings } from 'lucide-react';
import AnnoncesTab from './AnnoncesTab';
import MatchingTab from './MatchingTab';
import AdminTab from './AdminTab';
import RestitutionsTab from './RestitutionsTab';

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalAnnonces: 0,
    objetsRetrouve: 0,
    matchingScore: 0
  });

  useEffect(() => {
    fetchUserProfile();
    fetchStats();
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // Create user profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || '',
              role: 'registered'
            }
          ]);
        
        if (!insertError) {
          setUserProfile({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || '',
            role: 'registered'
          });
        }
      } else if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: annonces } = await supabase
        .from('annonces')
        .select('*')
        .eq('user_id', user.id);

      const { data: restitutions } = await supabase
        .from('restitutions')
        .select('*')
        .eq('user_id', user.id);

      setStats({
        totalAnnonces: annonces?.length || 0,
        objetsRetrouve: restitutions?.length || 0,
        matchingScore: Math.floor(Math.random() * 100) // Placeholder
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Campus<span className="text-blue-600">LostFound</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bonjour, {userProfile?.name || user.email}
              </span>
              {userProfile?.role === 'admin' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Admin
                </span>
              )}
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mes annonces</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnnonces}</div>
              <p className="text-xs text-muted-foreground">
                Total d'annonces créées
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objets rendus</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.objetsRetrouve}</div>
              <p className="text-xs text-muted-foreground">
                Objets récupérés avec succès
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Matching</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.matchingScore}%</div>
              <p className="text-xs text-muted-foreground">
                Efficacité de nos suggestions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="annonces" className="space-y-4">
          <TabsList>
            <TabsTrigger value="annonces">Mes Annonces</TabsTrigger>
            <TabsTrigger value="matching">Matching</TabsTrigger>
            <TabsTrigger value="restitutions">Restitutions</TabsTrigger>
            {userProfile?.role === 'admin' && (
              <TabsTrigger value="admin">Administration</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="annonces">
            <AnnoncesTab user={user} />
          </TabsContent>
          
          <TabsContent value="matching">
            <MatchingTab user={user} />
          </TabsContent>
          
          <TabsContent value="restitutions">
            <RestitutionsTab user={user} />
          </TabsContent>
          
          {userProfile?.role === 'admin' && (
            <TabsContent value="admin">
              <AdminTab />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
