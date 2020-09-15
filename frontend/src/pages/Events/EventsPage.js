import React, { Fragment, useState } from 'react';

import Modal from '../../components/Modal/Modal';
import Backdrop from '../../components/Backdrop/Backdrop';

import './Events.css';

const EventsPage = () => {
    const [creating,setCreating] = useState(false);
    
    const createEvenHandler = () =>{
        setCreating(true);
    }

    const modalCofirmhandler = () =>{
        setCreating(false);
    };

    const modalCancelHandler = () =>{
        setCreating(false)
    }

    return (
        <Fragment>
            {creating && <Backdrop/>}
            {creating && <Modal title="Add Event" canCancel canConfirm onCancel={modalCancelHandler} onConfirm={modalCofirmhandler}>
                <p>Modal Content</p>
                        </Modal>}
            <div className="events-control">
                <p>Share Your Events!!</p>
                <button className="btn" onClick={createEvenHandler}>Create Event</button>
            </div>
        </Fragment>
    )
}

export default EventsPage;
