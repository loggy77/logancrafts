import { poolPromise } from "../../db.js";

export async function postMeuble(data) {
  const query = `INSERT INTO meubles (nom, category, materiaux, plans, description) VALUES (?,?,?,?,?)`;

  const result = await poolPromise.query(query, data);

  return result[0];
}
