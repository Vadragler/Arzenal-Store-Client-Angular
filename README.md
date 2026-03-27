# Arzenal-Store-Client-Angular

![Angular](https://img.shields.io/badge/Angular-20-red)  
![Node.js](https://img.shields.io/badge/Node.js-22.15.0-green)
![NPM](https://img.shields.io/badge/npm-11.3.0-orange)
![License](https://img.shields.io/badge/Licence-Utilisation%20interdite-red)

**Arzenal-Store-Client-Angular** est une application web développée avec **Angular**.  
Elle sert d’interface utilisateur pour la plateforme **Arzenal Store**, permettant l’inscription sécurisée et la connexion à l’aide d’une API REST.

---

## ✨ Fonctionnalités principales

- 🔐 Authentification via JWT : connexion et inscription (via lien sécurisé)  
- 📦 Navigation parmi les applications disponibles  
- 📁 Gestion du profil utilisateur  
- 💬 Interface multilingue (selon les langues disponibles)  

---

## 🛠️ Technologies utilisées

- Angular 19  
- PrimeNG  

---

## 🔗 Connexion à l’API

L’application consomme les données exposées par l’API **Arzenal-Store-Api**.  
La base URL de l’API peut être définie dans `src/app/services/auth.service.ts`.

> Pour l’inscription, vous devez d’abord générer un **token d’invitation** via Swagger (`InviteToken/Generate`).  
> Le token est valide pendant **7 jours**.  
> L’API retourne un **lien contenant ce token** : vous devez l’utiliser pour afficher le formulaire d’inscription.  
> **⚠️ Pensez à adapter le port dans l’URL retournée selon votre configuration.**

---

## 🚀 Serveur de développement

Pour démarrer un serveur local :

```bash
ng serve
```
Ou utiliser Visual Studio si configuré.

Puis ouvrir votre navigateur à :
http://localhost:56525

L'application se recharge automatiquement lors de modifications dans le code source.
