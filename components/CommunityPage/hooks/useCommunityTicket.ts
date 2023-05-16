import {useState} from 'react'
import { useAuthContext } from '../../../context/AuthContext'
import { useCheckoutContext } from '../../../context/CheckoutContext'
import { useRouter } from 'next/router'
import { getStorage, setStorage } from '../../../utils/localStorage'
import usePath from '../../../hooks/usePath'
import useLocalStorage from '../../../hooks/useLocalStorage'
import useLocalBuy from '../../../hooks/useLocalBuy'
import { useInstantBuyContext } from '../../../context/InstantBuyContext'
import dayjs from 'dayjs'
import useLastVisitedPage from '../../../hooks/useLastVistedPage'
import axios from 'axios'
import { usePaymentContext } from '../../../context/PaymentContext'

// TODO: Have a separate context for handling cart items

// This should accept a Service-item type in data
const useCommunityTicket = (data:any)=>{

    
    


    const {isAuthenticated, paseto} = useAuthContext()

    // Instant buy is the context that holds logic for when a user
    // clicks on the "buy now" button to expedite checkout process
    const {setBuyItems,setBuyNowTotal} = useInstantBuyContext()
    const {setPayload} = usePaymentContext()

    const router = useRouter()
    const {currentPath} = usePath()

       
       
   // Each ticket will maintain it's own state from props because
   // properties in ticket object undergo changes with the ticket component
     const [ticketData, setTicketData] = useState({
      ...data,
       quantity:0
     })


     const [isProceedingToPayment, setIsProceedingToPayment] = useState(false)
 
 
     // checks to see if there are available tickets for selected date
     const maxPurchasableTickets =  6
 
 
   //   const ticketDate = isTicketsAvailable && moment(ticketData.tickets[0].date).format('MMM DD, YYYY');

 
     const isMinQuantity = ticketData.quantity <= 0
     const isMaxQuantity = ticketData.quantity === maxPurchasableTickets

     const subTotal =  ticketData.quantity * (data && data.price /100)

     async function fetchSecret(payload:any) {
      try{
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/payment-intents/buy-now`,payload,{
        headers:{
          'Authorization': paseto
        }
      });
  
      return res;

    }catch(err){
      console.log(err)
      // show error message
      return err
    }
    }

 
     const proceedToPayment = ()=>{
        // Timeout in order to show loading state
      
        setTimeout(() => {
            setIsProceedingToPayment(false)
            router.push('/payments')
        }, 2000);
     }

     const loginBeforeAction = ()=>{
        // store users last page before starting logging process
        localStorage.setItem('lastVisitedPage',currentPath);
      
      location.href = process.env.NEXT_PUBLIC_AUTH+"/login?redirect_to=marketplace&payment=pending" // add another param to indicate payment is pending
      //   router.push('/landing')
     }


     const buyTicketNow = async()=>{

        console.log(ticketData)

        const buyNowCartItem = {
            item:{
                id: data.id,
                type: "community"
            },
           quantity: String(ticketData.quantity),
           unitPrice: data.price,
           email: 'flexable@yahoo.com',
           description:data.name,
           targetDate: getStorage('selectedDate') || dayjs().format('MMM DD, YYYY') // TODO: Get current selected date
         }


         setBuyItems([buyNowCartItem]) // passes cart items to checkout context
         setBuyNowTotal(subTotal)

        if(isAuthenticated){

            setBuyItems([buyNowCartItem]) // passes cart items to checkout context
            setBuyNowTotal(subTotal)
            // This local storage value is used in payment page to determine if payment is buy now or cart
            setStorage('shouldBuyInstantly','true') // rename to checkoutType: buyNow || cart


            try{
              setIsProceedingToPayment(true)
              // make request to fetch client secret, paymentIntentId
              const res:any = await fetchSecret(buyNowCartItem)
              if(res.status == 200){
                const stripePayload = {
                  clientSecret: res.data.clientSecret,
                  paymentIntentId: res.data.payment_intent_id,
                  totalAmount: subTotal
                }

                // set stripePayload to payment context
                setPayload(stripePayload)
                console.log(stripePayload)
                // proceed with payment
              }
              setIsProceedingToPayment(false)
              console.log(res)
            }catch(err){
              setIsProceedingToPayment(false)
              console.log('Error while while fetching client secret')
            }
            // if secret is available then set it to payment context
            // navigate to payment page
            // else show error toast message
            // proceedToPayment();

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
        // isTicketsSoldOut, 
        isMinQuantity,
      //   ticketDate,
        isMaxQuantity,
        subTotal,
        isAuthenticated,
        isProceedingToPayment,
        incrementQuantity,
        decrementQuantity,
        buyTicketNow
     }
 
}

export default useCommunityTicket