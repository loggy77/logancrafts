import express from "express";
import { getCreations, getMateriaux } from "./functions.js";
import checkToken from "../../utils/token.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!req.query?.token) {
      const creations = await getCreations({ details: false });
      return res.status(200).send(creations);
    }

    const verifyAuth = await checkToken(req.query.token);
    if (!verifyAuth) {
      return res.status(400).send("Session unknown.");
    }

    const creations = await getCreations({ details: true });
    const materiaux = await getMateriaux();

    return res.status(200).send([creations, materiaux]);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error from the server");
  }
});

export default router;
