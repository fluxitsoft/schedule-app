import fetchIntercept from 'fetch-intercept';
import moment from 'moment';
import { decodeJWT } from './jwt-processor';

const baseUrl = process.env.REACT_APP_API_URL;

fetchIntercept.register({
    request: async (url, config) => {

        const expDate = moment.unix(localStorage.getItem('token-exp-date'));
        const now = moment();
        const refreshToken = localStorage.getItem('refresh_token') ;
        
        if (expDate.isBefore(now) && url !== process.env.REACT_APP_KEYCLOAK_API_URL && refreshToken) {
            try {
                const params = { 
                    grant_type: 'refresh_token', 
                    client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID, 
                    refresh_token: localStorage.getItem('refresh_token') 
                }
                const res = await postFormUrlEncoded(process.env.REACT_APP_KEYCLOAK_API_URL, params);
                if (res.status === 200) {
                    const body = await res.json();
    
                    localStorage.setItem('token', body.access_token);
                    localStorage.setItem('refresh_token', body.refresh_token);
                    
                    const jsonPayload = decodeJWT(body.access_token);
                    localStorage.setItem('token-exp-date', jsonPayload.exp);

                    config.headers['Authorization'] = `Bearer ${body.access_token}`;
       
                } else {
                   console.log(res.status);
                }
            } catch (error) {
                console.log(error);
            }
        }

        return [url, config];
    }
});

const apiRequest = (endpoint, data, method = 'GET') => {
    const url = `${baseUrl}/${endpoint}`;

    if (method === 'GET') {
        return fetch(url);
    }

    return fetch(url, {
        method,
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}

const secureApiRequest = (endpoint, data, method = 'GET') => {
    const url = `${baseUrl}/${endpoint}`;
    const token = localStorage.getItem('token') || '';

    if (method === 'GET') {
        return fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
    }

    return fetch(url, {
        method,
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    });
}

/**
 * @description Send data using POST method and x-www-form-urlencoded
 */
const postFormUrlEncoded = (url, data) => {
    const formBody = Object.keys(data)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
    });
}

export {
    apiRequest,
    secureApiRequest,
    postFormUrlEncoded,
}