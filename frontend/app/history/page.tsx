"use client";
import mqtt from "mqtt";
import { useEffect, useState } from "react";
import { mqttConfig, mqttUri, sendPaymentTopic } from "@/constant";
import { DocumentData } from "firebase-admin/firestore";

export default function History() {
  const [mqttMessage, setMqttMessage] = useState<string>("No message yet");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/history/api");
      const data = await response.json();
      setHistory(data);
    };

    fetchData();
  });

  //   Connect to mqtt broker
  useEffect(() => {
    const client = mqtt.connect(mqttUri, mqttConfig);
    client.subscribe(sendPaymentTopic);
    client.on("message", (topic, message) => {
      setMqttMessage(message.toString());
    });

    return () => {
      if (client) {
        client.unsubscribe(sendPaymentTopic);
        client.end();
      }
    };
  });

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="font-bold text-xl mb-4">History</h1>
      <ul>
        {history?.map((data: any) => (
          <li key={data.id}>{data.time}</li>
        ))}
      </ul>
      <p>{mqttMessage}</p>
    </main>
  );
}
