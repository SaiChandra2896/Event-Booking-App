const express = require('express');
const bodyParser = require('body-parser'); 
const graphqlHttp = require('express-graphql');
// to build graphql schema
const { buildSchema }= require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/Event');

const app = express();
app.use(bodyParser.json());

// use graphql middleware
app.use('/graphql', graphqlHttp.graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    // we write resolvers in rootValue
    rootValue:{
        events: async () =>{
            try {
                const events = await Event.find();

                return events;
            } catch (error) {
                throw error;
            }
        },
        createEvent: async (args) =>{
            try {
                const {title, description, price,date} = args.eventInput;
                const event = new Event({
                    title, description,
                    price: +price,
                    date: new Date(date)
                });
                await event.save()
                return event;
                
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
    },
    graphiql: true
}));

const PORT = process.env.PORT || 3000;

const connectDB = async () =>{
    try {
        await mongoose.connect('mongodb+srv://sai:12345@event-booking.qylxe.mongodb.net/eventBooking?retryWrites=true&w=majority', 
        {useUnifiedTopology: true,useNewUrlParser: true});
        console.log('mongodb connected');
        
    } catch (error) {
        console.log('error')
    }
}

connectDB();
app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));