const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

module.exports = {
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
    login: async ({email, password}) =>{
        const user = await User.findOne({email});
        if(!user) throw new Error('User does not exist');

        const isEqual =  await bcrypt.compare(password, user.password);
        if(!isEqual) throw new Error('Password is incorrect');
        
        const token = jwt.sign({userId: user.id, email: user.email},'somesupersecretkey',{
            expiresIn: '1h'
        });

        return {
            userId: user.id,
            token,
            tokenExpiration: 1
        }
    },
}