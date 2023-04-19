#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <ArduinoJson.h>
#include "WiFiCredentials.h"
#include "UUID.h"

using websockets::WebsocketsClient;

WebsocketsClient client;

StaticJsonDocument<256> payload;

const int DIGITAL_IN = 15;

UUID uuid;

byte mac[6];

unsigned long ms;

bool websocketConnected;

void setup() {
  Serial.begin(115200);
  WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  WiFi.macAddress(mac);
  payload["mac_addr"] =  String(mac[0],HEX) + ":" + String(mac[1],HEX) + ":" + String(mac[2],HEX) + ":" + String(mac[3],HEX) + ":" + String(mac[4],HEX) + ":" + String(mac[5],HEX);
  payload["uuid"] = uuid.toCharArray();

  client.setCACert(ssl_ca_cert);
  websocketConnected = client.connect("wss://charmee-webservices-7sgqd.ondigitalocean.app:443");
  // client.setInsecure();
  // websocketConnected = client.connect("ws://192.168.1.129:8080");

  // get chipId
  uint32_t chipId = 0;
  for(int i=0; i<17; i=i+8) {
    chipId |= ((ESP.getEfuseMac() >> (40 - i)) & 0xff) << i;
  }
  payload["chip_id"] = String(chipId);

  pinMode(DIGITAL_IN, INPUT);

}

void loop() {
  int vibration = digitalRead(DIGITAL_IN);
  ms = millis();
  if ((WiFi.status() == WL_CONNECTED) && websocketConnected) {
    payload["current_ms"] = ms;
    payload["vibration"] = vibration;
    char jsonStr[256];
    serializeJson(payload, jsonStr);
    client.send(jsonStr);
  }
  delay(1000);

}
