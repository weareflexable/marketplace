import {useState} from 'react'
import moment from 'moment-timezone'
import { useAuthContext } from '../../../../context/AuthContext'
import { useCheckoutContext } from '../../../../context/CheckoutContext'
import { useRouter } from 'next/router'
import { getStorage, setStorage } from '../../../../utils/localStorage'
import usePath from '../../../../hooks/usePath'
import useLocalStorage from '../../../../hooks/useLocalStorage'
import useLocalBuy from '../../../../hooks/useLocalBuy'
import { useInstantBuyContext } from '../../../../context/InstantBuyContext'

// This should accept a Service-item type in data
const useService = (data:any)=>{


    const {isAuthenticated} = useAuthContext()

    // Instant buy is the contentx that holds logic for when a user
    // clicks on the "buy now" button to expedite checkout process
    const {setBuyItems,setBuyNowTotal} = useInstantBuyContext()

    const router = useRouter()
    const {currentPath} = usePath()

    //    const {state:ticketData, setState:setTicketData} = useLocalBuy({
       //       ...data&&data,
       //       quantity:0
       //   })
       
       
   // Each ticket will maintain it's own state from props because
   // properties in ticket object undergo changes with the ticket component
     const [ticketData, setTicketData] = useState({
      ...data,
       quantity:0
     })
   //   setStorage('instantBuy',JSON.stringify(ticketData))

     const [isProceedingToPayment, setIsProceedingToPayment] = useState(false)
 
 
     // checks to see if there are available tickets for selected date
   //   const isTicketsAvailable = ticketData.tickets.length>0;
 
     // Determines whether or not tickets are sold out
   //   const isTicketsSoldOut = isTicketsAvailable && ticketData.tickets[0].ticketsAvailable<1
 
   //   const ticketDate = isTicketsAvailable && moment(ticketData.tickets[0].date).format('MMM DD, YYYY');

 
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
      //   location.href = `${process.env.NEXT_PUBLIC_AUTH}/login?redirect_to=marketplace`
      location.href = process.env.NEXT_PUBLIC_AUTH+"/login?redirect_to=marketplace"
      //   router.push('/landing')
     }

     const buyTicketNow = ()=>{

      console.log(ticketData)
        const buyNowCartItem = {
           serviceItemId: ticketData.id,
           quantity: String(ticketData.quantity),
           unitPrice: String(ticketData.price),
           email: 'mujahid.bappai@yahoo.com',
           description:'flexable line-skip',
           targetDate: getStorage('selectedDate') // TODO: Get current selected date
         //   date: ticketData.tickets[0].date
         }

        if(isAuthenticated){

            setBuyItems([buyNowCartItem]) // passes cart items to checkout context
            setBuyNowTotal(subTotal)
            setStorage('shouldBuyInstantly','true')
            proceedToPayment();
            return
        }
        loginBeforeAction();
     }
 
     const incrementQuantity =()=>{
         const updatedTicket = {...ticketData }
         updatedTicket.quantity++
         setTicketData(updatedTicket)

        }

     const decrementQuantity =()=>{
         const updatedTicket = {...ticketData }
         updatedTicket.quantity--
         setTicketData(updatedTicket)
     }

     return {
        ticketData,
      //   isTicketsAvailable,
      //   isTicketsSoldOut, 
        isMinQuantity,
      //   ticketDate,
        subTotal,
        isAuthenticated,
        isProceedingToPayment,
        incrementQuantity,
        decrementQuantity,
        buyTicketNow
     }
 
}

export default useService