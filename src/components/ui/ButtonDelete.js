import React from 'react';
import { useDispatch } from 'react-redux';
import { eventStartDelete } from '../../actions/events';

export const ButtonDelete = () => {

    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(eventStartDelete());
    }

    return (
        <button
            className="btn btn-danger floating-action-danger"
            onClick={handleDelete}>
            <i className="fas fa-trash"></i>
        </button>
    )
}
