
# CampusLostFound - Plateforme d'objets perdus et retrouvés

Une application web moderne pour gérer les objets perdus et retrouvés dans un campus universitaire.

## 🚀 Fonctionnalités

- **Authentification** : Inscription/Connexion avec Supabase Auth
- **Gestion d'annonces** : Créer, modifier, supprimer des annonces d'objets perdus/retrouvés
- **Matching automatique** : Algorithme de correspondance entre objets perdus et retrouvés
- **Historique des restitutions** : Suivi des objets rendus
- **Interface admin** : Gestion des utilisateurs et statistiques

## 🛠️ Technologies utilisées

- **Frontend** : React 18 + TypeScript + Vite
- **Backend** : Supabase (PostgreSQL + Auth + Storage)
- **Styling** : Tailwind CSS + shadcn/ui
- **State Management** : React Query

## 📦 Installation

1. **Cloner le projet**
   ```bash
   git clone [URL_DU_REPO]
   cd campuslostfound
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration Supabase**
   
   a. Créer un projet sur [supabase.com](https://supabase.com)
   
   b. Copier `.env.example` vers `.env` et remplir les variables :
   ```bash
   cp .env.example .env
   ```
   
   c. Dans `.env`, remplacer par vos vraies valeurs :
   ```env
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_clé_anon_key
   ```

4. **Créer la base de données**
   
   Dans le SQL Editor de Supabase, exécuter le contenu du fichier `sql/schema.sql`

5. **Lancer l'application**
   ```bash
   npm run dev
   ```

## 🗂️ Structure du projet

```
src/
├── components/
│   ├── ui/              # Composants shadcn/ui
│   ├── AuthPage.tsx     # Page d'authentification
│   ├── Dashboard.tsx    # Tableau de bord principal
│   ├── AnnoncesTab.tsx  # Gestion des annonces
│   ├── MatchingTab.tsx  # Correspondances
│   ├── RestitutionsTab.tsx # Historique restitutions
│   └── AdminTab.tsx     # Interface admin
├── lib/
│   └── supabase.ts      # Configuration Supabase
├── pages/
│   ├── Index.tsx        # Page principale
│   └── NotFound.tsx     # Page 404
└── main.tsx            # Point d'entrée
```

## 📊 Schéma de base de données

- **users** : Profils utilisateurs avec rôles (anonymous, registered, admin)
- **annonces** : Objets perdus/retrouvés avec détails
- **matching** : Correspondances automatiques avec scores
- **restitutions** : Historique des objets rendus

## 🔐 Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Chaque utilisateur ne peut modifier que ses propres données
- Les administrateurs ont accès complet
- Authentification gérée par Supabase Auth

## 🎯 Utilisation

1. **S'inscrire/Se connecter** sur la page d'accueil
2. **Créer une annonce** d'objet perdu ou retrouvé
3. **Consulter les correspondances** automatiques
4. **Marquer comme rendu** quand un objet est récupéré
5. **Administration** (pour les admins) : gérer utilisateurs et statistiques

## 🔧 Développement

### Scripts disponibles

- `npm run dev` : Serveur de développement
- `npm run build` : Build de production
- `npm run preview` : Aperçu du build

### Structure des composants

Chaque composant est conçu pour être :
- **Réutilisable** : Logique métier séparée de l'affichage
- **Typé** : Types TypeScript stricts
- **Accessible** : Compatible avec les standards d'accessibilité

## 🚀 Déploiement

1. Connecter votre repo GitHub à Vercel/Netlify
2. Ajouter les variables d'environnement Supabase
3. Déployer automatiquement à chaque push

## 📝 TODO / Améliorations

- [ ] Upload d'images pour les annonces
- [ ] Notifications push/email
- [ ] API WhatsApp pour notifications
- [ ] Système de géolocalisation
- [ ] Export des données (CSV/PDF)
- [ ] Mode sombre

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Note importante** : N'oubliez pas de configurer Supabase et d'exécuter le script SQL avant de lancer l'application !
