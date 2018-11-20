// @flow
import express from "express";

let app = express();
app.use(express.static("src/public/"));
app.listen(8081);