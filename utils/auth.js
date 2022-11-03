import { removePlatformPaseto, setPlatformPaseto } from "./storage";
import supabase from "./supabase";

// todo: signIn
export const signIn = async ({ email, password }) => {
  // supabase.auth.
  const { error, session, user } = await supabase.auth.signIn({ 
    email,
    password,
  });
  return { error, session, user };
};

// todo: sign out
export const signOut = async () => {
  removePlatformPaseto();
  const { error } = await supabase.auth.signOut();
  return { error };
};

// todo: single function to dynamically login using any provider
export const signInWithProvider = async (provider) => {
  
    const { session, error } = await supabase.auth.signIn( 
      {
        provider,
      },
      // only redirects to a page in thesame domain
      { redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}` } // no way to pass the paceto using this option
      );
      return { session, error };

 
};

// todo: sign up
export const signUp = async ({ email, password }) => {
  const { user, session, error } = await supabase.auth.signUp(
    {
      email,  
      password,
    }
  );
  return { user, session, error };
};

// todo: create Recovery for the forgotten password
export const createRecovery = async (email) => {
  const { data, error } = await supabase.auth.api.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_ORIGIN}/update-password`,
  });
  return { data, error };
};

// todo: update password
export const updatePassword = async (password) => {
  // updating new password
  const access_token = supabase.auth.session().access_token;
  const { error, data } = await supabase.auth.api.updateUser(access_token, {
    password,
  });
  return { data, error };
};

// todo: check auth/user
export const checkUser = () => {
  const user = supabase.auth.user();
  return user;
};
