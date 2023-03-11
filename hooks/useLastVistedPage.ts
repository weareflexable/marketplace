import {useState} from 'react'
import { setStorage,deleteStorage } from '../utils/localStorage'
import useLocalStorage from './useLocalStorage';


export default function useLastVisitedPage(){

    const {state:lastVistitedPage, setState:setLastVisitedPage} = useLocalStorage('lastVisitedPage','/');
    
    return {lastVistitedPage, setLastVisitedPage }

}