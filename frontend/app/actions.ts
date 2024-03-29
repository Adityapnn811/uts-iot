"use server";

import { initializeAdmin } from "@/constant";
import { getFirestore } from "firebase-admin/firestore";

export async function addTransactionHistory() {
  const app = await initializeAdmin();
  const firestore = getFirestore(app);
  const colRef = firestore.collection("history");
  colRef
    .add({
      time: new Date().toISOString(),
      isPayment: true,
    })
    .catch((e) => {
      console.log(e);
    });
}
