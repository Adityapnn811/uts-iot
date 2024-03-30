#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <Pin.hpp>

#define BAUD_RATE 115200

int prevLEDState = LOW;
int prevButtonState = LOW;
int currentButtonState = LOW;

int balance = 149000;
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
const char* topUpTopic = "topUp";
const char* confirmTopUpTopic = "confirmTopUp";
const char* topUpCommand = "Top Up";

WiFiClient espClient;
PubSubClient client(espClient);

// Functions declaration
void connectWifi();
void connectMQTTBroker();
void callback(char* topic, byte* payload, unsigned int length);
void blinkLEDXSecs(unsigned int x);
void turnLEDXSecs(unsigned int x);
bool compareStrings(const char* s1, const char* s2, int length);
void handleSuccessfulPayment();
void handleFailedPayment();

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

bool compareStrings(const char* s1, const char* s2, int length) {
  for (int i = 0; i < length; i++) {
    if (s1[i] != s2[i]) return false;
  }
  return true;
}

// On message receive handler
void callback(char* topic, byte* payload, unsigned int length) {
  // Preparing sent payload
  char sendPayload[100];
  // Cast the payload into char*
  char payloadChar[length];
  memcpy(payloadChar, payload, 6);

  if (compareStrings(topic, topUpTopic, 5) && compareStrings(payloadChar, topUpCommand, 6)) {
    balance += 20000;
    strcpy(sendPayload, "TOP UP BERHASIL, SALDO SAAT INI Rp");
    strcat(sendPayload, String(balance).c_str());

    client.publish(confirmTopUpTopic, sendPayload);
    turnLEDXSecs(2);
    return;
  } else if (compareStrings(topic, topUpTopic, 5)) {
    // Default sent payload
    strcpy(sendPayload, "TOP UP GAGAL!");
    client.publish(confirmTopUpTopic, sendPayload);
    blinkLEDXSecs(2);
    return;
  }

  strcpy(sendPayload, "PAYLOAD TIDAK DIKETAHUI");
  client.publish(confirmTopUpTopic, sendPayload);
  return;
}

void connectMQTTBroker(){
//connecting to a mqtt broker
 client.setServer(mqtt_broker, mqtt_port);
 client.setCallback(callback);
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
 client.subscribe(topUpTopic);
}

// LED HELPER
void blinkLEDXSecs(unsigned int x) {
  // Blink LED for X seconds
  for (int i = 0; i < x; i++) {
    digitalWrite(LED, HIGH);
    delay(500);
    digitalWrite(LED, LOW);
    delay(500);
  }
}

void turnLEDXSecs(unsigned int x) {
  // Turn LED for X seconds
  digitalWrite(LED, HIGH);
  delay(x * 1000);
  digitalWrite(LED, LOW);
}

void setup() {
  Serial.begin(BAUD_RATE);
  pinMode(LED, OUTPUT);
  pinMode(BUTTON_IN, INPUT_PULLUP);
  connectWifi();
  connectMQTTBroker();
}

void handleSuccessfulPayment() {
  balance -= price;
  char payload[100] = "TRANSAKSI BERHASIL, SISA SALDO Rp.";
  strcat(payload, String(balance).c_str());
  client.publish(sendPaymentTopic, payload);

  turnLEDXSecs(5);
}

void handleFailedPayment() {
  char payload[100] = "SALDO TIDAK MENCUKUPI";
  client.publish(sendPaymentTopic, payload);

  blinkLEDXSecs(5);
}

void loop() {
  // put your main code here, to run repeatedly:
  int buttonReading = digitalRead(BUTTON_IN);

  if ((millis() - lastDebounceTime > debounceDelay) && !buttonReading) {
    lastDebounceTime = millis();
    if (balance >= price) {
      handleSuccessfulPayment();
    } else {
      handleFailedPayment();
    }
  }

  client.loop();
}
