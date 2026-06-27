# 🎭 Générateur de Memes Multimodal

Application mobile React Native CLI permettant de générer des memes à partir de texte, d'audio et d'images grâce à l'IA (Groq LLaMA + Whisper).

---

## 📋 Table des matières

- [Architecture du projet](#architecture)
- [Prérequis](#prérequis)
- [Installation Backend](#installation-backend)
- [Installation Frontend](#installation-frontend)
- [Configuration des clés API](#configuration-clés-api)
- [Lancement du projet](#lancement)
- [Fonctionnalités](#fonctionnalités)
- [Structure des dossiers](#structure)

---

## 🏗 Architecture

```
monstre_projet/
├── backend/          # API Node.js + Express + PostgreSQL
└── frontend/
    └── GeneratorMobile/  # App React Native CLI
```

**Stack technique :**
- **Frontend** : React Native CLI 0.86, TypeScript, React Navigation
- **Backend** : Node.js, Express.js, Sequelize ORM
- **Base de données** : PostgreSQL
- **IA** : Groq API (LLaMA 3.3 + Whisper + LLaMA 4 Vision)
- **Auth** : JWT (JSON Web Token)
- **Upload** : Multer

---

## ✅ Prérequis

### Système
- Ubuntu 20.04+ / macOS / Windows (WSL2)
- Node.js >= 18.x (LTS)
- npm >= 9.x
- PostgreSQL >= 14

### Mobile
- Android Studio (avec SDK Android)
- JDK 17
- Un téléphone Android (ou émulateur)
- Téléphone et PC sur le **même réseau WiFi**

### Comptes nécessaires
- [Groq Console](https://console.groq.com) → clé API gratuite
- PostgreSQL installé en local

---

## 🔧 Installation Backend

### 1. Cloner et installer les dépendances

```bash
cd monstre_projet/backend
npm install
```

### 2. Configurer la base de données PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer l'utilisateur et la base
CREATE USER mydatabaseuser WITH PASSWORD '1234';
CREATE DATABASE postgres OWNER mydatabaseuser;
GRANT ALL PRIVILEGES ON DATABASE postgres TO mydatabaseuser;
\q
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
nano .env
```

Contenu du fichier `.env` :

```env
PORT=5000

# Base de données PostgreSQL
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=postgres
DB_USER=mydatabaseuser
DB_PASSWORD=1234

# JWT (clé secrète — à changer en production)
JWT_SECRET=meme_generator_secret_2026

# Groq API
GROQ_API_KEY=gsk_VOTRE_CLE_GROQ_ICI
```

### 4. Créer les dossiers d'upload

```bash
mkdir -p uploads/images
mkdir -p uploads/audio
```

### 5. Lancer le backend

```bash
npm run dev
```

**Résultat attendu :**
```
🚀 Server running on http://0.0.0.0:5000
✔ DB OK
```

### 6. Tester le backend

```bash
curl http://localhost:5000/api/test
# Réponse : {"message":"Token manquant"}
```

---

## 📱 Installation Frontend

### 1. Installer les dépendances

```bash
cd monstre_projet/frontend/GeneratorMobile
npm install
```

### 2. Configurer l'URL du backend

```bash
nano src/config.ts
```

```typescript
// Remplace par l'IP de ton PC sur le réseau local
export const BACKEND_URL = 'http://192.168.X.X:5000';
```

**Pour trouver ton IP :**
```bash
hostname -I
# Exemple : 192.168.1.137
```

### 3. Configurer Android

Vérifie que `android/app/src/main/AndroidManifest.xml` contient :

```xml
<application
  android:usesCleartextTraffic="true"
  ...>
```

### 4. Créer le bundle Android

```bash
# Créer le dossier assets si nécessaire
mkdir -p android/app/src/main/assets

# Créer le bundle JavaScript
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res
```

### 5. Installer l'APK sur le téléphone

```bash
# Connecter le téléphone en USB (activer le débogage USB)
cd android
./gradlew installDebug
cd ..
```

**Résultat attendu :**
```
Installed on 1 device.
BUILD SUCCESSFUL
```

---

## 🔑 Configuration des clés API

### Groq API (obligatoire)

1. Va sur [https://console.groq.com](https://console.groq.com)
2. Crée un compte gratuit
3. Clique sur **"API Keys"** → **"Create API Key"**
4. Copie la clé (commence par `gsk_...`)
5. Ajoute dans `.env` :

```env
GROQ_API_KEY=gsk_ta_cle_ici
```

**Modèles utilisés :**
- `llama-3.3-70b-versatile` → génération de captions texte
- `meta-llama/llama-4-scout-17b-16e-instruct` → analyse d'images
- `whisper-large-v3-turbo` → transcription audio

---

## 🚀 Lancement du projet

### Étape 1 — Lancer le backend

```bash
cd monstre_projet/backend
npm run dev
```

### Étape 2 — Connecter téléphone et PC au même WiFi

Vérifie que les deux appareils sont sur le même réseau.

### Étape 3 — Lancer l'app

L'APK est déjà installé sur le téléphone.  
Ouvre l'application **"GeneratorMobile"**.

### Étape 4 — Se connecter

- Crée un compte ou connecte-toi
- Le token JWT est valide **30 jours**

---

## 🎯 Fonctionnalités

### 🎤 Meme Audio
1. Appuie sur **"Démarrer"** pour lancer l'enregistrement
2. Parle dans le micro
3. Appuie sur **"Stop"**
4. Clique sur **"Générer avec IA"**
5. Groq LLaMA génère une caption drôle
6. Crée le meme final

### 🖼 Meme Image
1. Choisis une image depuis la galerie
2. Upload vers le backend
3. Groq Vision analyse l'image
4. Caption humoristique générée automatiquement
5. Crée le meme final

### 🤖 IA Meme Generator
1. Mode **Texte** : décris un contexte → 1 ou 3 captions générées
2. Mode **Image** : upload → analyse IA → caption

### 📜 Historique
- Tous les memes créés sont sauvegardés localement
- Possibilité de supprimer

### 👤 Profil
- Infos utilisateur connecté
- Nombre de memes créés
- Déconnexion

---

## 📁 Structure des dossiers

### Backend

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Configuration Sequelize/PostgreSQL
│   ├── controllers/
│   │   ├── auth.controller.js # Login, Register, Profile
│   │   ├── groq.controller.js # Endpoints IA Groq
│   │   └── image.controller.js # Upload images
│   ├── middlewares/
│   │   └── auth.middleware.js # Vérification JWT
│   ├── models/
│   │   └── user.model.js      # Modèle utilisateur
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── groq.routes.js
│   │   ├── image.routes.js
│   │   └── test.routes.js
│   ├── services/
│   │   └── groq.service.js    # Appels API Groq
│   └── server.js              # Point d'entrée
├── uploads/
│   ├── images/                # Images uploadées
│   └── audio/                 # Fichiers audio
└── .env                       # Variables d'environnement
```

### Frontend

```
frontend/GeneratorMobile/
├── src/
│   ├── config.ts              # URL backend
│   ├── context/
│   │   └── AuthContext.tsx    # Gestion JWT
│   ├── navigation/
│   │   └── AppNavigator.tsx   # Navigation principale
│   └── screens/
│       ├── LoginScreen.tsx
│       ├── RegisterScreen.tsx
│       ├── HomeScreen.tsx
│       ├── AudioRecordingScreen.tsx
│       ├── ImageUploadScreen.tsx
│       ├── GeminiMemeScreen.tsx
│       ├── MemePreviewScreen.tsx
│       ├── ProfileScreen.tsx
│       └── HistoryScreen.tsx
├── android/                   # Config Android native
└── index.js                   # Point d'entrée
```

---

## 🛠 Scripts disponibles

### Backend
```bash
npm run dev      # Lancement avec nodemon (développement)
npm start        # Lancement simple (production)
```

### Frontend
```bash
# Créer le bundle
npx react-native bundle --platform android --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

# Installer sur téléphone
cd android && ./gradlew installDebug && cd ..

# Clean Gradle (si erreurs de build)
cd android && ./gradlew clean && cd ..
```

---

## ⚠️ Problèmes fréquents

### "Network request failed"
- Vérifier que téléphone et PC sont sur le **même WiFi**
- Vérifier l'IP dans `src/config.ts`
- Vérifier que le backend tourne (`npm run dev`)

### "Token expiré ou invalide"
- Se reconnecter depuis l'app
- Vérifier `JWT_SECRET` dans `.env`

### Erreur Gradle
```bash
cd android && ./gradlew clean && cd ..
```

### Backend ne démarre pas
- Vérifier que PostgreSQL tourne
- Vérifier les credentials dans `.env`

---

## 👩‍💻 Auteur

Projet de groupe  
Projet scolaire — ICT202  
Université de Yaoundé I  
2025-2026

---

## 📄 Licence

Projet académique
