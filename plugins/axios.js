'use strict'

import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://www.vinted.fr/',
  headers: {
    "Accept-Language": "fr",
    "User-Agent": "PostmanRuntime/7.28.4",
    "Host": "www.vinted.fr"
  },
});

export default instance;

/**
 * Pour la communication avec l'API Vinted
 * BASE_URL: https://www.vinted.fr/api/v2/catalog/items
 * 
 * Header Type Postman à construire avec récupération et refresh du token
 * https://github.com/aime-risson/vinted-api-wrapper/blob/bda81f5b2cb6d554546763daec0605d44210839f/src/pyVinted/requester.py
 * 
 * Matching des paramètres de l'url de nico à l'url API
 * https://github.com/aime-risson/vinted-api-wrapper/blob/bda81f5b2cb6d554546763daec0605d44210839f/src/pyVinted/items/items.py
 * 
 */