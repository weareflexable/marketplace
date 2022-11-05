import React,{createContext, useContext, useState} from 'react'
import { Service } from '../data/services';


const InstantBuyContext = createContext<providerValuesType|undefined>(undefined);

interface InstantBuyContextProps{
    children: React.ReactNode
}

type providerValuesType = {
    buyItems: Array<any>,
    setBuyItems: ((items:any) =>void),
}

const InstantBuyContextProvider = ({children}:InstantBuyContextProps)=>{

    const [buyItem, setBuyItem] =  useState<any|null>([]);

    
    function setBuyItems(items:any){
        console.log(items)
        setBuyItem(items)
    }

    let values: providerValuesType = {
        buyItems: buyItem,
        setBuyItems: setBuyItems,
    }
    return (
        
        <InstantBuyContext.Provider value={values}>
            {children}
        </InstantBuyContext.Provider>
    )
}


// This custom hook is in place to make sure that context
// gets called within its provider
function useInstantBuyContext(){
    const context = useContext(InstantBuyContext)

    if(context === undefined){
        console.log('Context not used under its provider')
        // throw new Error('Please make sure component is wrapped around context provider')
    }

    return context
}

export {InstantBuyContextProvider, useInstantBuyContext}