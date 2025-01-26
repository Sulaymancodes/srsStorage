const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


async function getFolder(req, res) {
  if (req.isAuthenticated()) {
      const folderId = req.params.id;
      const userId = req.user.id;

      try {
          const user = await prisma.user.findUnique({
              where: {
                  id: userId,
              },
          });

          const folder = await prisma.folder.findUnique({
              where: {
                  id: Number(folderId),
              },
          });

          const files = await prisma.file.findMany({
              where: {
                  folderId: Number(folderId),
              },
          });

          const folderName = folder.name;
          const username = user.username;

          res.render("folder", { username, folderName, folderId, files });
      } catch (err) {
          console.error(err);
          res.status(500).send("Error retrieving folder or files");
      }
  } else {
      res.send("You are not authenticated to visit this page");
  }
}

async function uploadFile (req, res) {
    const { folderId, fileName } = req.body;
    const filePath = req.file.path;

    try {
      await prisma.file.create({
        data: {
          name: fileName,
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

module.exports = { getFolder, uploadFile } 