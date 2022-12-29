import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { User } from "../entities/user.entity";

@ValidatorConstraint({ async: true })
export class DuplicateEmailConstraint implements ValidatorConstraintInterface {
  validate(email: any, _: ValidationArguments) {
    return User.count({ where: { email } }).then((count) => count === 0);
  }
}

export function DuplicateEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DuplicateEmailConstraint,
    });
  };
}
