const express = require("express");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes")

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://ai-recruitment-frontend-five.vercel.app/"
        ]
    })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users",userRoutes);
app.use("/api/saved-jobs", savedJobRoutes)

app.get("/",(req,res) => {
    res.send("API is running");
});

module.exports = app;