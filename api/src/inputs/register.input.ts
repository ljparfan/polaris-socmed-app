import { IsEmail, Length, Matches, MaxLength } from "class-validator";
import { PASSWORD_REQUIREMENT_REGEX } from "../utils/constants";
import { DuplicateEmail } from "../validators/duplicate-email.validator";
import { DuplicateUsername } from "../validators/duplicate-username.validator";

export class RegisterInput {
  @Length(5, 15)
  @DuplicateUsername({
    message: "Username $value already exists. Choose another username.",
  })
  username: string;

  @IsEmail()
  @DuplicateEmail({
    message: "Email $value already exists. Choose another email.",
  })
  email: string;

  @MaxLength(50)
  name: string;

  @Matches(PASSWORD_REQUIREMENT_REGEX, { message: "Invalid password format" })
  password: string;
}
