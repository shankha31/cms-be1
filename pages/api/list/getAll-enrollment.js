import { listItem } from "../../../utils/crud";



export default async function handler(req, res) {
  const tableName = "enrollment";
  const method = req.method;
  if (req.method === "GET") {
    return listItem(tableName, req, res);
  }
  return res.status(405).end(`Method ${method} Not Allowed`);
}


