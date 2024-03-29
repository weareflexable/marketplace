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


    const [totalAmount,setTotalAmount]  = useState<number>(0);
    const [cartItems, setCartItems] =  useState<any|null>([]);

    function setAmount(amount:number){
        setTotalAmount(amount);
        localStorage.setItem('amount',JSON.stringify(amount))
    }
    
    function setCart(items:any){
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
        console.log('Context not used under its provider')
        throw new Error('Please make sure component is wrapped around context provider')
    }

    return context
}

export {CheckoutContextProvider, useCheckoutContext}