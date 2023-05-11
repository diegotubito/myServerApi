function deleteTimer(req, id) {
    const timer = req.app.timers[id]
    if (timer) {
        clearTimeout(req.app.timers[id]);
        delete req.app.timers[id]
        console.log('timers', req.app.timers)
    }
}

module.exports = { deleteTimer }