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
import { deleteStorage, getStorage, setStorage } from "../utils/localStorage";

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


// Effect to handle redirecting of a user to last visited page
// after logging into application
useEffect(() => {
  // TODO: move this into a function?
  const lastVisitedPage = getStorage('lastVisitedPage')
  const shouldRedirect = getStorage('shouldRedirect') // whether or not to redirect to last visited page
  if(shouldRedirect === 'true'){
    // if redirecting back to service page, then leave the cart open 

    // clear shouldRedirect & lastVisitedPage in local storage
    deleteStorage('shouldRedirect')
    deleteStorage('lastVisitedPage')
    lastVisitedPage? push(lastVisitedPage) : push('/')
  }
  deleteStorage('lastVistedPage');
  // push(lastVisitedPage)
}, [])

  useEffect(() => {
    if (isAuthenticated && !getPlatformPaseto()) {
      getPaseto(supabase.auth.session().access_token).then(res=>{
        setPlatformPaseto(res)
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    async function refreshUser(){
      const refreshToken = supabase.auth.session().refresh_token
      const {data:{user,session}} = await supabase.auth.refreshSession(refreshToken)

      // get access token from session and reset token
      getPaseto(session.access_token).then(res=>{
        setPlatformPaseto(res)
      })
    }
      if(isAuthenticated){
        // get current session
        // refresh token
        refreshUser()
      };
      
  }, [isAuthenticated])

  useEffect(() => {

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
    console.log('Context not used under its provider')
    throw new Error("Context is not being used under its provider");
  }

  return context;
};

export { useAuthContext, AuthContext, AuthContextProvider };
