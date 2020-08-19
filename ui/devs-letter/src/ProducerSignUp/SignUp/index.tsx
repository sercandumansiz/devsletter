import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useFetch from "use-http";
import "./style.css";
import { ProducerSignUpRequest } from "../../ApiRequests/ProducerSignUpRequest";
import { UserResponse } from "../../ApiResponses/UserResponse";
import { AuthResponse } from "../../ApiResponses/AuthResponse";
import { API } from "../../Constants/API";

export default function ProducerSignUp() {
  const { register, handleSubmit, errors } = useForm<ProducerSignUpRequest>();
  const businessAPI = useFetch(`${API.CORE}/api`);
  const authAPI = useFetch(`${API.AUTH}/api`);

  const signUpProducer = async (data: any) => {
    let user = localStorage.getItem("user");
    if (user) {
      let userResponse = JSON.parse(user) as UserResponse;
      await businessAPI.post(`/users/${userResponse.id}/producer/become`, data);
      if (businessAPI.response.ok) {
        let refreshToken = localStorage.getItem("refreshToken");
        await authAPI.get(`/users/token/${refreshToken}/refresh`);
        if (authAPI.response.ok) {
          const auth: AuthResponse = authAPI.response.data;
          localStorage.setItem("token", auth.token);
          localStorage.setItem("refreshToken", auth.refreshToken);
          localStorage.setItem("user", JSON.stringify(auth.user));
          window.location.href = "/showcase";
        }
      }
    }
  };

  const onSubmit: SubmitHandler<ProducerSignUpRequest> = async (data) => {
    await signUpProducer(data);
  };

  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-5">
          <div className="box">
            <h1 className="has-text-centered title">Producer</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="username"
                    name="username"
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.username && (
                    <p className="help is-danger">
                      {errors.username.message} username is required
                    </p>
                  )}
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="(twitter, linkedin, blog etc.)"
                    name="referenceLink"
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.referenceLink && (
                    <p className="help is-danger">
                      {errors.referenceLink.message} link is required
                    </p>
                  )}
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="additional note"
                    name="note"
                    ref={register({
                      required: true,
                    })}
                  />
                  {errors.note && <p>{errors.note.message} note is required</p>}
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-link is-fullwidth">
                    Become a Producer
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
