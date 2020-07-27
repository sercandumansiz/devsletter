import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useFetch from 'use-http'
import "./style.css";

type RegistrationForm = {
  email: string;
  password: string;
};

export default function SignUp() {
  const { register, handleSubmit, watch, errors } = useForm<RegistrationForm>();
  const { post, response } = useFetch('http://localhost:5000/api')

  const onSubmit: SubmitHandler<RegistrationForm> = async data => {
    await post('/users/register', data)
    if (response.ok) {
     
      alert(JSON.stringify(data));
      console.log(response.json);
    }
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