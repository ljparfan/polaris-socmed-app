import { Schema } from "joi";
import { ChangeEvent, useState } from "react";

function useForm<T>(
  initialValue: T | (() => T),
  validationSchema?: Schema<T>
): [
  T,
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  (event: ChangeEvent<HTMLInputElement>) => void,
  { [key: string]: string[] }
] {
  const [value, setValue] = useState<T>(initialValue);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const onValueChange = ({
    currentTarget: input,
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue({ ...value, [input.name]: input.value });
    const validationErrors = validationSchema
      ?.extract(input.name)
      .validate(input.value);
    if (validationErrors) {
      setErrors({
        ...errors,
        [input.name]:
          validationErrors.error?.details.map((detail) => detail.message) || [],
      });
    }
  };

  const onCheckedChange = ({
    currentTarget: input,
  }: ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [input.name]: input.checked });
  };

  return [value, onValueChange, onCheckedChange, errors];
}

export default useForm;
