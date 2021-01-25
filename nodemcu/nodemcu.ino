#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include "DHT.h" // DHT Sensor Library: https://github.com/adafruit/DHT-sensor-library Adafruit Unified Sensor Lib: https://github.com/adafruit/Adafruit_Sensor
#include "secret.h"

/* DHT Params */
#define DHTPIN D4
DHT dht(DHTPIN, DHT11);
/*
 * Note :
 * This program runs on an ESP2268, so :
 * Wiring is :
 * DHT11 GND  -> ESP GND Pin
 * DHT11 DATA -> ESP D4  Pin
 * DHT11 VCC  -> ESP 3V3 Pin
 */



/* Wifi Params */
const char* ssid = STASSID;
const char* password = STAPSK;

const char* host = "api.github.com";
const int httpsPort = 443;

// SHA1 fingerprint of the certificate
const char fingerprint[] PROGMEM = "DF:B2:29:C6:A6:38:1A:59:9D:C9:AD:92:2D:26:F5:3C:83:8F:A5:87";

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.print("connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  dht.begin();
}

void loop() {
  delay(60000);
  float temperature = 0.0;
  float humidity = 0.0;
  getTemp(&temperature, &humidity);
  postRequest(temperature, humidity);
}

void postRequest(float temp, float humid) {
  Serial.println("[*] Start POST Request");
  
  WiFiClientSecure client;
  Serial.print("[*] connecting to ");
  Serial.println(host);

  Serial.printf("[=] Using fingerprint '%s'\n", fingerprint);
  client.setFingerprint(fingerprint);

  if (!client.connect(host, httpsPort)) {
    Serial.println("[-] connection failed");
    return;
  }

  String url = "/repos/lostsh/node-time/actions/workflows/manual.yml/dispatches";
  Serial.print("[*] requesting URL: ");
  Serial.println(url);

  String dataPost = "{\"ref\":\"master\", \"inputs\":{\"temp\":\"" + String(temp) + "\",\"humidity\":\""+ String(humid) +"\"}}";

  client.print(String("POST ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "User-Agent: Node-timeBYlostsh\r\n" +
               "Authorization: token " + TOKEN + "\r\n" +
               "Content-Length: " + dataPost.length() + "\r\n" +
               "Content-Type: application/x-www-form-urlencoded\r\n" +
               "\r\n" +
               dataPost + "\r\n");
               
  Serial.println("[+] request sent");
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") {
      Serial.println("[+] headers received");
      break;
    }
  }
  String line = client.readStringUntil('\n');
  Serial.println("[=] reply was:");
  Serial.println("==========");
  Serial.println(line);
  Serial.println("==========");
  Serial.println("[*] End POST Request");
}

void getTemp(float *temp, float *humidity){
  // Reading temperature or humidity takes about 250 milliseconds!
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    *temp = -1;
    *humidity = -1;
    return;
  }
  
  // Compute heat index in Celsius (isFahreheit = false)
  float hic = dht.computeHeatIndex(t, h, false);

  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.print(F("°C "));
  Serial.print(F(" Heat index: "));
  Serial.print(hic);
  Serial.println(F("°C "));

  *temp = t;
  *humidity = h;
}
