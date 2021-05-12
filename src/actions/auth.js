import Swal from 'sweetalert2';
import { decodeJWT } from '../helpers/jwt-processor';
import { postFormUrlEncoded } from '../helpers/request-service';
import { types } from '../types/types';

export const startLogin = (username, password) => {
    return async (dispatch) => {

        try {
            const data = {
                username: username,
                password: password,
                client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
                grant_type: 'password'
            }

            const res = await postFormUrlEncoded(process.env.REACT_APP_KEYCLOAK_API_URL, data);

            if (res.status === 200) {
                const body = await res.json();

                localStorage.setItem('token', body.access_token);
                localStorage.setItem('refresh_token', body.refresh_token);
                
                const jsonPayload = decodeJWT(body.access_token);
                localStorage.setItem('token-exp-date', jsonPayload.exp);

                dispatch(login({
                    username: jsonPayload.preferred_username,
                }));

            } else if (res.status === 401) {
                Swal.fire('Error', 'Invalid credentials', 'error');
            } else {
                Swal.fire('Error', 'Operation went wrong, please try again later', 'error');
            }
        } catch (error) {
            console.log(error);
            Swal.fire('Error', 'Operation went wrong, please try again later', 'error');
        }

    }
}

export const startValidating = () => {
    return async (dispatch) => {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
            try {

                const data = {
                    refresh_token: refreshToken,
                    client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
                    grant_type: 'refresh_token'
                }

                const res = await postFormUrlEncoded(process.env.REACT_APP_KEYCLOAK_API_URL, data);

                if (res.status === 200) {
                    const body = await res.json();

                    localStorage.setItem('token', body.access_token);
                    localStorage.setItem('refresh_token', body.refresh_token);
                    localStorage.setItem('token-init-date', new Date().getTime());

                    const jsonPayload = decodeJWT(body.access_token);

                    dispatch(login({
                        username: jsonPayload.preferred_username,
                    }));
                }
            } catch (error) {
                console.log(error);
            }
        }
        
        dispatch(validationFinished());
    }
}

const login = (user) => ({
    type: types.authLogin,
    payload: user,
})

const validationFinished = () => ({ type: types.authValidated });

export const startLogout = () => {
    return (dispatch) => {
        localStorage.clear();
        dispatch(logout());
    }
}

const logout = () => ({ type: types.authLogout });