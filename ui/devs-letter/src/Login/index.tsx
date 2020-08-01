import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import useFetch from "use-http"
import "./style.css"
import { Link } from "react-router-dom"
import { AuthResponse } from "../ApiResponses/AuthResponse"
import { LoginRequest } from "../ApiRequests/LoginRequest"

export default function Login() {
  const { register, handleSubmit, errors } = useForm<LoginRequest>()
  const { post, response } = useFetch("http://localhost:5000/api")

  const loginUser = async (data: any) => {
    await post("/users/token", data)
    if (response.ok) {
      const auth: AuthResponse = response.data

      localStorage.setItem("token", auth.token)
      localStorage.setItem("refreshToken", auth.refreshToken)
      localStorage.setItem("user", JSON.stringify(auth.user))
      window.location.href = "/"
    }
  }

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    await loginUser(data)
  }

  return (
    <form className="LoginForm" onSubmit={handleSubmit(onSubmit)}>
      <div className="LoginFormInput">
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

      <div className="LoginFormInput">
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
      <div className="LoginFormInput">
        <input type="submit" value="Login"/>
        <Link className="LoginLink" to="/join">
          I don't have an account
        </Link>
      </div>
    </form>
  )
}
