const express = require("express");
const configStore = require("./configStore");
const bodyParser = require("body-parser");
const startPoller = require("./sftpPoller");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get("/config", (req, res) => {
    res.json(configStore.get());
});

app.post("/config", (req, res) => {
    const { sftpConfig, indicationMap, pollInterval } = req.body;
    configStore.update({ sftpConfig, indicationMap, pollInterval });
    res.json({ message: "Configuration updated successfully" });
});

app.get("/health", (req, res) => {
    res.send("Server is up and running!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    startPoller();
});
