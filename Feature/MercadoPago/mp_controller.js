
const PaymentService = require('../../Services/payment_service')
const PaymentController = require('./payment_repository')
const { response } = require('express')
const payment = new PaymentController( new PaymentService() )

const paymentLinkPost = (req, res = response) => {
    payment.getPaymentLink(req, res)
}

const subscriptionLinkPost = (req, res = response) => {
    payment.getSubscriptionLink(req, res)
}

const paymentMethodGet = (req, res = response) => {
    payment.getPaymentMethods(req, res)
}

module.exports = { paymentLinkPost, subscriptionLinkPost, paymentMethodGet }
