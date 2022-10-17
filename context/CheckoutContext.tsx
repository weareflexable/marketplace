import React,{createContext, useContext, useState} from 'react'
import { Service } from '../data/services';


const CheckoutContext = createContext<providerValuesType|undefined>(undefined);

interface CheckoutContextProviderProps{
    children: React.ReactNode
}

type providerValuesType = {
    totalAmount: number,
    cartItems: Array<any>,
    setCart: (items:Service[])=>void,
    setAmount: (amount:number)=>void
}

const CheckoutContextProvider = ({children}:CheckoutContextProviderProps)=>{

    const [totalAmount,setTotalAmount]  = useState(0);
    const [cartItems, setCartItems] =  useState<Array<Service>>([]);

    function setAmount(amount:number){
        setTotalAmount(amount);
    }

    function setCart(items:Service[]){
        setCartItems(items)
    }

    let values: providerValuesType = {
        totalAmount: totalAmount ,
        cartItems: cartItems,
        setCart: setCart,
        setAmount: setAmount
    }
    return (
        <CheckoutContext.Provider value={values}>
            {children}
        </CheckoutContext.Provider>
    )
}


// This custom hook is in place to make sure that context
// gets called within its provider
function useCheckoutContext(){
    const context = useContext(CheckoutContext)

    if(context === undefined){
        throw new Error('Please make sure component is wrapped around context provider')
    }

    return context
}

export {CheckoutContextProvider, useCheckoutContext}