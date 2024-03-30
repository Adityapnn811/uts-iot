"use client";
import mqtt from "mqtt";
import { useEffect, useState } from "react";
import { confirmTopUpTopic, mqttConfig, mqttUri, topUpTopic } from "@/constant";

export default function TopUp() {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [mqttMessage, setMqttMessage] = useState<string>("-");

  const handleTopUp = () => {
    // Send message to mqtt broker
    if (client) {
      client.publish(topUpTopic, "Top Up");
    }
  };

  // Connect to mqtt broker
  useEffect(() => {
    const client = mqtt.connect(mqttUri, mqttConfig);
    client.subscribe(confirmTopUpTopic);
    client.on("message", async (topic, message) => {
      if (topic === confirmTopUpTopic && message.toString().includes("BERHASIL")) {
        setMqttMessage(message.toString());
        fetch("/top-up/api", {
          method: "POST",
        });
      } else if (
        topic === confirmTopUpTopic &&
        !message.toString().includes("BERHASIL")
      ) {
        setMqttMessage(message.toString());
      }
    });

    setClient(client);

    return () => {
      if (client) {
        client.unsubscribe(topUpTopic);
        client.end();
      }
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="font-bold text-2xl mb-4">Top Up</h1>
      {/* Create button to top up */}
      <button
        className="bg-gray-800 text-white px-4 py-2 rounded-xl"
        onClick={handleTopUp}
      >
        Top Up
      </button>
      <p className="mt-4 min-w-full bg-gray-100 py-2 px-4 rounded-xl text-center">{mqttMessage}</p>
    </main>
  );
}
