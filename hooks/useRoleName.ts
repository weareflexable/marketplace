import { useAuthContext } from "../context/AuthContext"
import useRole from "./useRole";

export default function useRoleName(){
    
    const {isAdmin,isEmployee,isManager,isUser,isSuperAdmin,isSupervisor} = useRole() 

    let roleName = isAdmin? 'admin': isEmployee?'employee': isManager? 'manager': isUser? 'user': isSuperAdmin? 'superadmin': isSupervisor? 'supervisor': ''

    return roleName

}