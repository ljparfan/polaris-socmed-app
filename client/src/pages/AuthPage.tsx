import logo from "../assets/polaris-logos_transparent.png";
import { Outlet } from "react-router-dom";

type Props = {};

const AuthPage = (props: Props) => {
  return (
    <div className="flex flex-col min-h-full w-full justify-center items-center bg-white dark:bg-neutral-900">
      <img className="mx-auto h-40 w-auto" src={logo} alt="logo" />
      <div className="w-full md:w-4/12 flex px-5">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthPage;
