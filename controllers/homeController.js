const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");

async function getHome(req, res) {
    if (req.isAuthenticated()) {
        const userId = req.user.id;
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
            })
            const folders = await prisma.folder.findMany({
              where: { userId: userId },
            });
            res.render("home", { username: `${user.username}`, folders });
          } catch (err) {
            console.error(err);
            res.status(500).send("Error loading homepage");
        }
    } else {
        res.send("You are not authenticated to view this path")
    }
}

function logOutUser (req, res) {
    req.logout((err) => {
        if (err) {
            return nextDay(err)
        } 
        res.redirect("/log-in")
    })
}

async function createFolder (req, res) {
    const userId = req.user.id;
    const { folderName } = req.body;

    try {
        const newFolder = await prisma.folder.create({
            data: {
                name: folderName,
                userId
            }
        })
        const folderPath = path.join(__dirname, "../uploads", String(newFolder.id));
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })
        const folders = await prisma.folder.findMany({
          where: { userId: userId },
        });
        res.render("home", { username: `${user.username}`, folders });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating folder");
    } 
}

async function updateFolder(req, res) {
    const { newName } = req.body;
    const folderId = parseInt(req.params.id);

    try {
        await prisma.folder.update({
            where: { id: folderId },
            data: { name: newName },
        });
        res.redirect("/home");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating folder");
    }
}

async function deleteFolder(req, res) {
    const folderId = parseInt(req.params.id);

    try {
        // Delete folder from database
        await prisma.folder.delete({
            where: { id: folderId },
        });

        // Delete folder directory from filesystem
        const folderPath = path.join(__dirname, "../uploads", String(folderId));
        if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true, force: true });
        }

        res.redirect("/home");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting folder");
    }
}

module.exports = { getHome, logOutUser, createFolder, updateFolder, deleteFolder }