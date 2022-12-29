type Props = {
  className?: string;
};

const Divider = ({ className = "" }: Props) => {
  return (
    <div
      className={`border-b border-b-neutral-200 dark:border-b-neutral-600 my-2 mx-2 ${className}`}
    ></div>
  );
};

export default Divider;
