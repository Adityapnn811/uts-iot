import { initializeAdmin } from "@/constant";
import { getFirestore } from "firebase-admin/firestore";

export async function POST(request: Request) {
  const app = await initializeAdmin();
  const firestore = getFirestore(app);
  const colRef = firestore.collection("history");
  colRef
    .add({
      time: new Date().toISOString(),
      isPayment: false,
    })
    .catch((e) => {
      console.log(e);
      return new Response(e, { status: 500 });
    });

  return new Response("Top Up Successful", { status: 200 });
}
