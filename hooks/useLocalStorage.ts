import {useState,useEffect} from 'react'
import { getStorage, setStorage } from '../utils/localStorage';

// create type for cart items

// type Value = Array<any>

const useLocalStorage = (key:string, defaultValue:any)=>{
    const [state, setState] = useState(()=>{
        // check in local to see if it exist
        const valueFromStorage = getStorage(key)

        const valueExist = valueFromStorage === null || valueFromStorage === undefined ? false : true
            if(valueExist){
                console.log('date',valueFromStorage)
                const parsedValueFromStrorage = JSON.parse(valueFromStorage || '')
                return parsedValueFromStrorage;
            }
            return defaultValue  
    })

    useEffect(() => {
    // whenever state changes, update localstorage
    const stringifiedValue = JSON.stringify(state)
    // localStorage.setItem('cart', stringifiedValue)
    setStorage(key, stringifiedValue)

    }, [key, state])

    return {state, setState}

}

export default useLocalStorage