import React,{createRef, useState, useContext} from 'react';

import AuthContext from '../../context/authContext';

import './Auth.css'

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const authContext = useContext(AuthContext);

    const emailEl = createRef();
    const passwordEl = createRef();

    const switchLoginHandler = () =>{
        setIsLogin(prevState => {
            return !prevState
        });
    }

    const submitHandler =async (e) =>{
        e.preventDefault();

        const email = emailEl.current.value;
        const password = passwordEl.current.value;

        if(email.trim().length === 0 || password.trim().length === 0)return;
        let requestBody;

        if(!isLogin){
            requestBody = {
                query: `
                  mutation {
                    createUser(userInput: {email: "${email}", password: "${password}"}) {
                      _id
                      email
                    }
                  }
                `
              };
        }
        else{
            requestBody= {
                query:`
                    query {
                        login(email: "${email}", password: "${password}") {
                            userId
                            token
                            tokenExpiration
                        }
                    }
                `
            }
        }
        try {
            const res =  await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(res.status !== 200 && res.status !== 201)throw new Error('Failed');

            const resData = await res.json();
            if(resData.data.login.token){
                const {token, userId, tokenExpiration} = resData.data.login;
                authContext.login(token, userId, tokenExpiration);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="auth-form" onSubmit={submitHandler}>
            <div className="form-control">
                <label htmlFor="email">E-Mail</label>
                <input type="email" name="email" id="email" ref={emailEl}/>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" ref={passwordEl}/>
            </div>
            <div className="form-actions">
                <button type="button" onClick={switchLoginHandler}>Switch to {isLogin ? 'SignUp' : 'Login'}</button>
                <button type="submit">Submit</button>
            </div>
        </form>
    )
}

export default AuthPage;
