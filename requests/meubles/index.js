import express from "express";
import checkToken from "../../utils/token.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { postMeuble } from "./functions.js";

// Configuration de multer
const storage = multer.diskStorage({
  destination: "public/public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

const fileTypeCheck = (req, res, next) => {
  const allowedTypes = /jpeg|jpg/;
  const file = req.file;
  if (file) {
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extName) {
      return next();
    } else {
      return res.status(400).send({
        message: "Seuls les fichiers JPEG et JPG sont autorisés.",
      });
    }
  }
  next();
};

const router = express.Router();

router.post("/", upload.single("fichier"), fileTypeCheck, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader.split(" ")[0] !== "Bearer") {
      return res.status(400).send({ message: "Session inconnue." });
    }

    const auth = authHeader.split(" ")[1];
    const verifyAuth = await checkToken(auth);
    if (!verifyAuth) {
      return res.status(400).send({ message: "Session inconnue." });
    }

    let { name, description, materiaux, category, multiple } = req.body;
    if (!name || !description || !materiaux || !category || !multiple) {
      return res
        .status(400)
        .send({ message: "Tous les champs sont obligatoires." });
    }

    materiaux = JSON.stringify(materiaux);
    materiaux = `"${materiaux}"`;

    for (let i = 0; i < multiple; i++) {
      await postMeuble([name, category, materiaux, req.file.filename, description]);
    }
    return res.status(200).send({ message: "Meuble ajouté avec succès." });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Erreur serveur." });
  }
});

export default router;
