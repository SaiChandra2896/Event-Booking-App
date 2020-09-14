const Booking = require('../../models/Booking');
const Event = require('../../models/Booking');

const {getUser, transformBooking} = require('./merge');

module.exports = {
    bookings: async () =>{
        if(!req.isAuth){
            throw new Error('unauthenticated');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking =>{
                return transformBooking(booking)
            })
        } catch (error) {
            throw error;
        }
    },
    bookEvent: async (args, req) =>{
        if(!req.isAuth){
            throw new Error('unauthenticated');
        }
        try {
            const id = args.eventId;
            const event = await Event.findById(id)
            const booking = new Booking({
                user: req.userId,
                event 
            });
            await booking.save();
            return transformBooking(booking);
        } catch (error) {
            throw error;
        }
    },
    cancelBooking: async (args, req) =>{
        if(!req.isAuth){
            throw new Error('unauthenticated');
        }

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