import React from 'react';
import {useDispatch} from 'react-redux';
import { uiOpenModal } from '../../actions/ui';

export const ButtonAddNew = () => {

    const dispatch = useDispatch();

    const handleClick = (e) => {
        dispatch( uiOpenModal());
    }

    return (
        <button 
            className="btn btn-primary floating-action-button"
            onClick={handleClick}>
            <i className="fas fa-plus"></i>
        </button>
    )
}
