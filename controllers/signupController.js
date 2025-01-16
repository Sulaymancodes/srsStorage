const { body, validationResult} = require('express-validator');
const bcryptjs = require('bcryptjs');
const CustomNotFoundError = require('../errors/CustomNotFoundError');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const validatePassword = [
    body("password")
    .notEmpty().withMessage("Password Cannot be empty")
    .isLength({min: 6}).withMessage("Password must be at least 6 characters"),
    body("confirm-password").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error ("Passwords Do Not Match");
        }
        return true;
      }),
]

function getSignup (req, res) {
    res.render("signup")
}

const createUser = [
    validatePassword,
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render("sign-up", {errors: errors.array()});
        }
        const { firstName, lastName, username, password } = req.body;
        bcryptjs.hash(password, 10, async (errors, hashedPassword) => {
            try {
                await prisma.user.create({
                    data:{
                        firstName: `${firstName}`,
                        lastName: `${lastName}`,
                        username: `${username}`,
                        password: `${hashedPassword}`
                    }
                });
                res.redirect("/log-in")
            } catch (err) {
                throw new CustomNotFoundError(err);
            }
        })
    }
]
module.exports = { getSignup, createUser } 