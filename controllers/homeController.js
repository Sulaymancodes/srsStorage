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

        res.status(201).send("Folder created successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating folder");
    } 
}

async function uploadFile (req, res) {
    const { folderId } = req.body;
    const filePath = req.file.path;

    try {
      await prisma.file.create({
        data: {
          name: req.file.filename,
          path: filePath,
          folderId: parseInt(folderId),
        },
      });
      res.status(201).send("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error uploading file");
    }
}

module.exports = { getHome, logOutUser, createFolder, uploadFile }