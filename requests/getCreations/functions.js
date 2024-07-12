import { poolPromise } from "../../db.js";

export async function getCreations({ details }) {
  const query = `SELECT nom, description, plans ${
    details ? ", category, materiaux, creation" : ""
  } FROM meubles ORDER BY id DESC`;

  const result = await poolPromise.query(query);

  return result[0];
}
export async function getMateriaux() {
  const query = `SELECT * FROM materiaux ORDER BY id DESC`;

  const result = await poolPromise.query(query);

  return result[0];
}
