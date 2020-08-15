import React, { useState, useEffect, useLayoutEffect } from "react";
import { LetterPublishRequest } from "../../ApiRequests/LetterPublishRequest";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import useFetch from "use-http";
import { UserResponse } from "../../ApiResponses/UserResponse";
import { LetterResponse } from "../../ApiResponses/LetterResponse";
import { API } from "../../Constants/API";

export default function DevsLetterProducerHeader() {
  const {
    watch,
    control,
    register,
    setValue,
    getValues,
    handleSubmit,
    errors,
  } = useForm<LetterPublishRequest>({
    defaultValues: { items: [{ link: "" }, { link: "" }, { link: "" }] },
  });
  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  let [isEditing, setIsEditing] = useState(false);
  let [editable, setEditable] = useState(false);
  let [hasLetter, setHasLetter] = useState(false);
  let [letter, setLetter] = useState<LetterResponse>();

  const { get, post, put, response } = useFetch(`${API.CORE}/api`);

  let user = localStorage.getItem("user")!;
  let userResponse = JSON.parse(user) as UserResponse;

  const publishLetter = async (data: any) => {
    if (hasLetter) {
      await put(`/letters/${letter!.id}/`, data);
      if (response.ok) {
        setIsEditing(false);
      }
    } else {
      await post(`/users/${userResponse.id}/letter/publish`, data);
      if (response.ok) {
      }
    }
  };

  const onSubmit: SubmitHandler<LetterPublishRequest> = async (data) => {
    await publishLetter(data);
  };

  useEffect(() => {
    getLetter();
  }, []);

  const getLetter = async () => {
    await get(`/users/${userResponse.id}/letter/`);
    if (response.ok) {
      setEditable(true);
      letter = response.data;
      setLetter(response.data);
      setHasLetter(true);
      letter &&
        letter.items.forEach(function (item, index) {
          setValue(`items[${index}].link`, item.link);
        });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="columns">
          {fields.map((item, index) => (
            <div className="column is-4" key={`${index}`}>
              <div className="field">
                <label className="label is-medium">Link {index + 1} : </label>
                <div className="control">
                  <input
                    className="input is-medium"
                    name={`items[${index}].link`}
                    disabled={!isEditing}
                    ref={register({
                      required: true,
                    })}
                    defaultValue={item.link}
                  />
                </div>
              </div>
              {errors.items && (
                <p>{errors.items[index]?.link?.message} link is required</p>
              )}
            </div>
          ))}
        </div>
        <div className="columns">
          <div className="column is-12">
            <h1>{letter && letter.status}</h1>
          </div>
        </div>

        <div className="field is-right">
          <div className="control is-right">
            {editable && !isEditing && (
              <input
                className="button is right"
                type="button"
                value="Edit"
                onClick={() => {
                  setEditable(true);
                  setIsEditing(true);
                }}
              />
            )}
            {!editable && !isEditing && (
              <input
                className="button is right"
                type="submit"
                value="Publish"
              />
            )}
            {isEditing && (
              <input className="button is right" type="submit" value="Save" />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
