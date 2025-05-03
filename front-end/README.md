# BookSen Front End - Système de Gestion de Livres et Utilisateurs

## Description
Ce frontend React permet aux utilisateurs de gérer une collection de livres, avec des fonctionnalités d'authentification, de gestion de profil et d'administration des livres.

## Technologies utilisées
- React 18
- React Router v6
- TanStack Query (anciennement React Query)
- Context API pour la gestion d'état

## Structure de l'application

### Routes principales
- `/` : Page d'accueil publique
- `/login` : Connexion utilisateur
- `/register` : Inscription utilisateur
- `/books` : Liste des livres (protégée)
- `/books/new` : Création d'un livre (admin seulement)
- `/books/:id` : Détails d'un livre
- `/books/:id/edit` : Édition d'un livre (admin seulement)
- `/profile` : Profil utilisateur (protégée)

### Composants clés
- `AuthProvider` : Gère l'état d'authentification
- `ProtectedRoute` : Restreint l'accès aux utilisateurs connectés
- `AdminRoute` : Restreint l'accès aux administrateurs
- `Layout` : Structure commune de l'application

### Gestion des livres
Le frontend utilise TanStack Query pour:
- Récupérer la liste des livres (`useBooks`)
- Obtenir un livre spécifique (`useBook`)
- Créer un nouveau livre (`useCreateBook`)
- Mettre à jour un livre (`useUpdateBook`)
- Supprimer un livre (`useDeleteBook`)

## Installation
1. Cloner le dépôt:
   ```bash
   git clone https://github.com/moussadiengsala/book-sen.git
   cd book-sen
   ```
   
2. Run
- with docker
    ```bash
    docker-compose -f docker-compose.service.yml up -d --build book-sen-front
    ```
- or
    ```bash
    cd front-end 
    npm install
    ```
3. Vous pouvez maintenant aller a:
   ```bash
   localhost:5173
   ```