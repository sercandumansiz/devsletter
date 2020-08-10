import React from "react";
import "./style.css";
import { LetterPublishRequest } from "../../ApiRequests/LetterPublishRequest";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import useFetch from "use-http";
import { UserResponse } from "../../ApiResponses/UserResponse";

export default function DevsLetterObserverHeader() {
  const { register, control, handleSubmit, errors } = useForm<
    LetterPublishRequest
  >({
    defaultValues: { items: [{ link: "" }, { link: "" }, { link: "" }] },
  });
  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const { post, response } = useFetch("http://localhost:5002/api");

  let user = localStorage.getItem("user")!;
  let userResponse = JSON.parse(user) as UserResponse;

  const publishLetter = async (data: any) => {
    console.log(data);
    await post(`/users/${userResponse.id}/letter/publish`, data);
    if (response.ok) {
      console.log(response);
    }
  };

  const onSubmit: SubmitHandler<LetterPublishRequest> = async (data) => {
    await publishLetter(data);
  };

  return (
    <div className="DevsLetterHeader">
      <div className="HeaderCard">
        <form className="LetterPublishForm" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((item, index) => (
            <div className="LetterPublishFormInput" key={`tems[${index}]`}>
              <label>Link {index + 1} : </label>
              <input
                name={`items[${index}].link`}
                ref={register({
                  required: true,
                })}
                defaultValue={item.link}
              />
              {errors.items && (
                <p>{errors.items[index]?.link?.message} link is required</p>
              )}
            </div>
          ))}
          <div className="LoginFormInput">
            <input type="submit" value="Publish" />
          </div>
        </form>
      </div>
    </div>
  );
}
