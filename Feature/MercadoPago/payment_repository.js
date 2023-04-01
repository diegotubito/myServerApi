class PaymentController {
    constructor(subcriptionService) {
        this.subcriptionService = subcriptionService
    }

    async getPaymentLink(req, res) {
        try {
            const payment = await this.subcriptionService.createPayment(req.body)
            return res.json(payment)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async getSubscriptionLink(req, res) {
        try {
            const subcription = await this.subcriptionService.createSubscription(req.body)
            return res.json(subcription)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async getPaymentMethods(req, res) {
        try {
            const paymentMethods = await this.subcriptionService.getPaymentMethods()
            return res.json(paymentMethods)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error.message
            })
        }
    }
}

module.exports = PaymentController