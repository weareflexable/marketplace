import React,{createContext, useContext, useState} from 'react'
import { Service } from '../data/services';
import useLocalStorage from '../hooks/useLocalStorage';


const PaymentContext = createContext<ProviderValuesType|undefined>(undefined);

interface PaymentContextProviderProps{
    children: React.ReactNode
}

type ProviderValuesType = {
    stripePayload: {
        paymentIntentId: string,
        clientSecret: string,
        totalAmount: number
    },
    setPayload: (item:any) => void
}

const PaymentContextProvider = ({children}:PaymentContextProviderProps)=>{


    const {state, setState} = useLocalStorage('stripePayload',{})

    
    function setPayload(payload:any){
        setState(payload)
    }

    let values: ProviderValuesType = {
        stripePayload: state,
        setPayload: setPayload
    }
    return (
        <PaymentContext.Provider value={values}>
            {children}
        </PaymentContext.Provider>
    )
}


// This custom hook is in place to make sure that context
// gets called within its provider
function usePaymentContext(){
    const context = useContext(PaymentContext)

    if(context === undefined){
        console.log('Context not used under its provider')
        throw new Error('Please make sure component is wrapped around context provider')
    }

    return context
}

export {PaymentContextProvider, usePaymentContext}