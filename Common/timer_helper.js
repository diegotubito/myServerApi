function deleteTimer(req, id) {
    const timer = req.app.timers[id]
    if (timer) {
        clearTimeout(req.app.timers[id]);
        console.log('removing', req.app.timers)
        delete req.app.timers[id]
        console.log('after', req.app.timers)
    }
}

module.exports = { deleteTimer }