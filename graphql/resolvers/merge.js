const User = require('../../models/User');
const Event = require('../../models/Event');

const {dateToString} = require('../../helpers/date');

const transformEvent = event =>{
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: getUser(event._doc.creator)
    }
}

const transformBooking = booking =>{
    return{
        ...booking._doc,
        user: getUser(booking._doc.user),
        event: getSingleEvent(booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

const getUser = async userId =>{
    try {
        const user = await User.findById(userId).select('-password');
        return {
            ...user._doc,
            createdEvents: getEvents(user._doc.createdEvents)
        };
    } catch (error) {
        throw error;
    }
}

const getEvents = async eventIds =>{
    try {
        const events = await Event.find({_id: {$in: eventIds}});
        const eventsWithUser = events.map(event =>{
            return transformEvent(event);
        });
        return eventsWithUser;
        
    } catch (error) {
        throw error;
    }
}

const getSingleEvent = async eventId =>{
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (error) {
        throw error;
    }
}

exports.getUser = getUser;
exports.getEvents = getEvents;
exports.getSingleEvent = getSingleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;