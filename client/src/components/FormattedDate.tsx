import moment from "moment";
import { useEffect, useState } from "react";

type Props = {
  value: Date;
  className?: string;
};

const FormattedDate = ({ value, className }: Props) => {
  const [formattedDate, setFormattedDate] = useState<string>(() =>
    moment(value).fromNow()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedDate(moment(value).fromNow());
    }, 60_000);

    return () => {
      clearInterval(interval);
    };
  }, [value]);

  return (
    <p className={`text-xs text-gray-400 dark:text-neutral-400 ${className}`}>
      {formattedDate}
    </p>
  );
};

export default FormattedDate;
