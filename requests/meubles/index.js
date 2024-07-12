import express from "express";
import checkToken from "../../utils/token.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { postMeuble } from "./functions.js";

// Configuration de multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

const fileTypeCheck = (req, res, next) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
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
        message: "Seuls les fichiers JPEG, PNG et PDF sont autorisés.",
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

    let { name, description, materiaux, category } = req.body;
    if (!name || !description || !materiaux || !category) {
      return res
        .status(400)
        .send({ message: "Tous les champs sont obligatoires." });
    }

    materiaux = JSON.stringify(materiaux);
    materiaux = `"${materiaux}"`;

    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath);
    const base64data = fileData.toString("base64");

    fs.unlinkSync(filePath);

    const image = `data:${req.file.mimetype};base64,${base64data}`;

    const results = await postMeuble([
      name,
      category,
      materiaux,
      image,
      description,
    ]);
    if (results?.affectedRows) {
      return res.status(200).send({ message: "Meuble ajouté avec succès." });
    }
    res.status(500).send({ message: "Erreur serveur." });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Erreur serveur." });
  }
});

export default router;
