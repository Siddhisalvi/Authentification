import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // the base url of your auth server

  plugins: [adminClient()],
});

/*const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
  return data;
};

export default signIn();*/

export const { signUp, signIn, signOut } = authClient;
