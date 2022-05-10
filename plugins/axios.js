'use strict'

import axios from 'axios'

/**
 * Utilisation de la librairie Axios pour les requêtes à l'API Vinted
 */
const instance = axios.create({
  baseURL: 'https://www.vinted.fr/',
  headers: {
    "Accept-Language": "fr",
    "User-Agent": "PostmanRuntime/7.28.4",
    "Host": "www.vinted.fr"
  },
});

export default instance;