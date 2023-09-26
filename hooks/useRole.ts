import { useAuthContext } from "../context/AuthContext"

export default function useRole(){
    
    const {currentUser} = useAuthContext() 

    // @ts-ignore
    const isSuperAdmin  = currentUser?.role == 0;
    // @ts-ignore
    const isManager = currentUser?.role == 1;
    // @ts-ignore
    const isAdmin = currentUser?.role == 2;
    // @ts-ignore
    const isSupervisor =currentUser?.role == 3;
    // @ts-ignore
    const isEmployee = currentUser.role == 4;
    // @ts-ignore
    const isUser = currentUser.role == 5;

    return {isAdmin, isManager, isSupervisor, isEmployee, isUser, isSuperAdmin}
    // return {currentUser}
}