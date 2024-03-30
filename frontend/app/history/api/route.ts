import { initializeAdmin } from "@/constant";
import { getFirestore } from "firebase-admin/firestore";

export async function GET(request: Request) {
  const app = await initializeAdmin();
  const firestore = getFirestore(app);
  const colRef = firestore.collection("history");
  let result = (await colRef.get()).docs.map((doc) => doc.data());

  return Response.json(result);
}
