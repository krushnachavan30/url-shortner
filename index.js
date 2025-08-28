const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/urlRoute");

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Routes
app.use("/", urlRoute);

// Connect MongoDB & Start Server
connectToMongoDB("mongodb://127.0.0.1:27017/url-shortener")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
