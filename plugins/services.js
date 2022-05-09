'use strict'
import instance from "./axios.js";

const ITEM_URL = 'api/v2/catalog/items';
const TOKEN_URL = 'auth/token_refresh';
let cookies = [];

function getCookiesToString() {
    let res = "";
    cookies.forEach(cookie => {
        res += cookie + ";";
    })
    return res;
}

function makeUrl(params) {
    let url = ITEM_URL + '?'
    for (const [key, value] of Object.entries(params))
        url += key + '=' + value + '&';
    return url.slice(0, -1);
}

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