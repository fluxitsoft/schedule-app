import React from 'react';
import { useDispatch } from 'react-redux';

import './login.css';
import {useForm} from '../../hooks/useForm';
import { startLogin } from '../../actions/auth';
import Swal from 'sweetalert2';

export const Login = () => {

    const dispatch = useDispatch();

    const [ formLoginValues, handleLoginInputChange ] = useForm({
        username: 'test',
        password: 'test'
    });

    const { username, password } = formLoginValues;

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === '' && password === '') {
            Swal.fire('Info', 'Username and password cannot be empty', 'info');
        } else {
            if (username === '') {
                Swal.fire('Info', 'Debe ingresar su nombre de usuario', 'info');
                return;
            }
            if (password === '') {
                Swal.fire('Info', 'Debe ingresar su contraseña', 'info');
                return;
            }
        }
        dispatch(startLogin(username, password));
    }

    return (
        <div className="container login-container">
            <div className="row  justify-content-md-center">
                <div className="col-md-6 login-form-1">
                    <h3>Login</h3>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                name="username"
                                value={username}
                                onChange={handleLoginInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={handleLoginInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="submit"
                                className="btnSubmit"
                                value="Login"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
