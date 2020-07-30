import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import useFetch from "use-http"
import "./style.css"
import { Link } from "react-router-dom"

type RegistrationForm = {
  email: string
  password: string
}

type AuthResponse = {
  token: string
}

export default function SignUp() {
  const { register, handleSubmit, errors } = useForm<RegistrationForm>()
  const { post, response } = useFetch("http://localhost:5000/api")

  const registerUser = async (data: any) => {
    await post("/users/register", data)
    if (response.ok) {
      await post("/users/token", data)
      if (response.ok) {
        const auth: AuthResponse = response.data
        localStorage.setItem("token", auth.token)
        window.location.href = "/showcase"
      }
    }
  }

  const onSubmit: SubmitHandler<RegistrationForm> = async (data) => {
    await registerUser(data)
  }

  return (
    <form className="SignUpForm" onSubmit={handleSubmit(onSubmit)}>
      <div className="SignUpFormInput">
        <label>email : </label>
        <input
          name="email"
          ref={register({
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "invalid email address",
            },
          })}
        />
        {errors.email && <p>{errors.email.message} email is required</p>}
      </div>

      <div className="SignUpFormInput">
        <label>password : </label>
        <input
          type="password"
          name="password"
          ref={register({
            required: true,
            minLength: 6,
          })}
        />
        {errors.password && (
          <p>
            password is required and must contains minimum <b>6</b> characters
          </p>
        )}
      </div>
      <div className="SignUpFormInput">
        <input type="submit" value="Join"/>
        <Link className="SignUpLink" to="/login">
          I have an account
        </Link>
      </div>
    </form>
  )
}
