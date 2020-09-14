const {dateToString} = require('../../helpers/date');

const User = require('../../models/User');
const Event = require('../../models/Event');

const {transformEvent} = require('./merge');

module.exports = {
    events: async () =>{
        try {
            const events = await Event.find();

            const eventsWithUser = events.map(async event => {
                // console.log(event.creator);
                return transformEvent(event);
            })
            return eventsWithUser;
        } catch (error) {
            throw error;
        }
    },
    createEvent: async (args,req) =>{
        if(!req.isAuth){
            throw new Error('unauthenticated');
        }
        try {
            const {title, description, price,date} = args.eventInput;

            const user = await User.findById(req.userId);
            if(!user) throw new Error('User does not exist');

            const event = new Event({
                title, description,
                price: +price,
                date: dateToString(date),
                creator: req.userId
            });
            user.createdEvents.push(event);

            await user.save();
            await event.save();
            return transformEvent(event);
            
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}