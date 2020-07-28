import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useFetch from 'use-http'
import "./style.css";
import { useHistory } from "react-router-dom";

type RegistrationForm = {
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
}

export default function SignUp() {
  let history = useHistory();
  const { register, handleSubmit, errors } = useForm<RegistrationForm>();
  const { post, response } = useFetch('http://localhost:5000/api')

  const registerUser = async (data:any) => {
   await post('/users/register', data)
    if (response.ok) {
      await post('/users/token', data)
      if (response.ok) {
        let auth : AuthResponse = response.data;
        localStorage.setItem("token", auth.token)
        history.push('/showcase')
      }
    }
  }
  
  const onSubmit: SubmitHandler<RegistrationForm> = async data => {
    await registerUser(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <label>email : </label>
      <input name="email" ref={register({
        required: true,
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "invalid email address"
          }
      })} />

      <label>password : </label>
      <input type="password" name="password" ref={register({
        required: true, minLength: 6
      })} />

      {errors.email && <p>{errors.email.message} email is required</p>}
      {errors.password && <p>password is required and must contains minimum <b>6</b> characters</p>}

      <input type="submit" />

    </form>
  );
}