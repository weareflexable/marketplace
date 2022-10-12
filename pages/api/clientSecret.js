import Stripe from 'stripe'

const stripe = new Stripe('sk_test_51FOIbDJNxaKQ5MkMxf1vwI7VIyNfT8wPKuKUkVUXodxgtlhiE5chY0SOnc0rEpQFWxmH82HyMQ2h2Vu30PzJYBXx00z02yYXcD');

export default async function handler (req, res) {

    try{
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "USD",
      amount: 1999,
      automatic_payment_methods: { enabled: true },
    });
    return res.status(200).json({clientSecret: paymentIntent.client_secret})

  } catch (e) { 
    return res.status(400).send({
      error: {
        message: e.message,
      }
    });
  }
}
  