# bach tb9a dima a jour m3a l`main`

drari maghadich nb9a n9abl kola push w les changement  li  fiha, w bach maykonoch des conflits 7awlo dima tkono a jour m3a l`main` 9bl kola push

hna ghatl9aw 2 methodes kifach tkono a jour bl2ijabiyat w silbiyat dyalhom :

## Option 1: merge `main` flbranch fach khdam

```bash
git checkout feature/test-feature
git fetch origin
git merge origin/main
```


lhistory dyal merges katb9a walakin momkin tkhrb9 lcommmit tree

## Option 2: dir rebase l branch dyalk flmain

```bash
git checkout feature/test-feature
git pull --rebase origin main
```
lhistory katb9a n9iya mais ila kano des conflits khask tfkhom manuellement


# smyat  dyal lbranch (proposition dyali sinon  blach)
bach lhistoorique ikon bayn w mfhom

| Prefix  | lach sal7a      | mital     |
| ----------- | ---------- | --------------- |
| `feature/`| fonctionalité jdida  | `feature/login-api`  |
| `bugfix/` | bug machi urgent  | `bugfix/input-erreur` |
| `hotfix/` | bug urgent  | `hotfix/login-makhdamch`       |
| `docs/` | changement 3la documentation | `docs/update-conception` |
