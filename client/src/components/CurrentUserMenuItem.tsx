import { useCallback } from "react";
import { AcademicCapIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";

type Props = {
  component: "button" | "link";
  to?: string;
  onClick?: () => void;
  onClose: () => void;
  icon: typeof AcademicCapIcon;
  text: string;
};

const CurrentUserMenuItem = ({
  onClick,
  component,
  onClose,
  to,
  icon: Icon,
  text,
}: Props) => {
  const getMenuItem = useCallback(() => {
    return (
      <div className="menuItemContainer">
        <div className="menuItemIconButton">
          <Icon className="menuItemIconButtonIcon" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-700 dark:text-neutral-200">
            {text}
          </p>
        </div>
      </div>
    );
  }, [Icon, text]);

  return component === "link" ? (
    <div className="menuItem" onClick={onClose}>
      <Link to={to!}>{getMenuItem()}</Link>
    </div>
  ) : (
    <button className="menuItem w-full" onClick={onClick}>
      {getMenuItem()}
    </button>
  );
};

export default CurrentUserMenuItem;
