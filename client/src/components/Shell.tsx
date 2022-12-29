import Header from "./Header";

type Props = {
  children: JSX.Element;
};

const Shell = (props: Props) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <Header />
      {props.children}
    </div>
  );
};

export default Shell;
