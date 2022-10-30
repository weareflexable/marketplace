import {useState} from 'react'
import { setStorage,deleteStorage } from '../utils/localStorage'


export default function useLastVisitedPage(){

    const [lastVistitedPage, setLastVisitedPage] = useState('');

    
    const setPage = (route:string)=>{
        setStorage('lasVisitedPage', route)
    } 

    const removePage =(route:string)=>{
        deleteStorage(route)
    }

    return {lastVistitedPage, }

}