'use strict'
import instance from "./axios.js";

// Endpoints de l'API Vinted
const ITEM_URL = 'api/v2/catalog/items';
const TOKEN_URL = 'auth/token_refresh';
let cookies = [];

/**
 * Formatte le tableau de cookies en string pour le header de la requête
 * @returns {string} res
 */
function getCookiesToString() {
    let res = "";
    cookies.forEach(cookie => {
        res += cookie + ";";
    })
    return res;
}

/**
 * Construit l'url API avec le tableau de paramètres formattés
 * @param {Array} params 
 * @returns {string} url
 */
function makeUrl(params) {
    let url = ITEM_URL + '?'
    for (const [key, value] of Object.entries(params))
        url += key + '=' + value + '&';
    return url.slice(0, -1);
}

/**
 * Les différents appels API effectués
 */
export default {
    getVetements: async () => { 
        const res = await instance.get(`${ITEM_URL}`, { headers: { Cookie: getCookiesToString() } });
        return res.data.items;
    },
    refreshToken: () => {
        if(cookies.length === 0) {
            instance.post(`${TOKEN_URL}`).then(res => {
                cookies = res.headers["set-cookie"];
            })
            .catch(error => {
                throw error;
            })
        } else {
            return false;
        }
    },
    getWithParameters: async (params) => {
        const res = await instance.get(makeUrl(params), { headers: { Cookie: getCookiesToString() } })
        return res.data.items;
    }
}