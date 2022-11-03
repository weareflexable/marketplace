import {useState} from 'react'
import moment from 'moment-timezone'
import { useAuthContext } from '../../../../context/AuthContext'
import { useCheckoutContext } from '../../../../context/CheckoutContext'
import { useRouter } from 'next/router'
import { setStorage } from '../../../../utils/localStorage'
import usePath from '../../../../hooks/usePath'

const useTicket = (data:any)=>{

    const {isAuthenticated} = useAuthContext()
    const {setAmount,setCart} = useCheckoutContext()
    const router = useRouter()
    const {currentPath} = usePath()

      // Each ticket will maintain it's own state from props
      const [ticketData, setTicketData] = useState(()=>{
        return{
         ...data&&data,
         quantity:0
        } 
     })
     const [isProceedingToPayment, setIsProceedingToPayment] = useState(false)
 
 
     // checks to see if there are available tickets for selected date
     const isTicketsAvailable = ticketData.tickets.length>0;
 
     // Determines whether or not tickets are sold out
     const isTicketsSoldOut = isTicketsAvailable && ticketData.tickets[0].ticketsAvailable<1
 
     const ticketDate = isTicketsAvailable && moment(ticketData.tickets[0].date).tz('America/New_York').add(5,'hours').format('MMM D, YYYY');
 
     const isMinQuantity = ticketData.quantity <= 0

     const subTotal =  ticketData.quantity * (ticketData.price/100)
 
     const proceedToPayment = ()=>{

        // Timeout in order to show loading state
        setIsProceedingToPayment(true)
        setTimeout(() => {
            setIsProceedingToPayment(false)
            router.push('/payments')
        }, 3000);
     }

     const loginBeforeAction = ()=>{
        // store users last page before starting logging process
        setStorage('lastVisitedPage',currentPath);
        router.push('/landing')
     }

     const buyTicketNow = ()=>{
        if(isAuthenticated){
            setAmount(subTotal) // passes total amount to checkout context
            setCart([ticketData]) // passes cart items to checkout context

            // goto payment page is authenticated
            proceedToPayment();
        }
        loginBeforeAction();

     }
 
     const incrementQuantity =()=>{
         const updatedTicket = { ...ticketData }
         updatedTicket.quantity++
         setTicketData(updatedTicket)
 
     }
     const decrementQuantity =()=>{
         const updatedTicket = { ...ticketData }
         updatedTicket.quantity--
         setTicketData(updatedTicket)
     }

     return {
        ticketData,
        isTicketsAvailable,
        isTicketsSoldOut,
        isMinQuantity,
        ticketDate,
        subTotal,
        isAuthenticated,
        isProceedingToPayment,
        incrementQuantity,
        decrementQuantity,
        buyTicketNow
     }
 
}

export default useTicket