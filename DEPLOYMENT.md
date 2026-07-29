# CashGold - Guide de déploiement sur Render

Ce guide explique comment déployer CashGold (frontend + backend + base de données) sur Render, un hébergeur gratuit.

## Prérequis

- Un compte GitHub
- Un compte Render (https://render.com)
- Le code du projet sur GitHub

## Structure du projet

```
CASHGOLD/
├── frontend/          # Application React
│   ├── src/
│   ├── package.json
│   └── render.yaml    # Configuration Render pour le frontend
├── new_backend/       # API FastAPI
│   ├── main.py
│   ├── requirements.txt
│   ├── create_admin.py
│   └── render.yaml    # Configuration Render pour le backend
└── DEPLOYMENT.md      # Ce fichier
```

## Étape 1: Préparer le repository GitHub

1. Créez un nouveau repository sur GitHub
2. Poussez tout le code du projet sur GitHub
3. Assurez-vous que les fichiers `render.yaml` sont inclus

## Étape 2: Déployer la base de données PostgreSQL

1. Connectez-vous à Render
2. Allez dans "Dashboard" → "New" → "PostgreSQL"
3. Remplissez le formulaire:
   - **Name**: cashgold-db
   - **Database**: PostgreSQL
   - **Region**: Choisissez la région la plus proche
   - **Plan**: Free
4. Cliquez sur "Create Database"
5. Une fois créée, notez la "Internal Database URL" (vous en aurez besoin)

## Étape 3: Déployer le backend

1. Allez dans "Dashboard" → "New" → "Web Service"
2. Connectez votre compte GitHub
3. Sélectionnez le repository CashGold
4. Configurez:
   - **Name**: cashgold-backend
   - **Branch**: main
   - **Root Directory**: new_backend
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Dans "Environment Variables", ajoutez:
   - `SECRET_KEY`: Générez une clé secrète aléatoire
   - `DATABASE_URL`: Collez l'URL de la base de données PostgreSQL
6. Cliquez sur "Create Web Service"
7. Attendez que le déploiement soit terminé
8. Notez l'URL du backend (ex: https://cashgold-backend.onrender.com)

## Étape 4: Créer l'administrateur

Une fois le backend déployé:

1. Allez dans le service backend sur Render
2. Cliquez sur "Shell" dans le menu
3. Exécutez la commande:
   ```bash
   python create_admin.py
   ```
4. Notez les identifiants admin (email: admin@cashgold.com, password: admin123)

## Étape 5: Déployer le frontend

1. Allez dans "Dashboard" → "New" → "Web Service"
2. Sélectionnez le même repository GitHub
3. Configurez:
   - **Name**: cashgold-frontend
   - **Branch**: main
   - **Root Directory**: frontend
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Dans "Environment Variables", ajoutez:
   - `REACT_APP_BACKEND_URL`: L'URL de votre backend (ex: https://cashgold-backend.onrender.com)
5. Cliquez sur "Create Web Service"
6. Attendez que le déploiement soit terminé

## Étape 6: Tester le déploiement

1. Ouvrez l'URL du frontend dans votre navigateur
2. Testez l'inscription d'un nouvel utilisateur
3. Testez la connexion avec le compte admin
4. Vérifiez que toutes les fonctionnalités fonctionnent

## Variables d'environnement

### Backend
- `SECRET_KEY`: Clé secrète pour JWT (généré automatiquement sur Render)
- `DATABASE_URL`: URL de connexion PostgreSQL

### Frontend
- `REACT_APP_BACKEND_URL`: URL de l'API backend

## Fonctionnalités

- Inscription sans bonus
- Connexion JWT
- Dépôts USDT TRC20
- Retraits
- Investissements VIP (5 niveaux)
- Parrainage (sans bonus)
- Dashboard admin

## Limitations du plan gratuit Render

- **Backend**: 15 minutes d'inactivité avant mise en veille (réveil en ~30 secondes)
- **Base de données**: 90 jours d'inactivité avant suppression
- **Frontend**: Pas de mise en veille
- **Bandwidth**: 100 Go/mois
- **Build hours**: 750 heures/mois

## Maintenance

Pour mettre à jour l'application:
1. Poussez les modifications sur GitHub
2. Render déploiera automatiquement les changements
3. Surveillez les logs en cas d'erreur

## Support

En cas de problème:
- Vérifiez les logs Render
- Vérifiez les variables d'environnement
- Assurez-vous que la base de données est accessible
- Vérifiez que l'URL du backend est correcte dans le frontend
