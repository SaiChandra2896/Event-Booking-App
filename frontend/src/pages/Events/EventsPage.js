import React, { Fragment, useState, createRef, useContext, useEffect } from 'react';

import Modal from '../../components/Modal/Modal';
import Backdrop from '../../components/Backdrop/Backdrop';
import AuthContext from '../../context/authContext';

import './Events.css';

const EventsPage = () => {
    const [creating,setCreating] = useState(false);
    const [events, setEvents] = useState([]);

    const authContext = useContext(AuthContext);

    const titleEl = createRef();
    const priceEl = createRef();
    const dateEl = createRef();
    const descriptionEl = createRef();
    
    const createEventHandler = () =>{
        setCreating(true);
    }

    const modalCofirmhandler = async () =>{
        setCreating(false);
        const title = titleEl.current.value;
        const price = +priceEl.current.value;
        const date = dateEl.current.value;
        const description = descriptionEl.current.value;

        if(title.trim().length === 0 || price<=0|| date.trim().length === 0 || description.trim().length === 0){
            return;
        }

        const event = {
            title, price, date, description
        }
        const requestBody = {
                query: `
                  mutation {
                    createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                      _id
                      title
                      description
                      date
                      price
                      creator{
                          _id
                          email
                      }
                    }
                  }
                `
              };
              const token = authContext.token;
              try {
                const res =  await fetch('http://localhost:8000/graphql', {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if(res.status !== 200 && res.status !== 201)throw new Error('Failed');
    
                const resData = await res.json();
                const event = resData.data.createEvent;
                console.log(event);
                setEvents([...events, event])
            } catch (error) {
                console.log(error);
            }
        }

    const modalCancelHandler = () =>{
        setCreating(false)
    }

    const fetchEvents = async() =>{
        const requestBody = {
            query: `
              query {
                events {
                  _id
                  title
                  description
                  date
                  price
                  creator{
                      _id
                      email
                  }
                }
              }
            `
          };
          try {
            const res =  await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(res.status !== 200 && res.status !== 201)throw new Error('Failed');

            const resData = await res.json();
            const {events} = resData.data;
            setEvents(events);
        } catch (error) {
            console.log(error);
        }
    }

        useEffect(() =>{
            fetchEvents();
        },[]);

    const eventList = events.map((event) => <li className="events__list-item" key={event._id}>{event.title}</li>);

    return (
        <Fragment>
            {creating && <Backdrop/>}
            {creating && <Modal title="Add Event" canCancel canConfirm onCancel={modalCancelHandler} onConfirm={modalCofirmhandler}>
                        <form action="">
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" name="title" id="title" ref={titleEl}/>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" name="price" id="price" ref={priceEl}/>
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" name="date" id="date" ref={dateEl}/>
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea name="description" id="description" cols="30" rows="10" ref={descriptionEl}></textarea>
                            </div>
                        </form>
                        </Modal>}
            {authContext.token ? (<div className="events-control">
                <p>Share Your Events!!</p>
                <button className="btn" onClick={createEventHandler}>Create Event</button>
            </div>) : <h1 style={{textAlign: "center"}}>Login to create an event</h1>}

            <ul className="events__list">
                {eventList}
            </ul>
        </Fragment>
    )
}

export default EventsPage;
