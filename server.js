const express = require('express');
const bodyParser = require('body-parser'); 
const graphqlHttp = require('express-graphql');
// to build graphql schema
const { buildSchema }= require('graphql');

const app = express();
app.use(bodyParser.json());

const events = [];

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
        events: () =>{
            return events;
        },
        createEvent: (args) =>{
            const {title, description, price} = args.eventInput;
            const event = {
                _id: Math.random().toString(),
                title, description, price: +price,
                date: new Date().toISOString()
            }
            events.push(event);
            return event;
        }
    },
    graphiql: true
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));