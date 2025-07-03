
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';

interface RestitutionsTabProps {
  user: User;
}

interface Restitution {
  id: string;
  date_restitution: string;
  confirmation: boolean;
  created_at: string;
  annonce: {
    id: string;
    titre: string;
    description: string;
    categorie: string;
    lieu: string;
  };
}

const RestitutionsTab = ({ user }: RestitutionsTabProps) => {
  const [restitutions, setRestitutions] = useState<Restitution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestitutions();
  }, [user]);

  const fetchRestitutions = async () => {
    try {
      const { data, error } = await supabase
        .from('restitutions')
        .select(`
          *,
          annonce:annonces(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRestitutions(data || []);
    } catch (error) {
      console.error('Error fetching restitutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmerRestitution = async (restitutionId: string) => {
    try {
      const { error } = await supabase
        .from('restitutions')
        .update({ confirmation: true })
        .eq('id', restitutionId)
        .eq('user_id', user.id);

      if (error) throw error;
      fetchRestitutions();
    } catch (error) {
      console.error('Error confirming restitution:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Historique des Restitutions</h2>

      <div className="grid gap-4">
        {restitutions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Aucune restitution pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          restitutions.map((restitution) => (
            <Card key={restitution.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{restitution.annonce?.titre}</CardTitle>
                    <CardDescription>
                      Restitué le {new Date(restitution.date_restitution).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {restitution.confirmation ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Confirmé
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600">
                        <Clock className="h-3 w-3 mr-1" />
                        En attente
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{restitution.annonce?.description}</p>
                <p className="text-xs text-gray-500 mb-4">
                  Catégorie: {restitution.annonce?.categorie} • Lieu: {restitution.annonce?.lieu}
                </p>
                
                {!restitution.confirmation && (
                  <Button 
                    size="sm" 
                    onClick={() => confirmerRestitution(restitution.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Confirmer la réception
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RestitutionsTab;
