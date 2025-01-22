async function getFolder (req, res) {
    const folderId = req.params.id;
    
    res.render("folder")
}


module.exports = { getFolder } 