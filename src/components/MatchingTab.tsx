
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface MatchingTabProps {
  user: User;
}

interface MatchResult {
  id: string;
  score: number;
  annonce_perte: any;
  annonce_retrouvee: any;
  created_at: string;
}

const MatchingTab = ({ user }: MatchingTabProps) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [user]);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matching')
        .select(`
          *,
          annonce_perte:annonces!matching_annonce_perte_id_fkey(*),
          annonce_retrouvee:annonces!matching_annonce_retrouvee_id_fkey(*)
        `)
        .or(`annonce_perte.user_id.eq.${user.id},annonce_retrouvee.user_id.eq.${user.id}`)
        .order('score', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMatches = async () => {
    try {
      // Récupérer toutes les annonces perdues et retrouvées
      const { data: annonces, error } = await supabase
        .from('annonces')
        .select('*')
        .in('status', ['perdu', 'retrouve']);

      if (error) throw error;

      const perdues = annonces?.filter(a => a.status === 'perdu') || [];
      const retrouvees = annonces?.filter(a => a.status === 'retrouve') || [];

      // Générer des correspondances basiques
      const newMatches = [];
      for (const perdue of perdues) {
        for (const retrouvee of retrouvees) {
          if (perdue.user_id !== retrouvee.user_id) {
            const score = calculateMatchScore(perdue, retrouvee);
            if (score > 30) {
              newMatches.push({
                annonce_perte_id: perdue.id,
                annonce_retrouvee_id: retrouvee.id,
                score
              });
            }
          }
        }
      }

      // Insérer les nouvelles correspondances
      if (newMatches.length > 0) {
        const { error: insertError } = await supabase
          .from('matching')
          .upsert(newMatches);

        if (insertError) throw insertError;
        fetchMatches();
      }
    } catch (error) {
      console.error('Error generating matches:', error);
    }
  };

  const calculateMatchScore = (perdue: any, retrouvee: any) => {
    let score = 0;
    
    // Correspondance de catégorie
    if (perdue.categorie.toLowerCase() === retrouvee.categorie.toLowerCase()) {
      score += 40;
    }
    
    // Correspondance de lieu
    if (perdue.lieu.toLowerCase() === retrouvee.lieu.toLowerCase()) {
      score += 30;
    }
    
    // Correspondance dans la description
    const mots1 = perdue.description.toLowerCase().split(' ');
    const mots2 = retrouvee.description.toLowerCase().split(' ');
    const motsCommuns = mots1.filter(mot => mots2.includes(mot) && mot.length > 3);
    score += motsCommuns.length * 10;
    
    return Math.min(score, 100);
  };

  if (loading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Correspondances</h2>
        <Button onClick={generateMatches}>
          <Search className="h-4 w-4 mr-2" />
          Rechercher des correspondances
        </Button>
      </div>

      <div className="grid gap-4">
        {matches.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Aucune correspondance trouvée</p>
            </CardContent>
          </Card>
        ) : (
          matches.map((match) => (
            <Card key={match.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Correspondance trouvée</CardTitle>
                  <Badge variant="secondary">{match.score}% de correspondance</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-red-400 pl-4">
                    <h4 className="font-semibold text-red-600">Objet perdu</h4>
                    <p className="font-medium">{match.annonce_perte?.titre}</p>
                    <p className="text-sm text-gray-600">{match.annonce_perte?.description}</p>
                    <p className="text-xs text-gray-500">
                      {match.annonce_perte?.lieu} • {match.annonce_perte?.categorie}
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h4 className="font-semibold text-blue-600">Objet retrouvé</h4>
                    <p className="font-medium">{match.annonce_retrouvee?.titre}</p>
                    <p className="text-sm text-gray-600">{match.annonce_retrouvee?.description}</p>
                    <p className="text-xs text-gray-500">
                      {match.annonce_retrouvee?.lieu} • {match.annonce_retrouvee?.categorie}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MatchingTab;
