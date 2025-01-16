const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getHome(req, res) {
    if (req.isAuthenticated()) {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })
        console.log(userId)
        res.render("home", {username: `${user.username}`});
    } else {
        res.send("You are not authenticated");
    }
}

module.exports = { getHome }