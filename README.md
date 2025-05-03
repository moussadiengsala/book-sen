# BookSen - Système Complet de Gestion de Bibliothèque

BookSen est une application complète de gestion de bibliothèque avec une API RESTful backend construite avec Spring Boot et une interface utilisateur frontend développée avec React.

## Vue d'ensemble

BookSen permet aux utilisateurs de:
- Gérer une collection de livres (création, visualisation, mise à jour, suppression)
- S'inscrire et se connecter
- Gérer les profils utilisateurs
- Télécharger des images pour les couvertures de livres et avatars utilisateurs
- Rechercher des livres par auteur et nom
- Accéder à des fonctionnalités d'administration (pour les utilisateurs autorisés)

## Architecture

Le projet est divisé en deux composants principaux:

1. **Backend (BookSen API)** - API RESTful Spring Boot avec MongoDB
2. **Frontend (BookSen Front)** - Application React SPA

## Stack Technique

### Backend
- Java 17+
- Spring Boot
- Spring Security
- Spring Data MongoDB
- Docker

### Frontend
- React 18
- React Router v6
- TanStack Query (React Query)
- Context API

## Fonctionnalités Principales

- **Authentification complète** - Inscription, connexion et gestion des rôles
- **Gestion des livres** - CRUD complet pour les livres avec support pour les images de couverture
- **Profils utilisateurs** - Gestion des informations utilisateur avec avatars
- **Recherche** - Filtrage flexible des livres
- **Interface réactive** - Design moderne et réactif
- **Sécurité** - Routes protégées et gestion des autorisations
- **Gestion d'erreurs** - Réponses d'erreur cohérentes et validation

## Installation et Démarrage

### Prérequis
- Docker

### Instructions

1. Cloner le dépôt:
   ```bash
   git clone https://github.com/moussadiengsala/book-sen.git
   cd book-sen
   ```

2. Démarrer les dépendances (MongoDB et MongoDB Express):
   ```bash
   docker-compose -f docker-compose.dep.yml up -d
   ```

3. Demarrer l'API backend et frontend:
   ```bash
   docker-compose -f docker-compose.service.yml up -d
   ```

4. Ou Démarrer l'API backend et frontend une a une:
   ```bash
   docker-compose -f docker-compose.service.yml up -d --build book-sen-api
   docker-compose -f docker-compose.service.yml up -d --build book-sen-front
   ```

5. Accéder aux applications:
    - API: `http://localhost:8082`
    - Frontend: `http://localhost:5173`
    - MongoDB Express: `http://localhost:8081`

### Exécution manuelle du frontend (alternative):
```bash
cd front-end
npm install
npm run dev
```

## Compte Administrateur par Défaut

Un compte administrateur est automatiquement créé au premier démarrage:
- **Email**: `admin@example.com`
- **Mot de passe**: `ChangeMe123!`

⚠️ **Important**: Pour des raisons de sécurité, modifiez ce mot de passe après la première connexion.

## Points d'Accès API

### Ressource Livres
| Méthode | Point d'Accès | Description |
|---------|---------------|-------------|
| GET | `/api/v1/books` | Récupérer tous les livres |
| GET | `/api/v1/books/{id}` | Récupérer un livre par ID |
| GET | `/api/v1/books/cover/{filename}` | Récupérer l'image de couverture |
| POST | `/api/v1/books` | Créer un nouveau livre |
| PUT | `/api/v1/books/{id}` | Mettre à jour un livre |
| DELETE | `/api/v1/books/{id}` | Supprimer un livre |

### Ressource Utilisateurs
| Méthode | Point d'Accès | Description |
|---------|---------------|-------------|
| GET | `/api/v1/user/{id}` | Récupérer un utilisateur |
| GET | `/api/v1/user` | Récupérer tous les utilisateurs |
| GET | `/api/v1/user/avatar/{filename}` | Récupérer un avatar |
| POST | `/api/v1/user/auth/register` | Inscription |
| POST | `/api/v1/user/auth/login` | Connexion |
| PUT | `/api/v1/user/{id}` | Mettre à jour un utilisateur |
| DELETE | `/api/v1/user/{id}` | Supprimer un utilisateur |

## Structure Frontend

### Routes principales
- `/` : Page d'accueil
- `/login` : Connexion
- `/register` : Inscription
- `/books` : Liste des livres (protégée)
- `/books/new` : Création (admin)
- `/books/:id` : Détails d'un livre
- `/books/:id/edit` : Édition (admin)
- `/profile` : Profil utilisateur (protégée)

## Demo

<video width="600" controls>
  <source src="https://github.com/moussadiengsala/book-sen/main/assets/demo.webm" type="video/webm">
  Your browser does not support the video tag.
</video>
