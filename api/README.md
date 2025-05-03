# BookSen API - Système de Gestion de Livres et Utilisateurs

BookSen API est un service RESTful pour gérer une collection de livres et d'utilisateurs. Construit avec Spring Boot, cette API fournit des fonctionnalités complètes pour créer, récupérer, mettre à jour et supprimer des livres et des utilisateurs.

## Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Stack Technique](#stack-technique)
- [Points d'Accès API](#points-daccès-api)
- [Modèles de Données](#modèles-de-données)
- [Démarrage](#démarrage)
- [Gestion des Erreurs](#gestion-des-erreurs)

## Fonctionnalités

- **Opérations CRUD Complètes**: Créer, lire, mettre à jour et supprimer des livres et des utilisateurs
- **Gestion d'Images**: Téléchargement et récupération des couvertures de livres et avatars des utilisateurs
- **Recherche Flexible**: Filtrer les livres par auteurs et nom
- **Authentification**: Système d'enregistrement et de connexion des utilisateurs
- **Gestion des Rôles**: Support pour les rôles administrateur et utilisateur
- **Validation**: Validation robuste des entrées pour toutes les opérations
- **Gestion des Erreurs**: Réponses d'erreur cohérentes et journalisation
- **Gestion des Transactions**: Garantit l'intégrité des données avec des opérations transactionnelles

## Stack Technique

- **Java 17+**
- **Spring Boot**: Framework principal
- **Spring Security**: Authentification et autorisation
- **Spring Data MongoDB**: Opérations de base de données
- **Spring Validation**: Validation des données

## Points d'Accès API

### Ressource Livres

| Méthode | Point d'Accès | Description | Corps de la Requête | Réponse |
|---------|---------------|-------------|---------------------|---------|
| GET | `/api/v1/books` | Récupérer tous les livres | - | Liste de `BookResponseDTO` |
| GET | `/api/v1/books/{id}` | Récupérer un livre par ID | - | `BookResponseDTO` |
| GET | `/api/v1/books/cover/{filename}` | Récupérer l'image de couverture d'un livre | - | Ressource image |
| POST | `/api/v1/books` | Créer un nouveau livre | `CreateUpdateBookDTO` (multipart) | Livre créé |
| PUT | `/api/v1/books/{id}` | Mettre à jour un livre existant | `CreateUpdateBookDTO` (multipart) | Livre mis à jour |
| DELETE | `/api/v1/books/{id}` | Supprimer un livre | - | Message de succès |

### Ressource Utilisateurs

| Méthode | Point d'Accès | Description | Corps de la Requête | Réponse |
|---------|---------------|-------------|---------------------|---------|
| GET | `/api/v1/user/{id}` | Récupérer un utilisateur par ID | - | `UserResponseDTO` |
| GET | `/api/v1/user` | Récupérer tous les utilisateurs | - | Liste de `UserResponseDTO` |
| GET | `/api/v1/user/avatar/{filename}` | Récupérer l'avatar d'un utilisateur | - | Ressource image |
| POST | `/api/v1/user/auth/register` | Enregistrer un nouvel utilisateur | `CreateUserDTO` (multipart) | Token d'authentification |
| POST | `/api/v1/user/auth/login` | Connecter un utilisateur | `LoginUserDTO` | Token d'authentification |
| PUT | `/api/v1/user/{id}` | Mettre à jour un utilisateur | `UpdateUserDTO` (multipart) | Utilisateur mis à jour |
| DELETE | `/api/v1/user/{id}` | Supprimer un utilisateur | - | Message de succès |

## Modèles de Données

### Entité Books

```java
public class Books {
    private String id;
    private String name;
    private String description;
    private String cover;
    private String author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### BookResponseDTO

```java
public class BookResponseDTO {
    private String id;
    private String name;
    private String description;
    private String author;
    private String cover;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### CreateUpdateBookDTO

```java
public class CreateUpdateBookDTO {
    private String name;
    private String description;
    private String author;
    private MultipartFile cover;
}
```

### Entité User

```java
public class User implements UserDetails {
    private String id;
    private String name;
    private String email;
    private String password;
    private Role role;
    private String avatar;
}
```

### CreateUserDTO

```java
public class CreateUserDTO {
    private String name;
    private String email;
    private String password;
    private MultipartFile avatar;
}
```

### LoginUserDTO

```java
public class LoginUserDTO {
    private String email;
    private String password;
}
```

### UpdateUserDTO

```java
public class UpdateUserDTO {
    private String name;
    private String current_password;
    private String new_password;
    private Role role;
    private MultipartFile avatar;
}
```

### UserResponseDTO

```java
public class UserResponseDTO {
    private String id;
    private String name;
    private String email;
    private String role;
    private String avatar;
}
```

## Démarrage

### Compte Administrateur par Défaut

Lors du démarrage initial de l'application, un compte administrateur par défaut est créé avec les informations suivantes :

- **Nom** : `System Administrator`
- **Email** : `admin@example.com`
- **Mot de passe** : `ChangeMe123!`

⚠️ **Important** : Pour des raisons de sécurité, il est fortement recommandé de modifier ce mot de passe après la première connexion.

### Prérequis

- Docker

### Installation

1. Cloner le dépôt:
   ```bash
   git clone https://github.com/moussadiengsala/book-sen.git
   cd book-sen
   ```

2. Demurrer les dependence:
Ca va lancer le mongodb et mongo express. 
   ```bash
   docker-compose -f docker-compose.dep.yml up -d
   ```

3. Demurrer l'Api:
   ```bash
   docker-compose -f docker-compose.service.yml up -d --build book-sen-api
   ```
4. Vous pouvez maintenant naviguer sur:
    ```bash
    localhost:8082
    ```

## Gestion des Erreurs

L'API utilise un format de réponse d'erreur cohérent:

```json
{
  "status": 400,
  "data": null,
  "message": "Erreur de validation: Le nom est requis"
}
```


