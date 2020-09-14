const bcrypt = require('bcryptjs');

const User = require('../../models/User');
const Event = require('../../models/Event');
const Booking = require('../../models/Booking');

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
            return {
                ...event._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: getUser(event._doc.creator)
            }
        });
        return eventsWithUser;
        
    } catch (error) {
        throw error;
    }
}

const getSingleEvent = async eventId =>{
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            creator: getUser(event._doc.creator)
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    events: async () =>{
        try {
            const events = await Event.find();

            const eventsWithUser = events.map(async event => {
                // console.log(event.creator);
                const owner = await getUser(event._doc.creator);
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(), 
                    creator: owner
                }
            })
            return eventsWithUser;
        } catch (error) {
            throw error;
        }
    },
    bookings: async () =>{
        try {
            const bookings = await Booking.find();
            return bookings.map(booking =>{
                return {
                    ...booking._doc,
                    user: getUser(booking._doc.user),
                    event: getSingleEvent(booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            })
        } catch (error) {
            throw error;
        }
    },
    createEvent: async (args) =>{
        try {
            const {title, description, price,date} = args.eventInput;

            const user = await User.findById('5f5ef09a1295a34024f6a164');
            if(!user) throw new Error('User does not exist');

            const event = new Event({
                title, description,
                price: +price,
                date: new Date(date).toISOString(),
                creator: '5f5ef09a1295a34024f6a164'
            });
            user.createdEvents.push(event);

            await user.save();
            await event.save();
            return {
                ...event._doc,
                creator: getUser(event._doc.creator)
            };
            
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createUser: async args =>{
        const {email,password} = args.userInput;

        let user = await User.findOne({email});
        if(user){
            throw new Error('User exists already');
        }

        const salt = await bcrypt.genSalt(12);

        try {
             user = new User({
                email,
                password
            });

            user.password = await bcrypt.hash(password, salt);
            await user.save();
            return {
                ...user._doc,
                password: null
            };
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
            return {
                ...bookedEvent._doc,
                user: getUser(booking._doc.user),
                event: getSingleEvent(booking._doc.event),
                createdAt: new Date(booking._doc.createdAt).toISOString(),
                updatedAt: new Date(booking._doc.updatedAt).toISOString()
            } 
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