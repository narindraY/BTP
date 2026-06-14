const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const contratRoutes = require("./routes/contratRoutes");
const rapportRoutes = require("./routes/rapportRoutes");
const suiviRoutes = require("./routes/suiviRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/contrats", contratRoutes);
app.use("/api/rapports", rapportRoutes);
app.use("/api/suivis", suiviRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send(" API BTP-CONTRACT est en ligne !");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend démarré sur http://localhost:${PORT}`);
});
