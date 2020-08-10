import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useFetch from "use-http";
import "./style.css";
import { ProducerSignUpRequest } from "../../ApiRequests/ProducerSignUpRequest";
import { UserResponse } from "../../ApiResponses/UserResponse";
import { AuthResponse } from "../../ApiResponses/AuthResponse";

export default function ProducerSignUp() {
  const { register, handleSubmit, errors } = useForm<ProducerSignUpRequest>();
  const businessAPI = useFetch("http://localhost:5002/api");
  const authAPI = useFetch("http://localhost:5000/api");
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
    <form className="ProducerSignUpForm" onSubmit={handleSubmit(onSubmit)}>
      <div className="ProducerSignUpFormInput">
        <label>username : </label>
        <input
          name="username"
          ref={register({
            required: true,
          })}
        />
        {errors.username && (
          <p>{errors.username.message} username is required</p>
        )}
      </div>

      <div className="ProducerSignUpFormInput">
        <label>link : </label>
        <input
          name="referenceLink"
          ref={register({
            required: true,
          })}
        />
        {errors.referenceLink && (
          <p>{errors.referenceLink.message} link is required</p>
        )}
      </div>

      <div className="ProducerSignUpFormInput">
        <label>note : </label>
        <input
          name="note"
          ref={register({
            required: true,
          })}
        />
        {errors.note && <p>{errors.note.message} note is required</p>}
      </div>

      <div className="ProducerSignUpFormInput">
        <input type="submit" value="Become a Producer" />
      </div>
    </form>
  );
}
