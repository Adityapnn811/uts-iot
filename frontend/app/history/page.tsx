"use client";
import { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/history/api", {
        next: { revalidate: 5 },
      });
      const data = await response.json();
      data.sort(
        (a: any, b: any) =>
          new Date(b.time).getTime() -
          new Date(a.time).getTime()
      );
      setHistory(data);
    };

    fetchData();
  }, []);

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="font-bold text-2xl mb-4">Transaction History</h1>
      <ul className="flex flex-col w-1/2 gap-2">
        {history?.map((data: any) => {
          const date = new Date(data.time);
          return (
            <li
              key={data.id}
              className="flex flex-row justify-between font-semibold px-4 py-2 rounded-xl bg-gray-300"
            >
              <p>
                {date.getDay()}-{date.getMonth()}-{date.getFullYear()} at{" "}
                {date.getHours()}:{date.getMinutes()}
              </p>
              <p className={`${data.isPayment ? 'text-red-600' : 'text-green-700'}`}>
                {data.isPayment ? "Payment" : "Top Up"} Rp20.000
              </p>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
