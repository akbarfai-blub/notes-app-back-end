const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server berjalan di localhost:5000");
});

app.post("/data", (req, res) => {
  res.send({
    message: "Data diterima",
    data: req.body,
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
