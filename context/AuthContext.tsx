import { useRouter } from 'next/router';
import React,{useState,useContext,createContext,useEffect, ReactNode} from 'react';


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
    const {asPath} = useRouter()


    useEffect(() => {
        const paseto = localStorage.getItem('paseto')
        if(paseto !== undefined){
            setIsAuthenticated(true)
        }
    }, [])

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