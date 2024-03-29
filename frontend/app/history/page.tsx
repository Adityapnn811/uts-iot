"use client";
import mqtt from "mqtt";
import { useEffect, useState } from "react";
import { mqttConfig, mqttUri, sendPaymentTopic } from "@/constant";

export default function History() {
  const [mqttMessage, setMqttMessage] = useState<string>("No message yet");

  // Connect to mqtt broker
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
      <p>{mqttMessage}</p>
    </main>
  );
}
