import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useFetch from 'use-http'
import "./style.css";
import { useHistory, Link } from "react-router-dom";

type LoginForm = {
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
}

export default function Login() {
  let history = useHistory();
  const { register, handleSubmit, errors } = useForm<LoginForm>();
  const { post, response } = useFetch('http://localhost:5000/api')

  const loginUser = async (data:any) => {
      await post('/users/token', data)
      if (response.ok) {
        let auth : AuthResponse = response.data;
        localStorage.setItem("token", auth.token)
        // TODO : route
        window.location.href = "/showcase";
      }
  }
  
  const onSubmit: SubmitHandler<LoginForm> = async data => {
    await loginUser(data);
  }

  return (
    <form className="LoginForm" onSubmit={handleSubmit(onSubmit)}>
      
      <div className="FormInput">
            <label>email : </label>
            <input name="email" ref={register({
              required: true,
              pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address"
                }
            })} />
        {errors.email && <p>{errors.email.message} email is required</p>}
      </div>
    
    <div className="FormInput">
      <label>password : </label>
      <input type="password" name="password" ref={register({
        required: true, minLength: 6
      })} />
          {errors.password && <p>password is required and must contains minimum <b>6</b> characters</p>}
      </div>
       <div className="FormInput">
      
    

        <input type="submit" />
        <Link className="Link" to="/join">I don't have an account</Link>
</div>
    </form>
  );
}