import { Link } from "react-router-dom";
import { AuthUser } from "../models/auth-user.model";
import Avatar from "./Avatar";

type Props = {
  onClose: () => void;
  currentUser?: AuthUser;
};

const CurrentUserMenuHeader = ({ onClose, currentUser }: Props) => {
  return (
    <div className="menuItem" onClick={onClose}>
      <Link to="/me">
        <div className="-m-3 flex items-center rounded-lg">
          {currentUser && <Avatar user={currentUser} className="h-14 w-14" />}
          <div className="ml-4">
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {currentUser?.name}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-200">
              See your profile
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CurrentUserMenuHeader;
