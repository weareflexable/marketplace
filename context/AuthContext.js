// import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import React, {
  useState,
  useContext,
  createContext,
  useEffect,
} from "react";

import { deleteStorage, getStorage, setStorage } from "../utils/localStorage";
import axios from 'axios'
import dayjs from "dayjs";




// const PUBLIC_KEY = '1eb9dbbbbc047c03fd70604e0071f0987e16b28b757225c11f00415d0e20b1a2'

const AuthContext = createContext(undefined);

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


  function logout(){
    setIsAuthenticated(false)
    // clear all caches
    localStorage.clear()
    router.replace('/')
    // redirect user to login page
}



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
  }, [isCheckingOut])

  useEffect(()=>{
      if(paseto !== '' && paseto !== null){
          setIsAuthenticated(true)
      }
  },[paseto])


  useEffect(()=>{

    async function decodePaseto(){
      const paseto = localStorage.getItem('PLATFORM_PASETO')
      const tokenExpiry = localStorage.getItem('tokenExpiry')

      if(!paseto) return

      // if token already exist just check storage without having to call API
      if(tokenExpiry){
        const isExpired = dayjs().isAfter(tokenExpiry)
        if(isExpired){
          logout()
        }
        return
      }


      try{

        const res =  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/decodePaseto`, {token: paseto },
        {
          headers:{
          'Authorization': paseto
          }
        }
        )

        if(res.status < 201){
          const expiryDate = res.data.data.exp
          localStorage.setItem('tokenExpiry',expiryDate)
          const isExpired = dayjs().isAfter(expiryDate)
          if(isExpired){
            logout()
          }
        }

      }catch(err){

        console.log(err)

      }
    


      
      
    }
    decodePaseto()
},[router])

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
