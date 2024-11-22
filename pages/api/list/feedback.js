import { listItem } from "../../../utils/crud";

export default async function handler(req, res) {
  const method = req.method;
  const tableName = "feedback";
  if (req.method === "GET") {
    return listItem(tableName, req, res);
  }
  return res.status(405).end(`Method ${method} Not Allowed`);
}



//rating comments in feedback rating comment evaluator id(user id)  submissionId 