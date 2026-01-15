<div align="center">

# OpenClassrooms - Eco-Bliss-Bath
</div>

<p align="center">
    <img src="https://img.shields.io/badge/MariaDB-v11.7.2-blue">
    <img src="https://img.shields.io/badge/Symfony-v6.2-blue">
    <img src="https://img.shields.io/badge/Angular-v13.3.0-blue">
    <img src="https://img.shields.io/badge/docker--build-passing-brightgreen">
  <br><br><br>
</p>

# Prérequis
Pour démarrer cet applicatif web vous devez avoir les outils suivants:
- Docker
- NodeJs

# Installation et démarrage
Clonez le projet pour le récupérer
``` 
git clone https://github.com/OpenClassrooms-Student-Center/Eco-Bliss-Bath-V2.git
cd Eco-Bliss-Bath-V2
```
Pour démarrer l'API avec ça base de données.
```
docker compose up -d
```
# Pour démarrer le frontend de l'applicatif
Rendez-vous dans le dossier frontend
```
cd ./frontend
```
Installez les dépendances du projet
```
npm i
ou
npm install (si vous préférez)
```


Eco Bliss Bath - Campagne de tests automatisés
Ce projet contient une campagne de tests automatisés (Cypress) pour le site e-commerce Eco Bliss Bath, spécialisé dans la vente de produits de beauté éco-responsables.

Prérequis
Avant de lancer les tests, assurez-vous d’avoir :

Node.js (v22 recommandé)
npm installé
Le projet cloné localement
Le backend de l’application lancé en local (ex: http://localhost:8081)
Objectif
L’objectif est d'automatiser les fonctionnalités critiques du site avant sa mise en production, notamment :

La connexion utilisateur
Le panier
Les tests API
La sécurité (faille XSS)
Structure du projet
cypress/e2e/: Contient les scénarios de tests (API, smoke tests, fonctionnels, sécurité XSS)
cypress/support/: Commandes personnalisées
cypress.config.js: Configuration globale de Cypress
Tests effectués
Connexion utilisateur
Panier
Somke tests 
Tests   backent : GET, POST (login, panier, ajout produit disponible, ajout produit en rupture, avis..)
Test de faille XSS
Lancer les tests
Installation dépendances
npm install

Lancement de l’interface graphique Cypress
npx cypress open

Lancement des tests en mode headless (Electron)
npx cypress run --browser electron

Générer un rapport de tests
Les résultats sont visibles directement dans la console ou via l’interface Cypress

