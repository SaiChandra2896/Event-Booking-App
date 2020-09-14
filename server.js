const express = require('express');
const bodyParser = require('body-parser'); 
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/isAuth');

const app = express();
app.use(bodyParser.json());

app.use(isAuth);

// use graphql middleware
app.use('/graphql', graphqlHttp.graphqlHTTP({
    schema: graphQLSchema,
    // we write resolvers in rootValue
    rootValue: graphQLResolvers,
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