const express = require("express");
const path = require("path");

const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

const authRouter = require("./auth");
const sessionRouter = require("./session");

require("dotenv").config();

const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
}

const strat = new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL || "http://localhost:3000/callback"
},
(accessToken, refreshToken, extraParams, profile, done) => {
  return done(null, profile);
})

const app   = express();
const port  = process.env.PORT || "8000";
const db    = require("./db")();

app.use(expressSession(session))
passport.use(strat);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
})

app.use((req, res, next) => {
  req.db = db;
  next();
})

app.use('/', authRouter)
app.use('/session', sessionRouter)

/**
 * Routes Definitions
 */

const secured = (req, res ,next) => {
  if (req.user) {
    return next()
  }

  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
}



app.get("/", (req, res) => {
  res.status(200).send(`
    <h1>Tawa</h1>
    <a href="https://github.com/KokopelliMusic/Tawa">Github</a>
  `);
});

// app.get("/user", secured, (req, res) => {
  // res.render("user", { title: "Profile", userProfile: { nickname: "Auth0" } });
// });

if (app.get("env") === "production") {
  app.set("trust proxy", 1) // trust first proxy
  session.cookie.secure = true // serve secure cookies
}

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});