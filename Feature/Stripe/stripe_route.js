const stripe = require("stripe")('sk_test_51LaSYLHjZtIKTjwQIwaRFwjltZTeLLklXpSpxZcUZ8FoXgPNR0W278u89tKexKto0mkklu4KxBv6xCUwPmyh3jmD00Kd89PYr8');
const {Router} = require('express')
const router = Router()

const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
};


router.post("/create_payment_intent", async (req, res) => {
        const { items } = req.body;
    
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
        });
    
        res.json({
            clientSecret: paymentIntent.client_secret,
        });
});

module.exports = router