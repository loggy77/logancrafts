import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config({ path: ".env" });
const app = express();
const port = 4000;

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

import getCreations from "./requests/getCreations/index.js";
import login from "./requests/login/index.js";
import meubles from "./requests/meubles/index.js";

app.use("/creations", getCreations);
app.use("/login", login);
app.use("/meubles", meubles);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
