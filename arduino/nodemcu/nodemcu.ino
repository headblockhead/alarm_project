#include <WiFiServerSecure.h>
#include <WiFiClientSecure.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiUdp.h>
#include <ESP8266WiFiType.h>
#include <ESP8266WiFiAP.h>
#include <WiFiClient.h>
#include <WiFiServer.h>
#include <ESP8266WiFiScan.h>
#include <ESP8266WiFiGeneric.h>
#include <ESP8266WiFiSTA.h>

#include "RestClient.h"

#include "Debounce.h"

// Uses:
//  * https://github.com/wkoch/Debounce
//  * https://github.com/esp8266/Arduino/tree/master/doc/esp8266wifi
//  * https://github.com/csquared/arduino-restclient
// To install libraries:
//  * cd ~/Documents/Arduino/libraries
//  * git clone <repo>
//  *   (For https://github.com/csquared/arduino-restclient, git clone https://github.com/csquared/arduino-restclient RestClient)

const char *ssid = "";
const char *password = "";

RestClient client = RestClient("xxxxx.execute-api.eu-west-1.amazonaws.com", 443, 1);
const char *eventDoorOpened = "{ \"event\": \"door_opened\" }";
const char *eventDoorClosed = "{ \"event\": \"door_closed\" }";

const int inPin = D1;

void setup()
{
  pinMode(inPin, INPUT);
  Serial.begin(115200);

  // Using 
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print("Connecting..");
  }
  Serial.println("Connected...");
}

Debounce doorSwitch(inPin); // the number of the input pin, D1 is set for the ESP8266.
int previousState = -1;

void loop()
{
  int newState = doorSwitch.read();
  if (previousState == -1) {
    // On the first iteration, just set it to the latest value and don't trigger an event.
    // This makes the device succeptible to a power outage making it not work.
    previousState = newState;
  }
  if (newState != previousState) {
    if (newState == HIGH) {
      Serial.println("Door was closed");
      postSecure(eventDoorClosed);
    } else {
      Serial.println("Door was opened");
      postSecure(eventDoorOpened);
    }
  }
  previousState = newState;
}

void postSecure(const char *event)
{
  String response = "";
  Serial.println("Posting...");
  int statusCode = client.post("/dev/sensor/detect", event, &response);
  Serial.println("Results (status / response)...");
  Serial.println(statusCode);
  Serial.println(response);
}

