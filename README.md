# 🐍 Code It Till You Win It

> Un jeu Snake éducatif pour apprendre à coder en Python en contrôlant un serpent avec du vrai code.

## 🎯 Objectif

**Code It Till You Win It** est un jeu desktop où les joueurs doivent **écrire du code Python** pour guider un serpent et résoudre des défis de plus en plus complexes.

Le projet vise à rendre l'apprentissage de l'algorithmique ludique et progressif, avec un focus sur le **débogage**, la **réflexion algorithmique** et la **compréhension des effets du code**.

## 🚀 Fonctionnalités

- Interface intégrée : éditeur de code, terminal, consignes et bouton d'exécution
- Exécution du code Python dans le navigateur grâce à **Pyodide**
- Niveaux progressifs, chacun validé par un **test unitaire Python**
- Un moteur de jeu Snake avec animation
- Possibilité de reset l’environnement entre deux essais

## 📦 Stack technique

- **Frontend** : [Vite](https://vitejs.dev/) + [Electron](https://www.electronjs.org/)
- **Langage d’apprentissage** : Python (via [Pyodide](https://pyodide.org/))
- **Éditeur** : [CodeMirror 6](https://codemirror.net/6/)
- **Terminal** : [xterm.js](https://xtermjs.org/)
- **Tests de validation** : écrits en Python, exécutés dans Pyodide

## 🛠️ Développement

### Prérequis

- Node.js >= 18
- npm

### Installation

`bash
npm install`

### Lancement du jeu

`npm run start`

Ce script :
- lance Vite pour le frontend
- attend que le frontend soit prêt
- démarre Electron avec l’interface de jeu

### Autres scripts

`npm run dev` : Lance uniquement le serveur Vite

`npm run electron` : Lance uniquement l'application Electron (sans Vite)

## 📄 Licence

Ce projet est sous licence **ISC**.

### 📜 Texte de la licence ISC

```text
ISC License

Copyright (c) 2025 Lou Goubin

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

