import { useState, ChangeEvent } from "react";

const useInput = (
  initialValue: string | (() => string) = ""
): [
  string,
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  () => void
] => {
  const [state, setState] = useState(initialValue);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState(e.currentTarget.value);
  };

  const clearValue = () => setState("");

  return [state, onChange, clearValue];
};

export default useInput;
