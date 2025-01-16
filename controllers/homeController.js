function getHome(req, res) {
    if (req.isAuthenticated()) {
        res.render("home");
    } else {
        res.send("You are not authenticated");
    }
}

module.exports = { getHome }