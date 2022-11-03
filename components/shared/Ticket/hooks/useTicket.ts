import {useState} from 'react'
import moment from 'moment-timezone'
import { useAuthContext } from '../../../../context/AuthContext'
import { useCheckoutContext } from '../../../../context/CheckoutContext'

const useTicket = (data:any)=>{

    const {isAuthenticated} = useAuthContext()
    const {setAmount,setCart} = useCheckoutContext()

      // Each ticket will maintain it's own state from props
      const [ticketData, setTicketData] = useState(()=>{
        return{
         ...data&&data,
         quantity:0
        } 
     }
     )
 
 
     // checks to see if there are available tickets for selected date
     const isTicketsAvailable = ticketData.tickets.length>0;
 
     // Determines whether or not tickets are sold out
     const isTicketsSoldOut = isTicketsAvailable && ticketData.tickets[0].ticketsAvailable<1
 
     const ticketDate = isTicketsAvailable && moment(ticketData.tickets[0].date).tz('America/New_York').add(5,'hours').format('MMM D, YYYY');
 
     const isMinQuantity = ticketData.quantity <= 0

     const subTotal =  ticketData.quantity * (ticketData.price/100)
 

     const buyTicketNow = ()=>{
        
        if(isAuthenticated){

        }
        // if user is authenticated; set amount and cart in checkoutContext -> then goto payment
        // else; set amount and cart in checkoutContext -> then go to payment
         console.log(ticketData)
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
        incrementQuantity,
        decrementQuantity,
        buyTicketNow
     }
 
}

export default useTicket