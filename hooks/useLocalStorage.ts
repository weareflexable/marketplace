import {useState,useEffect} from 'react'
import { getStorage, setStorage } from '../utils/localStorage';

// create type for cart items

type Value = Array<any>

const useLocalStorage = (defaultValue:Value)=>{
    const [state, setState] = useState<Value>(()=>{
        // check in local to see if it exist
        const valueFromStorage = getStorage('cart')

        const valueExist = valueFromStorage === null || valueFromStorage === undefined ? false : true
            if(valueExist){
                const parsedValueFromStrorage = JSON.parse(valueFromStorage || '')
                return parsedValueFromStrorage;
            }
            return defaultValue  
    })

    useEffect(() => {
    // whenever state changes, update localstorage
    const stringifiedValue = JSON.stringify(state)
    // localStorage.setItem('cart', stringifiedValue)
    setStorage('cart', stringifiedValue)

    }, [state])

    return {state, setState}

}

export default useLocalStorage