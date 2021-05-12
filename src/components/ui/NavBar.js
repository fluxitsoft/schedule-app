import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { startLogout } from '../../actions/auth';
import { eventLogout } from '../../actions/events';

export const NavBar = () => {

    const dispatch = useDispatch();
    const { username } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(startLogout());
        dispatch(eventLogout());
    }

    return (
        <div className="navbar navbar-dark bg-dark mb-4">
            <span className="navbar-brand">
                {username}
            </span>
            <button
                className="btn btn-outline-danger"
                onClick={handleLogout}
            >
                <i className="fas fa-sign-out-alt"></i>
                <span> Logout</span>
            </button>

        </div>
    )
}
