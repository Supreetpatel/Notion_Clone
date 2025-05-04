import { user } from "./types";

declare global {
  interface CustomJwtSessionClaims extends user {}
}
