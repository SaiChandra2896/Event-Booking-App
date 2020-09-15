import React,{createRef} from 'react';

import './Auth.css'

const AuthPage = () => {
    const emailEl = createRef();
    const passwordEl = createRef();

    const submitHandler =async (e) =>{
        e.preventDefault();

        const email = emailEl.current.value;
        const password = passwordEl.current.value;
        console.log(email,password);

        if(email.trim().length === 0 || password.trim().length === 0)return;

        const requestBody = {
            query: `
              mutation {
                createUser(userInput: {email: "${email}", password: "${password}"}) {
                  _id
                  email
                }
              }
            `
          };
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
            console.log(resData);
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
                <button type="button">Switch to Login</button>
                <button type="submit">Submit</button>
            </div>
        </form>
    )
}

export default AuthPage;
