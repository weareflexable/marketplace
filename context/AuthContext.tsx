import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import React,{useState,useContext,createContext,useEffect, ReactNode} from 'react';
import { checkUser } from '../utils/auth';
import { getPaseto } from '../utils/platform/platform';
import { getPlatformPaseto, setPlatformPaseto } from '../utils/storage';
import supabase from '../utils/supabase';
import axios from 'axios'


const AuthContext = createContext<Values|undefined>(undefined);

type Values = {
    isAuthenticated: boolean,
    setIsAuthenticated: (isAuthenticate:boolean)=>void
    logout: ()=>void
}

interface AuthContextProviderProps{
    children: ReactNode
}

const AuthContextProvider = ({children}:AuthContextProviderProps)=>{

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const {asPath,push} = useRouter()

    // const router = useRouter();
  

    useEffect(() => {
      if (isAuthenticated && !getPlatformPaseto()) {
        // @ts-ignore
        getPaseto(supabase.auth.session().access_token).then(setPlatformPaseto);
      }
    }, [isAuthenticated]);
    
    
     
    useEffect(() => {
      // checks if user already signed in when they land
      const user = checkUser();
      if (user) {
        setIsAuthenticated(true);
      }
      
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          updateSupabaseCookie(event, session);
          if (event === "SIGNED_IN") {
            setIsAuthenticated(true);
             // @ts-ignore
            getPaseto(supabase.auth.session().access_token).then(res=>{
              setPlatformPaseto(res)
              push('/dashboard') 
            }); 
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
      }, [push]); // try removing deps
  
    async function updateSupabaseCookie(event: string, session: Session | null) {
      await axios.post("/api/auth", { event, session });
    }
  

    const logout = ()=>{
        setIsAuthenticated(false);
        localStorage.removeItem('paseto')
    }

    const values: Values = {
        isAuthenticated,
        setIsAuthenticated,
        logout
    }


    return(
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}


const useAuthContext = ()=>{
    const context = useContext(AuthContext);

    if(context === undefined){
        throw new Error('Context is not being used under its provider')
    }

    return context
}

export {useAuthContext, AuthContextProvider }