import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const Badge = ({ children, className }: Props) => {
  return (
    <span
      className={`absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 rounded-full ${
        className ?? ""
      }`}
    >
      {children}
    </span>
  );
};

export default Badge;
