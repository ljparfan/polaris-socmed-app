import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { User } from "../entities/user.entity";

@ValidatorConstraint({ async: true })
export class DuplicateUsernameConstraint
  implements ValidatorConstraintInterface
{
  validate(username: any, _: ValidationArguments) {
    return User.count({ where: { username } }).then((count) => count === 0);
  }
}

export function DuplicateUsername(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DuplicateUsernameConstraint,
    });
  };
}
