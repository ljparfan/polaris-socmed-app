import { ButtonHTMLAttributes } from "react";

type Props = {
  loading?: boolean;
  isTextWhite?: boolean;
};

const Button = ({
  loading,
  children,
  disabled,
  className,
  isTextWhite,
  ...otherProps
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...otherProps}
      className={`rounded-md flex justify-center items-center text-white relative py-2 px-4 shadow font-bold transition ease-in-out duration-150 focus:outline-none ${
        disabled || loading ? "cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      disabled={disabled || loading}
    >
      {loading ? (
        <svg
          className={`animate-spin -ml-1 h-5 w-5 ${
            isTextWhite ? "text-white" : "text-neutral-700"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={4}
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
