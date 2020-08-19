import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useFetch from "use-http";
import "./style.css";
import { Link } from "react-router-dom";
import { RegisterRequest } from "../ApiRequests/RegisterRequest";
import { AuthResponse } from "../ApiResponses/AuthResponse";
import { API } from "../Constants/API";

export default function SignUp() {
  const { register, handleSubmit, errors } = useForm<RegisterRequest>();
  const { post, response } = useFetch(`${API.AUTH}/api`);

  const registerUser = async (data: any) => {
    await post("/users/register", data);
    if (response.ok) {
      await post("/users/token", data);
      if (response.ok) {
        const auth: AuthResponse = response.data;

        localStorage.setItem("token", auth.token);
        localStorage.setItem("refreshToken", auth.refreshToken);
        localStorage.setItem("user", JSON.stringify(auth.user));
        window.location.href = "/";
      }
    }
  };

  const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    await registerUser(data);
  };

  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-5">
          <div className="box">
            <h1 className="has-text-centered title">Welcome!</h1>
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
                  <Link className="button is-link is-light" to="/login">
                    I have an account
                  </Link>
                </div>
                <div className="control">
                  <button type="submit" className="button is-link">
                    Join
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
