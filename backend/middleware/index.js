function checkAuth(req, res, next) {
    if (req.session.userID) {
        return next
    }
    res.redirect('/login')
}

module.exports = { checkAuth }