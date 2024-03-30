"use client";
import mqtt from "mqtt";
import { useEffect, useState } from "react";
import { mqttConfig, mqttUri, sendPaymentTopic } from "@/constant";
import { addTransactionHistory } from "./actions";

export default function Home() {
  const [mqttMessage, setMqttMessage] = useState<string>("No message yet");

  // Connect to mqtt broker
  useEffect(() => {
    const client = mqtt.connect(mqttUri, mqttConfig);
    client.subscribe(sendPaymentTopic);
    client.on("message", async (topic, message) => {
      if (topic === sendPaymentTopic) {
        setMqttMessage(message.toString());
        await addTransactionHistory();
      }
    });

    return () => {
      if (client) {
        client.unsubscribe(sendPaymentTopic);
        client.end();
      }
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="font-bold text-2xl mb-4">Message from node</h1>
      <p className="mt-4 min-w-full bg-gray-100 py-2 px-4 rounded-xl text-center">
        {mqttMessage}
      </p>
    </main>
  );
}
