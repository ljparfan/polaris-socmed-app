import { InputHTMLAttributes } from "react";
import { ObjectSchema } from "joi";

type Props = {
  label: string;
  name: string;
  error?: string;
  validationSchema?: ObjectSchema;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({ name, label, error, ...otherInputProps }: Props) => {
  return (
    <div className="">
      <label htmlFor={name} className="block text-sm font-medium textDefault">
        {label}
      </label>
      <input
        autoComplete="off"
        name={name}
        id={name}
        className={`mt-1 h-10 px-3 textInput ${
          error
            ? "border-red-700 text-red-600 focus:border-red-700 focus:ring-red-700"
            : ""
        } block w-full shadow-sm sm:text-sm rounded-md focus:outline-0`}
        {...otherInputProps}
      />
      <div className="text-red-700">{error}</div>
    </div>
  );
};

export default Input;
