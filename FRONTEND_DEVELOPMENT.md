# Frontend Development Guide

Ce guide décrit les étapes pour configurer, développer et collaborer efficacement sur le frontend de l’application qui se trouve dans `frontend/`.<br>
basé sur **Next.js 15**, **TypeScript**, **TailwindCSS**, **ESLint**, **Prettier**, et **Husky**.

---

## Installation

1. Entre dans le dossier `frontend` :
```bash
cd frontend
```
2. Installer les dépendances :
```bash
npm install
```
3. Initialiser Husky après le premier "npm install" (darori) :

```bash
npx husky init
```
<br>

# Démarrer le projet en local
Lancer le serveur de développement :
```bash
npm run dev
```

>[!NOTE]
Le flag --turbopack est utilisé par défaut. Si vous rencontrez des problèmes, vous pouvez modifier la commande dans package.json

<br>

# Lint & Formatage du code
## Vérifier les erreurs avec ESLint
```bash
npm run lint
```

## Corriger automatiquement les erreurs
```bash
npm run lint:fix
```

## Formater tout le code avec Prettier
```bash
npm run format
```

## Vérifier que tout est bien formaté
```bash
npm run format:check
```

## Vérifier à la fois les erreurs et formater tout le code (ESLint + Prettier)
```bash
npm run pre-commit
```
>[!NOTE] cette commande n'est rien qu'une combinaison entre "format:check" et "lint"

<br>

# Pre-commit Hook
L'orsque vous fait une commit avec `git commit`, les fichiers modifiés passent automatiquement par : **ESLint** *--fix* et **Prettier** *--write*, c-a-d que les erreurs de syntaxe de ton code vont etre **corriger automatiquement** et **reformater** indenté et suprimer tout espace inutile (les tabulation, espace vide, ...)

>[!WARNING]
n'oublie pas d'executer la commande
d'activation `npx husky init` après la 1ere "npm install"

<br>

# Vérification des dépendances
Vérifie les **vulnérabilités** et les paquets **obsolètes**(out dated) :
```bash
npm run deps:check
```