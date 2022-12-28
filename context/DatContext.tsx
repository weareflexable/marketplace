import React,{createContext, useContext, useState} from 'react'
import { Service } from '../data/services';
import useLocalStorage from '../hooks/useLocalStorage';


const DatContext = createContext<providerValuesType|undefined>(undefined);

interface DatContextProviderProps{
    children: React.ReactNode
}

type providerValuesType = {
    currentDat: any, // set it to type DAT(digital access token) later
    setDat: (item:any)=>void,
}

const DatContextProvider = ({children}:DatContextProviderProps)=>{


    const {state, setState} = useLocalStorage('currentDat','')

    
    function setDat(item:any){
        setState(item)
    }

    let values: providerValuesType = {
        currentDat: state,
        setDat: setDat,
    }
    return (
        <DatContext.Provider value={values}>
            {children}
        </DatContext.Provider>
    )
}


// This custom hook is in place to make sure that context
// gets called within its provider
function useDatContext(){
    const context = useContext(DatContext)

    if(context === undefined){
        console.log('Context not used under its provider')
        throw new Error('Please make sure component is wrapped around context provider')
    }

    return context
}

export {DatContextProvider, useDatContext}