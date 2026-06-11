require("dotenv").config();
const express = require("express");
const passport = require("passport");
const path = require("path");
require("./middleware/auth.google")
const {mysql, myConnection, options} = require("./config/db");
const cors = require("cors");

const AllRoutes = require("./routes/app.routes");
const app = express();
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST","PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(myConnection(mysql, options, "single"));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", AllRoutes);
module.exports = app;