# TODO

- [x] Création du git
- [x] Documentation
- [ ] Gestion des erreurs de l'API Vinted en cas de Token Invalide
- [ ] Automatiser la récupération du token s'il n'est pas déjà présent
- [ ] Sauvegarder les urls et channels associés ( ex1 )
- [ ] Gestion des bijoux, jeux-vidéos et autres produits que vêtements ?
- [ ] Sauvegarde du résultat API en cache avec une correspondance URL ( ex2 )

---
## Ex1
> `[ channelId => url ]`
>
> On veut les derniers joggings sortis sur le canal "#jogging" avec la commande `/get-vetements`
>
> - On récupère l'id du canal où le message est envoyé
>
> - On check dans le tableau l'url correspondante
>
> - On execute la requête et on renvoi le tout sur le même canal

---

## Ex2
> Pour éviter de surcharger l'API avec des requêtes de pleins d'utilisateurs
> 
> Utiliser un système de cache
> `[ Url demandée -> résultat de l'api sauvegardé en cache ]`
>
> - Si la même requête est demandée dans les 2~3 min, on renvoi la donnée du cache
>
> - Sinon, on refait la requête api et on save dans le cache