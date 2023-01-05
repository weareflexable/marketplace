// import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import React, {
  useState,
  useContext,
  createContext,
  useEffect,
} from "react";

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
  const {path, basePath, push, query } = useRouter();

  const [paseto, setPaseto] =useState(()=>{
    const storedPaseto = getStorage('PLATFORM_PASETO')
    if(storedPaseto){ 
        return storedPaseto
    }
    return ''
})


  const pasetoFromUrl = query.paseto 
  // console.log('urlpaseto',pasetoFromUrl)

  useEffect(()=>{
      if(paseto !== '' && paseto !== null){
          console.log('should authenticte')
          setIsAuthenticated(true)
      }
  },[paseto])

  useEffect(() => {
    // set state if url paseto exist
    if(pasetoFromUrl){
        // set ui and local storage
        setPaseto(pasetoFromUrl) 

        setStorage('PLATFORM_PASETO',pasetoFromUrl)
        setIsAuthenticated(true)
    }
    // check
//   console.log(pasetoFromUrl)
}, [pasetoFromUrl])


    const logout = () =>{
        setIsAuthenticated(false)
        // clear all caches
        localStorage.clear()
        // redirect user to login page
    }



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
