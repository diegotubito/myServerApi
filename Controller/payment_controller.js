class PaymentController {
    constructor(subcriptionService) {
        this.subcriptionService = subcriptionService
    }

    async getPaymentLink(req, res) {
        try {
            const payment = await this.subcriptionService.createPayment()
            return res.json(payment)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: true,
                msg: "Failed to create payment"
            })
        }
    }

    async getSubscriptionLink(req, res) {
        try {
            const subcription = await this.subcriptionService.createSubscription()
            return res.json(subcription)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: true,
                msg: "Failed to create subscription"
            })
        }
    }
}

module.exports = PaymentController