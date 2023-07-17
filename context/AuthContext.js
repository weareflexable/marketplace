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
  const router = useRouter();

  const [paseto, setPaseto] =useState(()=>{
    const storedPaseto = getStorage('PLATFORM_PASETO')
    if(storedPaseto){ 
        return storedPaseto
    }
    return ''
})


  const pasetoFromUrl = router.query.paseto 
  // console.log('urlpaseto',pasetoFromUrl)
  const isPaymentPending = router.query.payment === 'pending' ? true : false
  const isCheckingOut = router.query.checkout === 'pending' ? true : false

  // push user to payment if it's pending
  useEffect(() => {
    if(isPaymentPending){
      router.push('/payments')
    }
  }, [isPaymentPending])

  // push user to payment if it's pending
  useEffect(() => {
    if(isCheckingOut){
      router.push('/checkout')
    }
  }, [isPaymentPending])

  useEffect(()=>{
      if(paseto !== '' && paseto !== null){
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


    function logout(){
        setIsAuthenticated(false)
        // clear all caches
        localStorage.clear()
        router.replace('/')
        // redirect user to login page
    }



  const values = {
    isAuthenticated:isAuthenticated, 
    setIsAuthenticated,
    paseto,
    logout: logout,
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
