import {useState} from 'react'
import { setStorage,deleteStorage } from '../utils/localStorage'
import useLocalStorage from './useLocalStorage';


export default function useLastVisitedPage(){

    const {state:lastVistitedPage, setState:setLastVisitedPage} = useLocalStorage('lastVisitedPage','');

    
    const setPage = (route:string)=>{
        setStorage('lastVisitedPage', route)
    } 

    const removePage =(route:string)=>{
        deleteStorage(route)
    }

    return {lastVistitedPage, setLastVisitedPage }

}