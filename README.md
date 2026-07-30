# CashGold - Plateforme d'investissement en ligne

## 🌟 Vue d'ensemble

CashGold est une plateforme d'investissement en ligne élégante avec un design or et noir. Elle permet aux utilisateurs d'investir et de gagner 5% de rendement quotidien sur leurs investissements.

## 🏗️ Architecture

- **Frontend**: React avec Vite/Craco
- **Backend**: FastAPI (Python)
- **Base de données**: PostgreSQL
- **Déploiement**: Render (gratuit)

## 📁 Structure du projet

```
CASHGOLD/
├── frontend/          # Application React
│   ├── src/
│   ├── package.json
│   └── render.yaml    # Configuration Render
├── new_backend/       # API FastAPI
│   ├── main.py
│   ├── requirements.txt
│   ├── create_admin.py
│   └── render.yaml    # Configuration Render
└── DEPLOYMENT.md      # Guide de déploiement
```

## ✨ Fonctionnalités principales

### Pour les utilisateurs
- ✅ **Inscription rapide** - Sans vérification, accès immédiat au dashboard
- 🔐 **Connexion rapide** - Authentification JWT sans 2FA pour une connexion instantanée
- 💰 **Dépôts USDT TRC20** - Validation manuelle par l'administrateur
- 📈 **Plans VIP (5 niveaux)** - Tous avec rendement de 5% par jour
  - VIP 1: $10 - $99
  - VIP 2: $100 - $499
  - VIP 3: $500 - $999
  - VIP 4: $1,000 - $4,999
  - VIP 5: $5,000+
- 💸 **Retraits crypto** - Minimum $10, traitement rapide
- 🤝 **Programme de parrainage** - Gagnez 5% sur les dépôts de vos filleuls
- 📊 **Dashboard complet** - Soldes, historique, investissements actifs

### Pour les administrateurs
- 👥 **Gestion des utilisateurs** - Suspendre/Activer les comptes
- 💳 **Validation des dépôts** - Approuver/Rejeter manuellement
- 💰 **Gestion des retraits** - Compléter les demandes de retrait
- 📈 **Statistiques** - Vue d'ensemble de la plateforme

### Pages publiques
- 🏠 **Accueil** - Présentation de la plateforme
- ℹ️ **À propos** - Mission et vision
- ❓ **FAQ** - Questions fréquentes
- 📧 **Contact** - Formulaire de contact

## 🚀 Démarrage rapide (Local)

### Prérequis
- Node.js 18+
- Python 3.9+
- PostgreSQL (ou utilisez SQLite pour le développement local)

### Backend (Local avec SQLite)

```bash
cd new_backend
pip install -r requirements.txt
python main.py
```

### Frontend (Local)

```bash
cd frontend
npm install
npm start
```

### Créer un administrateur (Local)

```bash
cd new_backend
python create_admin.py
```

**Identifiants par défaut:**
- Email: `admin@cashgold.com`
- Mot de passe: `admin123`

## 🌐 Déploiement sur Render

Pour déployer gratuitement sur Render, suivez le guide complet dans [DEPLOYMENT.md](DEPLOYMENT.md).

**Résumé rapide:**
1. Créez un repository GitHub avec le code
2. Déployez une base de données PostgreSQL sur Render
3. Déployez le backend sur Render
4. Créez l'administrateur via le shell Render
5. Déployez le frontend sur Render

## 📱 Fonctionnement

### Inscription & Connexion

1. **Inscription** - Créez un compte avec email, nom d'utilisateur et mot de passe
   - Aucune vérification 2FA requise
   - Accès immédiat au dashboard
   - Code de parrainage optionnel

2. **Connexion** - Connexion rapide sans 2FA
   - Entrez simplement email et mot de passe
   - Accès immédiat au dashboard
   - Admin redirigé vers `/admin`, utilisateurs vers `/dashboard`

### Dépôts

1. Accédez à l'onglet "Déposer"
2. Copiez l'adresse USDT TRC20: `TLeCrKaPqcq3qZcdodJ8eUGJVzVbiWjMW1`
3. Envoyez des USDT depuis votre portefeuille
4. Soumettez le montant et le hash de transaction (optionnel)
5. Attendez approbation de l'administrateur

### Investissements

1. Une fois votre dépôt approuvé
2. Allez dans l'onglet "Investir"
3. Choisissez le montant (minimum $10)
4. Gagnez 5% par jour automatiquement
5. Arrêtez à tout moment pour récupérer votre capital

### Retraits

1. Onglet "Retirer"
2. Entrez le montant et votre adresse USDT TRC20
3. Votre solde est immédiatement déduit
4. L'admin traite la demande de retrait

### Parrainage

1. Onglet "Parrainage"
2. Partagez votre lien unique
3. Gagnez 5% sur chaque dépôt de vos filleuls
4. Bonus crédité immédiatement lors de l'approbation du dépôt

## 🎨 Design

- **Couleurs principales:** Or (#d4af37) et Noir (#0a0a0a)
- **Typographie:** 
  - Titres: Playfair Display
  - Corps: Inter
- **Effets:** Glass morphism, animations fluides
- **Responsive:** Mobile, tablette et desktop

## 📝 Notes importantes

### Calcul des profits
Les profits sont calculés automatiquement toutes les heures si le cron est configuré.
Formule: `profit = montant_investi * (5% / 24) * heures_écoulées`

### Adresse USDT TRC20
L'adresse de dépôt est fixe: `TF348PVPBaqhGCFZSCCJEkDNVdtUHwaCyE`
