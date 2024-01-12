// utils/paymentGateway.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const processPayment = async (amount, currency, source) => {
  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: source,
      confirmation_method: 'manual',
      confirm: true
    })

    // If the payment requires action, handle it
    if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_source_action') {
      // Handle the action here, e.g., redirecting the customer to the next step
      // You may need to send the client secret to your frontend
      return { requiresAction: true, clientSecret: paymentIntent.client_secret }
    } else if (paymentIntent.status === 'succeeded') {
      // Payment succeeded
      return { success: true }
    } else {
      // Payment failed
      return { error: 'Payment failed' }
    }
  } catch (error) {
    console.error('Error processing payment:', error.message)
    return { error: error.message }
  }
}

module.exports = { processPayment }
