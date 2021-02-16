import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import firebase from '../../firebase';
import { useState } from 'react';

function LoginPage() {

    const { register, watch, errors, handleSubmit} = useForm();
    const [errorFromSubmit, seterrorFromSubmit] = useState("")
    const [loading, setloading] = useState(false)


    const onSubmit = async (data)=>{

        try {
            setloading(true)

            await firebase.auth().signInWithEmailAndPassword(data.email, data.password)

            setloading(false)
        } catch (error) {
            seterrorFromSubmit(error.message)
            setloading(false)
            setTimeout(() => {
                seterrorFromSubmit("")
            }, 5000);
        }

        
    }

    return (
        <div className="auth-wrapper">
            <div style={{textAlign:'center'}}>
                <h3>Login</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        ref={register({ required: true, pattern: /^\S+@\S+$/i})}
                    />
                    {errors.email && <p>This field is required</p>}
                <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        ref={register({ required: true, minLength: 6 })}
                    />
                    {errors.password&& errors.password.type === "required" && <p>This password field is required</p>}
                    {errors.password&& errors.password.type === "minLength" && <p>Password must have at least 6 characters</p>}
                    <input type="submit" disabled={loading}/>
                    <Link style={{ color:"gray", textDecoration:'none'}} to="register">회원 가입</Link>
            </form>
        </div>
    )
}

export default LoginPage
