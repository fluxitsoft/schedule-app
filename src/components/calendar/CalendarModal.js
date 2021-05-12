import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Modal from 'react-modal';
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';

import { uiCloseModal } from '../../actions/ui';
import { eventClearActive, eventStartAddNew, eventStartUpdate } from '../../actions/events';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

Modal.setAppElement('#root');

const inAnHour = moment().minutes(0).seconds(0).add(1, 'hours');
const in2Hours = inAnHour.clone().add(1, 'hours');

const initEvent = {
    title: '',
    notes: '',
    start: inAnHour.toDate(),
    end: in2Hours.toDate(),
}

export const CalendarModal = () => {

    const [startDate, setStartDate] = useState(inAnHour.toDate());
    const [endDate, setEndDate] = useState(in2Hours.toDate());
    const [validTitle, setValidTitle] = useState(true);

    const { modalOpen } = useSelector(state => state.ui);
    const { active } = useSelector(state => state.events);

    const dispatch = useDispatch();

    const [formValues, setFormValues] = useState(initEvent);

    const { notes, title, start, end } = formValues;

    // Observe changes in active
    useEffect(() => {
        if (active) {
            setFormValues(active);
        } else {
            setFormValues(initEvent);
        }
    }, [active, setFormValues]);

    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const closeModal = (e) => {
        dispatch(uiCloseModal());
        dispatch(eventClearActive());
        setFormValues(initEvent);
    };

    const handleStartDate = (e) => {
        setStartDate(e);
        setFormValues({
            ...formValues,
            start: e
        })
    }

    const handleEndDate = (e) => {
        setEndDate(e);
        setFormValues({
            ...formValues,
            end: e
        })
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();

        const momentStart = moment(start);
        const momentEnd = moment(end);

        if (momentStart.isSameOrAfter(momentEnd)) {
            Swal.fire('Error', 'End date must be later than start date', 'error');
            return;
        }

        if (title.trim().length < 2) {
            return setValidTitle(false);
        }

        // Save data depending on an active event
        (active) ? dispatch(eventStartUpdate(formValues)) : dispatch(eventStartAddNew(formValues));

        setValidTitle(true);
        closeModal();
    }

    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={customStyles}
            closeTimeoutMS={200}
            className="modal"
            overlayClassName="modal-fondo"
        >
            <h1> {(active) ? 'Edit event' : 'New event'}</h1>
            <hr />
            <form
                className="container"
                onSubmit={handleSubmitForm}>

                <div className="form-group">
                    <label>Start date time</label>
                    <DateTimePicker
                        onChange={handleStartDate}
                        value={startDate}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>End date time</label>
                    <DateTimePicker
                        onChange={handleEndDate}
                        value={endDate}
                        className="form-control"
                        minDate={startDate}
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Title and notes</label>
                    <input
                        type="text"
                        className={`form-control ${!validTitle && 'is-invalid'}`}
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}
                    />
                    <small id="titleHelp" className="form-text text-muted">Short description</small>
                </div>

                <div className="form-group">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notes"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="textHelp" className="form-text text-muted">Additional information</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Save</span>
                </button>

            </form>
        </Modal>
    )
}
