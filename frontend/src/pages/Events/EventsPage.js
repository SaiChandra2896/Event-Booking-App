import React, { Fragment } from 'react';

import Modal from '../../components/Modal/Modal';

import './Events.css';

const EventsPage = () => {
    return (
        <Fragment>
            <Modal title="Add Event" canCancel canConfirm>
                <p>Modal Content</p>
            </Modal>
            <div className="events-control">
                <p>Share Your Events!!</p>
                <button className="btn">Create Event</button>
            </div>
        </Fragment>
    )
}

export default EventsPage;
