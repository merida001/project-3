
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface AnnoncesTabProps {
  user: User;
}

interface Annonce {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  lieu: string;
  date_perte: string;
  status: 'perdu' | 'retrouve' | 'rendu';
  created_at: string;
  image_url?: string;
}

const AnnoncesTab = ({ user }: AnnoncesTabProps) => {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: '',
    lieu: '',
    date_perte: '',
    status: 'perdu' as 'perdu' | 'retrouve' | 'rendu'
  });

  useEffect(() => {
    fetchAnnonces();
  }, [user]);

  const fetchAnnonces = async () => {
    try {
      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnonces(data || []);
    } catch (error) {
      console.error('Error fetching annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('annonces')
        .insert([
          {
            ...formData,
            user_id: user.id
          }
        ]);

      if (error) throw error;
      
      setFormData({
        titre: '',
        description: '',
        categorie: '',
        lieu: '',
        date_perte: '',
        status: 'perdu'
      });
      setIsDialogOpen(false);
      fetchAnnonces();
    } catch (error) {
      console.error('Error creating annonce:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'perdu': return 'bg-red-100 text-red-800';
      case 'retrouve': return 'bg-blue-100 text-blue-800';
      case 'rendu': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mes Annonces</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle annonce
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer une annonce</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                required
              />
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <Input
                placeholder="Catégorie"
                value={formData.categorie}
                onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                required
              />
              <Input
                placeholder="Lieu"
                value={formData.lieu}
                onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                required
              />
              <Input
                type="date"
                value={formData.date_perte}
                onChange={(e) => setFormData({ ...formData, date_perte: e.target.value })}
                required
              />
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perdu">Perdu</SelectItem>
                  <SelectItem value="retrouve">Retrouvé</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">
                Créer l'annonce
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {annonces.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Aucune annonce pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          annonces.map((annonce) => (
            <Card key={annonce.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{annonce.titre}</CardTitle>
                    <CardDescription>{annonce.lieu} • {new Date(annonce.date_perte).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(annonce.status)}>
                    {annonce.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{annonce.description}</p>
                <p className="text-xs text-gray-500">Catégorie: {annonce.categorie}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnoncesTab;
