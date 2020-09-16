const express = require('express');
const bodyParser = require('body-parser'); 
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/isAuth');

const app = express();
app.use(bodyParser.json());
app.use(cors())

app.use((req,res,next) =>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type','Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
})

app.use(isAuth);

// use graphql middleware
app.use('/graphql', graphqlHttp.graphqlHTTP({
    schema: graphQLSchema,
    // we write resolvers in rootValue
    rootValue: graphQLResolvers,
    graphiql: true
}));

const PORT = process.env.PORT || 8000;

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