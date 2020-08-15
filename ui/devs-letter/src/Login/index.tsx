import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useFetch from "use-http";
import "./style.css";
import { Link } from "react-router-dom";
import { AuthResponse } from "../ApiResponses/AuthResponse";
import { LoginRequest } from "../ApiRequests/LoginRequest";
import { API } from "../Constants/API";

export default function Login() {
  const { register, handleSubmit, errors } = useForm<LoginRequest>();
  const { post, response } = useFetch(`${API.AUTH}/api`);

  const loginUser = async (data: any) => {
    await post("/users/token", data);
    if (response.ok) {
      const auth: AuthResponse = response.data;

      localStorage.setItem("token", auth.token);
      localStorage.setItem("refreshToken", auth.refreshToken);
      localStorage.setItem("user", JSON.stringify(auth.user));
      window.location.href = "/";
    }
  };

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    await loginUser(data);
  };

  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-5">
          <div className="box">
            <h1 className="has-text-centered title">Nice to see you!</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="e-mail"
                    name="email"
                    ref={register({
                      required: true,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "invalid email address",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="help is-danger">
                    {errors.email.message} email is required
                  </p>
                )}
              </div>
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    placeholder="password"
                    name="password"
                    ref={register({
                      required: true,
                      minLength: 6,
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="help is-danger">
                    {errors.password && (
                      <p>
                        password is required and must contains minimum <b>6</b>{" "}
                        characters
                      </p>
                    )}
                  </p>
                )}
              </div>
              <div className="field is-grouped is-grouped-right">
                <div className="control">
                  <Link className="button is-link is-light" to="/join">
                    I don't have an account
                  </Link>
                </div>
                <div className="control">
                  <button className="button is-link">Login</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
