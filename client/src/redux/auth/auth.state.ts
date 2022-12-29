import { AuthUser } from "../../models/auth-user.model";

// Define a type for the slice state
export interface AuthState {
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  currentUser?: AuthUser;
  signUpErrors: string[];
}

// Define the initial state using that type
export const initialAuthState: AuthState = {
  loading: true,
  accessToken: null,
  error: null,
  signUpErrors: [],
};
