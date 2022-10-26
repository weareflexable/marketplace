
export const setStorage = (key:string,value:string) =>{
    if(typeof window !== 'undefined'){
        localStorage.setItem(key,value)
    }
}