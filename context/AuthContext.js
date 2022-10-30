import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  ReactNode,
} from "react";
import { checkUser, signOut } from "../utils/auth";
import { getPaseto } from "../utils/platform/platform";
import { getPlatformPaseto, setPlatformPaseto } from "../utils/storage";
import supabase from "../utils/supabase";
import axios from "axios";
import { get } from "http";
import { deleteStorage, getStorage } from "../utils/localStorage";

const AuthContext = createContext(undefined);

// type Values = {
//     isAuthenticated: boolean,
//     setIsAuthenticated: (isAuthenticate:boolean)=>void
//     logout: ()=>void
// }

// interface AuthContextProviderProps{
//     children: ReactNode
// }

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const {path, basePath, asPath, push } = useRouter();

// console.log(path,basePath)

// Effect to handle redirecting of a user to last visited page
// before logging into application
useEffect(() => {
  const lastVisitedPage = getStorage('lastVisitedPage')
  const shouldRedirect = getStorage('shouldRedirect')
  if(shouldRedirect === 'true'){
    // clear shouldRedirect & lastVisitedPage in local storage
    deleteStorage('shouldRedirect')
    deleteStorage('lastVisitedPage')
    lastVisitedPage? push(lastVisitedPage) : push('/')
  }
}, [])

  useEffect(() => {
    console.log('from effect',isAuthenticated)
    if (isAuthenticated && !getPlatformPaseto()) {
      getPaseto(supabase.auth.session().access_token).then(res=>{
        setPlatformPaseto(res)
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // checks if user already signed in when they land

    const user = checkUser();
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // updateSupabaseCookie(event, session);
        if (event === "SIGNED_IN") {
          setIsAuthenticated(true);
        }
        if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      // @ts-ignore
      authListener?.unsubscribe();
    };
  }, [push, setIsAuthenticated]); 

  const logout = () => {
    setIsAuthenticated(false);
    signOut();
  };

  const values = {
    isAuthenticated,
    setIsAuthenticated,
    logout,
    currentUser,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("Context is not being used under its provider");
  }

  return context;
};

export { useAuthContext, AuthContextProvider };
