const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const connection = require("./db/config");

const app = express();
connection();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "/public")));

app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, ".", "views", "index.html"));
});
app.use("/api/user", require("./routes/user"));
app.use("/api/follow", require("./routes/follow"));
app.use("/api/post", require("./routes/post"));

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
