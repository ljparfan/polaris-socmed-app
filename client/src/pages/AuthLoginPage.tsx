import { FormEventHandler } from "react";
import { LockClosedIcon } from "@heroicons/react/solid";
import useForm from "../hooks/useForm";
import { signInStart } from "../redux/auth/auth.actions";
import { useAppDispatch } from "../redux/hooks";
import { Link } from "react-router-dom";
import Input from "../components/Input";

type Props = {};
type LoginForm = {
  usernameOrEmail: string;
  password: string;
  rememberCredentials: boolean;
};

const AuthLoginPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const [form, onValueChange, onCheckedChange] = useForm<LoginForm>(() => {
    const rememberedCredentialsStr = localStorage.getItem(
      "rememberedCredentials"
    );
    if (rememberedCredentialsStr) {
      const rememberedCredentials = JSON.parse(
        rememberedCredentialsStr!
      ) as LoginForm;

      return rememberedCredentials;
    }

    return {
      usernameOrEmail: "",
      password: "",
      rememberCredentials: false,
    };
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const { rememberCredentials, ...otherFields } = form;
    if (rememberCredentials) {
      localStorage.setItem("rememberedCredentials", JSON.stringify(form));
    } else {
      localStorage.removeItem("rememberedCredentials");
    }
    dispatch(signInStart(otherFields));
  };

  return (
    <div className="flex flex-col w-full">
      <div>
        <h2 className="text-center text-3xl font-extrabold textDefault">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-neutral-300">
          No account?
          <Link
            to="register"
            className="ml-2 font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register now!
          </Link>
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="flex flex-col space-y-3">
          <Input
            name="usernameOrEmail"
            label="Username / Email"
            value={form.usernameOrEmail}
            onChange={onValueChange}
            type="text"
          />
          <Input
            name="password"
            value={form.password}
            onChange={onValueChange}
            type="password"
            label="Password"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              checked={form.rememberCredentials}
              onChange={onCheckedChange}
              id="rememberCredentials"
              name="rememberCredentials"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="rememberCredentials"
              className="ml-2 block text-sm textDefault"
            >
              Remember me
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockClosedIcon
                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                aria-hidden="true"
              />
            </span>
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthLoginPage;
