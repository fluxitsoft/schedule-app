import { types } from '../types/types';
import Swal from 'sweetalert2';

import { secureApiRequest } from '../helpers/request-service';
import { processEvents } from '../helpers/event-processor';

export const eventStartAddNew = (event) => {
    return async (dispatch, getState) => {

        const { username } = getState().auth;

        try {
            const res = await secureApiRequest('events', event, 'POST');
            const body = await res.json();

            if (res.status === 201) {
                event.id = body.event.id;
                event.user = {
                    username: username,
                }
                dispatch(eventAddNew(event));
            } else {
                Swal.fire('Error', body.message, 'error');
            }
        } catch (error) {
            console.log(error);
            Swal.fire('Error', 'There was a problem while saving the event', 'error');
        }
    }
}

const eventAddNew = (event) => ({
    type: types.eventAddNew,
    payload: event,
});

export const eventSetActive = (event) => ({
    type: types.eventSetActive,
    payload: event,
});

export const eventClearActive = () => ({
    type: types.eventClearActive,
});

export const eventStartUpdate = (event) => {
    return async (dispatch) => {
        try {
            const res = await secureApiRequest(`events/${event.id}`, event, 'PUT');
            const body = await res.json();
            
            (res.status === 200) ? dispatch(eventUpdated(event)) : Swal.fire('Error', body.message, 'error');
        } catch (error) {
            console.log(error);
            Swal.fire('Error', 'There was a problem while updating the event', 'error');
        }
    }
}

const eventUpdated = (event) => ({
    type: types.eventUpdated,
    payload: event,
});


export const eventStartDelete = () => {
    return async (dispatch, getState) => {

        const { id } = getState().events.active;
        try {
            const res = await secureApiRequest(`events/${id}`, {}, 'DELETE');
            const body = await res.json();
            
            (res.status === 200) ? dispatch(eventDeleted()) : Swal.fire('Error', body.message, 'error');
            
        } catch (error) {
            console.log(error);
            Swal.fire('Error', 'There was a problem while deleting the event', 'error');
        }
    }
}


const eventDeleted = () => ({
    type: types.eventDeleted,
});

export const eventStartLoading = () => {
    return async (dispatch) => {
        try {
            const res = await secureApiRequest('events');
            const body = await res.json();

            const events = processEvents(body.events);
            dispatch(eventLoaded(events));
        } catch (error) {
            console.log(error);
            Swal.fire('Error', 'There was a problem while loading the events', 'error');
        }
    }
}

const eventLoaded = (events) => ({
    type: types.eventLoaded,
    payload: events,
});


export const eventLogout = () => ({ type: types.eventLogout });