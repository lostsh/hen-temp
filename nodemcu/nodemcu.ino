#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include "secret.h"

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

  // Use WiFiClientSecure class to create TLS connection
  WiFiClientSecure client;
  Serial.print("connecting to ");
  Serial.println(host);

  Serial.printf("Using fingerprint '%s'\n", fingerprint);
  client.setFingerprint(fingerprint);

  if (!client.connect(host, httpsPort)) {
    Serial.println("connection failed");
    return;
  }

  String url = "/repos/lostsh/node-time/actions/workflows/manual.yml/dispatches";
  Serial.print("requesting URL: ");
  Serial.println(url);

  String dataPost = "{\"ref\":\"master\", \"inputs\":{\"temp\":\"22.5\"}}";

  client.print(String("POST ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "User-Agent: Node-timeBYlostsh\r\n" +
               "Authorization: token " + TOKEN + "\r\n" +
               "Content-Length: "+ dataPost.length() + "\r\n" +
               "Content-Type: application/x-www-form-urlencoded\r\n"+
               "\r\n" + 
               dataPost + "\r\n");

  Serial.println("request sent");
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") {
      Serial.println("headers received");
      break;
    }
  }
  String line = client.readStringUntil('\n');
  if (line.startsWith("{\"state\":\"success\"")) {
    Serial.println("esp8266/Arduino CI successfull!");
  } else {
    Serial.println("esp8266/Arduino CI has failed");
  }
  Serial.println("reply was:");
  Serial.println("==========");
  Serial.println(line);
  Serial.println("==========");
  Serial.println("closing connection");
}

void loop() {
}
