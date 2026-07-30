# CashGold - Guide de déploiement (Vercel + Supabase + Railway)

Ce guide explique comment déployer CashGold gratuitement avec :
- **Frontend**: Vercel (gratuit et illimité)
- **Backend**: Railway (plan gratuit avec $5 crédit/mois)
- **Base de données**: Supabase (PostgreSQL gratuit jusqu'à 500MB)

## Prérequis

- Un compte GitHub
- Un compte Vercel (https://vercel.com)
- Un compte Railway (https://railway.app)
- Un compte Supabase (https://supabase.com)
- Le code du projet sur GitHub

## Structure du projet

```
CASHGOLD/
├── frontend/          # Application React
│   ├── src/
│   ├── package.json
│   └── vercel.json    # Configuration Vercel
├── new_backend/       # API FastAPI
│   ├── main.py
│   ├── requirements.txt
│   ├── create_admin.py
│   └── railway.toml   # Configuration Railway
└── DEPLOYMENT.md      # Ce fichier
```

## Étape 1: Créer la base de données Supabase

1. Connectez-vous à Supabase (https://supabase.com)
2. Cliquez sur "New Project"
3. Remplissez le formulaire:
   - **Name**: cashgold-db
   - **Database Password**: Choisissez un mot de passe fort (notez-le!)
   - **Region**: Choisissez la région la plus proche
4. Cliquez sur "Create new project"
5. Attendez que le projet soit créé (environ 2 minutes)
6. Allez dans "Settings" → "Database"
7. Copiez la "Connection string" (format: `postgresql://postgres:[password]@[host]:5432/postgres`)

## Étape 2: Déployer le backend sur Railway

1. Connectez-vous à Railway (https://railway.app)
2. Cliquez sur "New Project" → "Deploy from GitHub repo"
3. Connectez votre compte GitHub
4. Sélectionnez le repository `UFOCODING/cashgold01`
5. Configurez:
   - **Root Directory**: new_backend
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Dans "Variables", ajoutez:
   - `SECRET_KEY`: Générez une clé secrète aléatoire (ex: `openssl rand -hex 32`)
   - `DATABASE_URL`: Collez l'URL de connexion Supabase
7. Cliquez sur "Deploy"
8. Attendez que le déploiement soit terminé
9. Une fois déployé, notez l'URL du backend (ex: https://cashgold-backend.railway.app)

## Étape 3: Créer l'administrateur

Une fois le backend déployé sur Railway:

1. Allez dans le projet Railway
2. Cliquez sur "Deployments"
3. Cliquez sur le déploiement en cours
4. Cliquez sur "View Logs"
5. Cliquez sur "New Console" (ou utilisez le terminal Railway)
6. Exécutez la commande:
   ```bash
   python create_admin.py
   ```
7. Notez les identifiants admin (email: admin@cashgold.com, password: admin123)

## Étape 4: Déployer le frontend sur Vercel

1. Connectez-vous à Vercel (https://vercel.com)
2. Cliquez sur "Add New" → "Project"
3. Connectez votre compte GitHub
4. Sélectionnez le repository `UFOCODING/cashgold01`
5. Configurez:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: build
6. Dans "Environment Variables", ajoutez:
   - `REACT_APP_BACKEND_URL`: L'URL de votre backend Railway (ex: https://cashgold-backend.railway.app)
7. Cliquez sur "Deploy"
8. Attendez que le déploiement soit terminé
9. Notez l'URL du frontend (ex: https://cashgold.vercel.app)

## Étape 5: Tester le déploiement

1. Ouvrez l'URL du frontend dans votre navigateur
2. Testez l'inscription d'un nouvel utilisateur
3. Testez la connexion avec le compte admin
4. Vérifiez que toutes les fonctionnalités fonctionnent

## Variables d'environnement

### Backend (Railway)
- `SECRET_KEY`: Clé secrète pour JWT
- `DATABASE_URL`: URL de connexion Supabase PostgreSQL

### Frontend (Vercel)
- `REACT_APP_BACKEND_URL`: URL de l'API backend Railway

## Fonctionnalités

- Inscription sans bonus
- Connexion JWT
- Dépôts USDT TRC20
- Retraits
- Investissements VIP (5 niveaux)
- Parrainage (sans bonus)
- Dashboard admin

## Limitations des plans gratuits

### Vercel (Frontend)
- **Bandwidth**: 100 Go/mois
- **Builds**: Illimité
- **Pas de mise en veille**

### Railway (Backend)
- **Crédit**: $5/mois (suffisant pour petite app)
- **Mise en veille**: Après 30 min d'inactivité (réveil en ~30 secondes)
- **Bandwidth**: 1 Go/mois
- **Build hours**: 500 heures/mois

### Supabase (Base de données)
- **Stockage**: 500 MB
- **Bandwidth**: 2 Go/mois
- **Connexions**: 500/mois
- **Pas de mise en veille**

## Maintenance

Pour mettre à jour l'application:
1. Poussez les modifications sur GitHub
2. Railway et Vercel déploieront automatiquement les changements
3. Surveillez les logs en cas d'erreur

## Support

En cas de problème:
- Vérifiez les logs Railway et Vercel
- Vérifiez les variables d'environnement
- Assurez-vous que la base de données Supabase est accessible
- Vérifiez que l'URL du backend est correcte dans le frontend
