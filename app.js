require('dotenv').config();
require('./config/passport');
const express = require("express");
const path = require("node:path");
const passport = require("passport");
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const indexRouter = require("./routes/indexRouter");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(
    expressSession({
      cookie: {
       maxAge: 7 * 24 * 60 * 60 * 1000 // ms
      },
      secret: `${process.env.SECRET_KEY}`,
      resave: true,
      saveUninitialized: true,
      store: new PrismaSessionStore(
        new PrismaClient(),
        {
          checkPeriod: 2 * 60 * 1000,  //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
    })
  );

app.use(passport.initialize()); 
app.use(passport.session()); 

app.use("/", indexRouter);

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Your App is running on Port ${PORT} Successfully`);
})