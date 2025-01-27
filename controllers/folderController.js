const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

async function getFolder(req, res) {
  if (req.isAuthenticated()) {
    const folderId = req.params.id;
    const userId = req.user.id;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      const folder = await prisma.folder.findUnique({
        where: { id: Number(folderId) },
      });

      const files = await prisma.file.findMany({
        where: { folderId: Number(folderId) },
        select: {
          id: true,
          name: true,
          path: true,
          size: true,
          uploadedAt: true,
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

async function uploadFile(req, res) {
  const userId = req.user.id;
  const { folderId, fileName } = req.body;
  const filePath = `uploads/${req.body.folderId}/${req.file.filename}`;
  const fileSize = req.file.size; // File size in bytes

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const folder = await prisma.folder.findUnique({
      where: { id: Number(folderId) },
    });

    const folderName = folder.name;
    const username = user.username;

    // Add the new file to the database
    await prisma.file.create({
      data: {
        name: fileName,
        path: filePath,
        size: fileSize,
        folderId: parseInt(folderId),
      },
    });

    // Fetch the updated file list after the new file has been added
    const files = await prisma.file.findMany({
      where: { folderId: Number(folderId) },
      select: {
        name: true,
        path: true,
        size: true,
        uploadedAt: true,
      },
    });

    // Re-render the folder page with the updated files
    res.render("folder", { username, folderName, folderId, files });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file");
  }
}

async function deleteFile(req, res) {
  const fileId = parseInt(req.params.id);
  const folderId = req.query.folderId; 

  try {
      
      const file = await prisma.file.findUnique({
          where: { id: fileId },
      });

      if (!file) {
          return res.status(404).send("File not found");
      }

      const filePath = path.join(__dirname, "../uploads", file.path);
      if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
      }

      await prisma.file.delete({
          where: { id: fileId },
      });

      
      res.redirect(`/${folderId}/folder`);
  } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting file");
  }
}

module.exports = { getFolder, uploadFile, deleteFile };
