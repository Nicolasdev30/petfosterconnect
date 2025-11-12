# 🌳 Git & GitHub - Guide & Bonnes Pratiques

Ce guide centralise les **règles d’organisation Git**, les **branches à utiliser** et les **types de commits** pour garantir un **workflow propre et professionnel**.

---

## 🚀 Branches principales

| Branche   | Utilisation principale                                  |
| --------- | ------------------------------------------------------- |
| `main`    | Dernière version **stable** et déployée                 |
| `develop` | Branche de **développement actif** (avant mise en prod) |
| `feature/conception` | Branche de **conception**  |
| `feature/backend` | Branche de **backend**  |
| `feature/fontend` | Branche de **frontend**  |

---

## 🌿 Branches secondaires (Feature / Bugfix / Hotfix)

| Type de branche   | Préfixe recommandé | Exemple                     |
| ----------------- | ------------------ | --------------------------- |
| **Feature**       | `feature/`         | `feature/add-login`         |
| **Bugfix**        | `bugfix/`          | `bugfix/fix-login-error`    |
| **Hotfix (prod)** | `hotfix/`          | `hotfix/fix-critical-issue` |

---

## ✅ Règles de création de branches

```bash
# Depuis develop
git checkout develop

git checkout -b feature/nom-de-la-feature
```

- Toujours partir de la branche `develop`
- Nommage en **kebab-case** (pas d'espaces, pas de majuscules)

---

## 📝 Types de commits (Conventional Commits)

| Type        | Utilisation                                     | Exemple                              |
| ----------- | ----------------------------------------------- | ------------------------------------ |
| `feat:`     | Nouvelle fonctionnalité                         | `feat: add user authentication`      |
| `fix:`      | Correction de bug                               | `fix: correct login issue`           |
| `docs:`     | Documentation uniquement                        | `docs: update README`                |
| `style:`    | Modifications de style (indentation, formatage) | `style: apply Prettier formatting`   |
| `refactor:` | Refactoring sans changement fonctionnel         | `refactor: simplify auth middleware` |
| `test:`     | Ajout ou mise à jour des tests                  | `test: add unit tests for login`     |
| `chore:`    | Mises à jour sans impact sur le code (CI, deps) | `chore: update dependencies`         |

---

## 🔗 Workflow Git conseillé

1. Créer une **branche** depuis `develop`
2. **Commits réguliers** en anglais avec messages clairs
3. Faire une **Pull Request** vers `develop` ou `main` selon le cas
4. Demander une **review** si en équipe (ou auto-review)
5. Fusionner une fois les tests validés
6. Déployer si nécessaire

---

## 💡 Astuces & Bonnes pratiques

- Toujours **lier les PR aux issues** si possible (`Closes #12`)
- Ne jamais commit sur `main` ou `develop` sans passer par PR
- Ne jamais push un `.env` ou des credentials sensibles
- Ajouter des badges dans le README (`build passing`, `coverage`, etc.)
- Utiliser des **GitHub Actions** pour automatiser les tests et déploiements

---

✅ Ce guide t’assure une **organisation Git professionnelle** et t’aide à travailler efficacement en équipe ou en solo.
