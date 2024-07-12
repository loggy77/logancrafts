import { poolPromise } from "../../db.js";

export async function getPasswordByUsername(username) {
  const query = "SELECT mot_de_passe FROM admin WHERE pseudo = ?";

  const result = await poolPromise.query(query, username);

  return result[0][0];
}
