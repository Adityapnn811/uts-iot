"use client";
import mqtt from "mqtt";
import { useEffect, useState } from "react";
import { mqttConfig, mqttUri, sendPaymentTopic } from "@/constant";

export default function Home() {
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>{mqttMessage}</p>
    </main>
  );
}
