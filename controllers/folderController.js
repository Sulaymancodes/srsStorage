const cloudinary = require("../config/cloudinary");
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

  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `uploads/${folderId}`, // Organize files by folder ID
      resource_type: "auto",         // Automatically detect file type (image, video, etc.)
    });

    // Delete the temporary file from the server
    fs.unlinkSync(req.file.path);

    // Add the file to the database
    await prisma.file.create({
      data: {
        name: fileName,
        path: result.secure_url, // Store the Cloudinary URL
        size: result.bytes,      // File size in bytes
        folderId: parseInt(folderId),
      },
    });

    // Fetch the folder details
    const folder = await prisma.folder.findUnique({
      where: { id: Number(folderId) },
    });

    if (!folder) {
      return res.status(404).send("Folder not found");
    }

    // Fetch the updated file list
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

    
    res.render("folder", {
      username: req.user.username,
      folderName: folder.name, 
      folderId,
      files,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file");
  }
}

async function deleteFile(req, res) {
  const fileId = parseInt(req.params.id);

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).send("File not found");
    }

    const publicId = file.path.split("/").slice(-2).join("/").split(".")[0];

    await cloudinary.uploader.destroy(publicId);

    await prisma.file.delete({
      where: { id: fileId },
    });

    res.redirect(`/${req.query.folderId}/folder`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting file");
  }
}

async function downloadFile(req, res)  {
  const fileId = parseInt(req.params.id);

  try {
      // Fetch the file details from the database
      const file = await prisma.file.findUnique({
          where: { id: fileId },
      });

      if (!file) {
          return res.status(404).send("File not found");
      }

      // Redirect to the Cloudinary URL
      res.redirect(file.path);
  } catch (err) {
      console.error(err);
      res.status(500).send("Error downloading file");
  }
};

module.exports = { getFolder, uploadFile, deleteFile, downloadFile };
