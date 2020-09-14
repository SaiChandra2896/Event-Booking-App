const bcrypt = require('bcryptjs');

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
    }
}