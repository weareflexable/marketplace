import {useState} from 'react'
import { useAuthContext } from '../../../../context/AuthContext'
import { useCheckoutContext } from '../../../../context/CheckoutContext'
import { useRouter } from 'next/router'
import { getStorage, setStorage } from '../../../../utils/localStorage'
import usePath from '../../../../hooks/usePath'
import useLocalStorage from '../../../../hooks/useLocalStorage'
import useLocalBuy from '../../../../hooks/useLocalBuy'
import { useInstantBuyContext } from '../../../../context/InstantBuyContext'
import dayjs from 'dayjs'
import useLastVisitedPage from '../../../../hooks/useLastVistedPage'

// TODO: Have a separate context for handling cart items

// This should accept a Service-item type in data
const useService = (data:any)=>{


    const {isAuthenticated} = useAuthContext()

    // Instant buy is the context that holds logic for when a user
    // clicks on the "buy now" button to expedite checkout process
    const {setBuyItems,setBuyNowTotal} = useInstantBuyContext()
    const {setLastVisitedPage} = useLastVisitedPage()
    const [isBuyingTicket, setIsBuyingTicket] = useState(false)

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
     const isTicketsAvailable = ticketData.ticketsAvailable > 0;
 
     // Determines whether or not tickets are sold out
    // const isTicketsSoldOut = 
 
   //   const ticketDate = isTicketsAvailable && moment(ticketData.tickets[0].date).format('MMM DD, YYYY');

 
     const isMinQuantity = ticketData.quantity <= 0
     const isMaxQuantity = ticketData.quantity === 6

     const subTotal =  ticketData.quantity * (ticketData.price/100)

 
     const proceedToPayment = ()=>{
        // Timeout in order to show loading state
        setIsProceedingToPayment(true)
        setTimeout(() => {
            setIsProceedingToPayment(false)
            router.push('/payments')
        }, 2000);
     }

     const loginBeforeAction = ()=>{
        // store users last page before starting logging process
        setLastVisitedPage(currentPath);
      
      location.href = process.env.NEXT_PUBLIC_AUTH+"/login?redirect_to=marketplace&payment=pending" // add another param to indicate payment is pending
      //   router.push('/landing')
     }

     const buyTicketNow = ()=>{

      setIsBuyingTicket(true)
      // console.log(ticketData)
        const buyNowCartItem = {
           serviceItemId: ticketData.id,
           quantity: String(ticketData.quantity),
           unitPrice: ticketData.price,
           email: 'flexable@yahoo.com',
           description:ticketData.name,
           targetDate: getStorage('selectedDate') || dayjs().format('MMM DD, YYYY') // TODO: Get current selected date
         }

         setBuyItems([buyNowCartItem]) // passes cart items to checkout context
         setBuyNowTotal(subTotal)

        if(isAuthenticated){

            setBuyItems([buyNowCartItem]) // passes cart items to checkout context
            setBuyNowTotal(subTotal)
            // This local storage value is used in payment page to determine if payment is buy now or cart
            setStorage('shouldBuyInstantly','true')
            proceedToPayment();
            setIsBuyingTicket(false)
            return
        }
        setIsBuyingTicket(false)
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
        isTicketsAvailable,
        // isTicketsSoldOut, 
        isMinQuantity,
      //   ticketDate,
        isBuyingTicket,
        isMaxQuantity,
        subTotal,
        isAuthenticated,
        isProceedingToPayment,
        incrementQuantity,
        decrementQuantity,
        buyTicketNow
     }
 
}

export default useService