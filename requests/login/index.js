import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getPasswordByUsername } from "./functions.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await getPasswordByUsername(username);
    const isPasswordCorrect = await bcrypt.compareSync(
      password,
      result?.mot_de_passe
    );

    if (!isPasswordCorrect) {
      return res.status(400).send("");
    }

    const token = await jwt.sign({ admin: true }, process.env.KEY);
    res.status(200).send(token);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error from the server");
  }
});

export default router;
