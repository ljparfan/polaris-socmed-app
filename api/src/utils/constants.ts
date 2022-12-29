export const __prod__ = process.env.NODE_ENV === "production";
export const PASSWORD_REQUIREMENT_REGEX =
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
