const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getFolder (req, res) {
    if(req.isAuthenticated()) {
        const folderId = req.params.id;
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        })
        const folder = await prisma.folder.findUnique({
            where: {
                id: Number(folderId)
            }
        });
        const folderName = folder.name;
        const username = user.username;

        res.render("folder", {username, folderName});
    } else {
        res.send("you are not authenticated to visit this page");
    }
  
}


module.exports = { getFolder } 