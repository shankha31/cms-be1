import NextCors from 'nextjs-cors';
import { listItem } from "../../../utils/crud";

async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const method = req.method;
  const tableName = "user";
  if (req.method === "GET") {
    return listItem(tableName, req, res);
  }
  return res.status(405).end(`Method ${method} Not Allowed`);
}

export default handler;
