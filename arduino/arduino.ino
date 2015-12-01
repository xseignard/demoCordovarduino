#define POT A0
#define LED 13

unsigned long previousMillis;
int interval = 50;

void setup() {
	Serial.begin(9600);
	pinMode(POT, INPUT);
	pinMode(LED, OUTPUT);
}

void loop() {
	if (Serial.available() > 0) {
		char i = Serial.read();
		switch (i) {
			case '0':
				digitalWrite(LED, LOW);
				break;
			case '1':
				digitalWrite(LED, HIGH);
				break;
		}
	}
	if (millis() - previousMillis >= interval) {
		previousMillis = millis();
		int value = analogRead(POT);
		Serial.println(value);
	}
}