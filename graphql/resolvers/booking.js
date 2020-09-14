const Booking = require('../../models/Booking');
const Event = require('../../models/Booking');

const {dateToString} = require('../../helpers/date');

const {getUser, getSingleEvent} = require('./merge');

const transformBooking = booking =>{
    return{
        ...booking._doc,
        user: getUser(booking._doc.user),
        event: getSingleEvent(booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}


module.exports = {
    bookings: async () =>{
        try {
            const bookings = await Booking.find();
            return bookings.map(booking =>{
                return transformBooking(booking)
            })
        } catch (error) {
            throw error;
        }
    },
    bookEvent: async args =>{
        try {
            const id = args.eventId;
            const event = await Event.findById(id)
            const booking = new Booking({
                user: '5f5ef09a1295a34024f6a164',
                event 
            });
            const bookedEvent = await booking.save();
            return transformBooking(bookedEvent);
        } catch (error) {
            throw error;
        }
    },
    cancelBooking: async args =>{
        try {
            const {bookingId} = args;
            const booking = await Booking.findById(bookingId).populate('event');
            const event = {
                ...booking.event._doc,
                creator: getUser(booking._doc.user)
            }
            await Booking.deleteOne({_id: bookingId});
            return event; 

        } catch (error) {
            throw error;
        }
    }
}