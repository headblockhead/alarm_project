int inPin = D1;        // the number of the input pin, D1 is set for the ESP8266.

int state = HIGH;      // the current state of the output pin
int reading;           // the current reading from the input pin
int previous = LOW;    // the previous reading from the input pin

// the follow variables are long because the time, measured in miliseconds,
// will quickly become a bigger number than can be stored in an int.
long lastTime = 0;         // the last time the output pin was toggled
long debounce = 200;   // the debounce time, increase if the output flickers

void setup()
{
 pinMode(inPin, INPUT);
 Serial.begin(115200);
 Serial.println("Started");
}

void loop()
{
  reading = digitalRead(inPin);

  if (reading == HIGH && previous == LOW && (millis() - lastTime > debounce)) {
    if (state == HIGH) {
      state = LOW;
      Serial.println("Door was opened");
      //TODO: Send a notification that the door was opened.
    }
    else {
      state = HIGH;
      Serial.println("Door was closed");
      //TODO: Send a notification that the door was closed.
    }
  }

  previous = reading;
}

