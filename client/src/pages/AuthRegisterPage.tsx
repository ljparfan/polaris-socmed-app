import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Joi from "joi";
import DefaultProfilePhoto from "../components/DefaultProfilePhoto";
import useForm from "../hooks/useForm";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RegisterForm } from "../models/register-form";
import { resetSignUpErrors, signUpStart } from "../redux/auth/auth.actions";
import PreviewPhotos from "../components/PreviewPhotos";
import Alert from "../components/Alert";
import { selectSignUpErrors } from "../redux/auth/auth.selectors";

type Props = {};

const schema = Joi.object<Partial<RegisterForm>>({
  username: Joi.string().alphanum().min(5).max(15).required().label("Username"),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(50)
    .required()
    .label("Email"),
  password: Joi.string()
    .pattern(
      new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    )
    .label("Password")
    .messages({
      "string.pattern.base":
        "Invalid password format. Password must contain a number, letter in lower caps, letter in upper caps, and a special character.",
    }),
  name: Joi.string().max(50).required().label("Display Name"),
});

const AuthRegisterPage = (props: Props) => {
  const [photo, setPhoto] = useState<File>();
  const [formValue, handleChange, , errors] = useForm<RegisterForm>(
    {
      email: "",
      name: "",
      password: "",
      username: "",
    },
    schema
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    formValue.photo = photo;
  }, [photo, formValue]);

  useEffect(() => {
    return () => {
      dispatch(resetSignUpErrors());
    };
  }, [dispatch]);

  const hasErrors = useMemo(() => {
    const { photo, ...otherFields } = formValue;
    return !!schema.validate(otherFields).error;
  }, [formValue]);

  const apiErrors = useAppSelector(selectSignUpErrors);

  const handleFilesChange = ({
    target: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!files || files.length === 0) {
      return;
    }

    const [photoToUpload] = Array.from(files);

    setPhoto(photoToUpload);
  };

  return (
    <div className="mt-5 w-full">
      <h2 className="text-center text-3xl font-extrabold textDefault">
        Create an account
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 dark:text-neutral-300">
        Already have an account?
        <Link
          to="/auth"
          className="ml-2 font-medium text-indigo-600 hover:text-indigo-500"
        >
          Login instead!
        </Link>
      </p>
      {apiErrors && apiErrors.length > 0 && (
        <div className="mt-2">
          <Alert type="error">
            <ul>
              {apiErrors.map((error) => (
                <li key={error}>
                  <span className="mr-2">&#9679;</span>
                  {error}
                </li>
              ))}
            </ul>
          </Alert>
        </div>
      )}
      <form
        className="flex flex-col space-y-3 py-5"
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(signUpStart(formValue));
        }}
      >
        <Input
          value={formValue.username}
          onChange={handleChange}
          name="username"
          label="Username"
          type="text"
          error={(errors["username"] || [])[0]}
        />
        <Input
          onChange={handleChange}
          value={formValue.email}
          name="email"
          label="Email"
          type="email"
          error={(errors["email"] || [])[0]}
        />
        <Input
          onChange={handleChange}
          value={formValue.password}
          name="password"
          label="Password"
          type="password"
          error={(errors["password"] || [])[0]}
        />
        <Input
          onChange={handleChange}
          value={formValue.name}
          name="name"
          label="Display Name"
          type="text"
          error={(errors["name"] || [])[0]}
        />
        <div>
          <label className="block text-sm font-medium textDefault">Photo</label>
          <div className="mt-1 flex items-center">
            {photo ? (
              <PreviewPhotos
                photos={[photo]}
                onRemove={() => setPhoto(undefined)}
              />
            ) : (
              <DefaultProfilePhoto className="h-48 w-48" />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="photo"
              onChange={handleFilesChange}
            />
            <label
              htmlFor="photo"
              className="cursor-pointer ml-5 py-2 px-3 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-600 rounded-md textDefault"
            >
              Select photo
            </label>
          </div>
        </div>
        <div className="flex flex-col py-2">
          <Button
            disabled={hasErrors}
            type="submit"
            className={`bgPrimary ${hasErrors ? "bgPrimaryDisabled" : ""}`}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AuthRegisterPage;
