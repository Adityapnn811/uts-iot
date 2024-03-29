#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <Pin.hpp>

#define BAUD_RATE 115200

int prevLEDState = LOW;
int prevButtonState = LOW;
int currentButtonState = LOW;

int initialBalance = 149000;
int price = 20000;

unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 500;

// WiFi
const char *ssid = "Amel Cantik 2"; // Enter your WiFi name - phone hotspot. esp32 and laptop connected to the same hotspot. using WPA3 - personal
const char *password = "amelsayangarriq";  // Enter WiFi password

// MQTT Broker
const char *mqtt_broker = "192.168.18.7"; // check terminal `ifconfig` on your laptop. this connect them through local network. 
const char *mqtt_username = "localBroker";
const char *mqtt_password = "mqttPassword";
const int mqtt_port = 1883;

const char* sendPaymentTopic = "sendPayment";

WiFiClient espClient;
PubSubClient client(espClient);

// SETUP HELPER
void connectWifi(){
// connecting to a WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
      Serial.println("Connecting to WiFi..");
      delay(2000);
  }
  Serial.println("Connected to the WiFi network");
}

void connectMQTTBroker(){
//connecting to a mqtt broker
 client.setServer(mqtt_broker, mqtt_port);
 while (!client.connected()) {
     String client_id = "esp32-client-";
     client_id += String(WiFi.macAddress());
     Serial.printf("The client %s connects to the mqtt broker\n", client_id.c_str());
     if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
         Serial.println("Successfuly connected to the broker");
     } else {
         Serial.print("failed with state ");
         Serial.print(client.state());
         delay(2000);
     }
 }
  // publish and subscribe
 client.publish(sendPaymentTopic, "node connected");
}

void setup() {
  Serial.begin(BAUD_RATE);
  pinMode(LED, OUTPUT);
  pinMode(BUTTON_IN, INPUT_PULLUP);
  connectWifi();
  connectMQTTBroker();
}

void handleSuccessfulPayment() {
  initialBalance -= price;
  char payload[100] = "TRANSAKSI BERHASIL, SISA SALDO Rp.";
  strcat(payload, String(initialBalance).c_str());
  client.publish(sendPaymentTopic, payload);

  // Turn LED for 5 seconds
  digitalWrite(LED, HIGH);
  delay(5000);
  digitalWrite(LED, LOW);
}

void handleFailedPayment() {
  char payload[100] = "SALDO TIDAK MENCUKUPI";
  client.publish(sendPaymentTopic, payload);

  // Blink LED for 5 seconds
  for (int i = 0; i < 5; i++) {
    digitalWrite(LED, HIGH);
    delay(500);
    digitalWrite(LED, LOW);
    delay(500);
  }
}

void loop() {
  // put your main code here, to run repeatedly:
  int buttonReading = digitalRead(BUTTON_IN);

  if ((millis() - lastDebounceTime > debounceDelay) && !buttonReading) {
    lastDebounceTime = millis();
    if (initialBalance >= price) {
      handleSuccessfulPayment();
    } else {
      handleFailedPayment();
    }
  }
}
