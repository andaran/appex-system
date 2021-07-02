
// необходимые библиотеки
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <WebSocketsClient.h>
#include <SocketIOclient.h>
#include <string>
#include <unordered_map>

SocketIOclient socketIO;



/*   ---==== Настройки ====---   */

#define ussid ""  // Имя wifi
#define pass ""  // Пароль wifi
#define roomID ""  // ID комнаты
#define roomPass ""  // Пароль комнаты

/*   ------------------------   */

/*

  Я достаточно долго искал способы хранения информации в c++,
  которые будут больше всего похожи на объект js (мы ведь парсим json).
  std::unordered_map - самый подходящий, т.к. из него можно вытянуть или
  изменить значения свойства, название которого переданно через переменную.
  Это дает возможность выборочно обновлять значения во время
  парсинга json`а.

  [!!!] Данный список должен полностью соответсвовать
        объекту App.state в коде приложения.
        Также необходимо добавить свойство "lastChange" - оно показывает
        время последнего обращения к комнате.

*/

std::unordered_map<std::string, std::string> receivedState = {
  { "status", "false" },
  { "lastChange", "0" }
};



/*   ---==== Функция обновления состояния ====---   */

void updateParams() {

  /*

    Именно в этой функции обрабатывается новое состояние.
    К сожалению, все типы данных преобразуются в строки,
    но запарсить число из строки позволяют встроенные
    ардуиновские методы.

  */

  Serial.println("\n[LOG] Обновленное состояние:");
  Serial.print(" status: ");
  Serial.println(receivedState.at("status").c_str());
  Serial.print(" lastChange: ");
  Serial.println(receivedState.at("lastChange").c_str());
}



/*   ---==== События ====---   */

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case sIOtype_DISCONNECT: {
        Serial.println("[IOc] Ошибка подключения!\n");

      } break;

    case sIOtype_CONNECT: {
        Serial.println("[IOc] Подключено!");

        // join default namespace (no auto join in Socket.IO V3)
        socketIO.send(sIOtype_CONNECT, "/");

        /*

          Теперь подключаемся к комнате.
          Это работает как группа в каком-нибудь мессенджере -
          как только один участник напишет сообщение
          (передаст обновление для объекта состояния),
          это сообщение сразу же получат все другие участники
          (телефоны, платы esp, можно и малину подключить).

        */
        connectToRoom();

      } break;

    case sIOtype_EVENT: {
        char* json = (char*) payload;

        // парсим событие с новым состоянием
        parseEvent(json);

      } break;

    default: {
        Serial.println("[IOc] Пришло что-то непонятное :(");
        hexdump(payload, length);

      } break;
  }
}



/*   ---==== Замудреная функция парсинга ответа от сервера ====---   */

void parseEvent(char* json) {

  /* parse json */
  String messageType = "";
  String parsedParams = "";
  char oldSimbool;
  bool parseTypeFlag = false;
  bool parseParamsFlag = false;

  for (unsigned long i = 0; i < strlen(json); i++) {
    if (json[i] == '{') {
      parseParamsFlag = true;
      parsedParams = "";
    }

    if (json[i] == '"') {
      if (parseTypeFlag) {
        parseTypeFlag = false;
      } else if (messageType.length() == 0) {
        parseTypeFlag = true;
      }

      if (parseTypeFlag) {
        continue;
      }
    }

    if (parseTypeFlag) {
      messageType += json[i];
    }
    if (parseParamsFlag) {
      parsedParams += json[i];
    }

    if (json[i] == '}') {
      parseParamsFlag = false;
    }
    oldSimbool = json[i];
  }

  Serial.println("\n[IOc] Получено событие:");
  Serial.print(" TYPE: ");
  Serial.println(messageType);
  Serial.print(" PAYLOAD: ");
  Serial.println(parsedParams);

  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, parsedParams);

  if (error) {
    Serial.print("[ERR] Ошибка парсинга json!");
  } else {

    /* count quantity of params and delete unnecessary symbols */
    String prms = "";
    int prmsQuant = 1;
    for (unsigned long i = 1; i < parsedParams.length() - 1; i++) {
      if (parsedParams[i] == '"') { continue; }
      if (parsedParams[i] == ',') { prmsQuant++; }
      prms += parsedParams[i];
    }

    /* put params to array cells */
    String namesAndValues[prmsQuant];
    int numberOfParam = 0;
    for (unsigned long i = 0; i < prms.length(); i++) {
      if (prms[i] == ',') {
        numberOfParam++;
        continue;
      }
      namesAndValues[numberOfParam] += prms[i];
    }

    /* split params and values */
    std::string prmName;
    std::string prmValue;
    char* values[prmsQuant];
    bool typeFlag = false;
    for (int i = 0; i < prmsQuant; i++) {
      typeFlag = false;
      prmName = "";
      prmValue = "";
      for (int j = 0; j < namesAndValues[i].length(); j++) {
        if (namesAndValues[i][j] == ':') {
          typeFlag = true;
          continue;
        }

        if (typeFlag) {
          prmValue += namesAndValues[i][j];
        } else {
          prmName += namesAndValues[i][j];
        }
      }

      /* save changes */
      if (receivedState.count(prmName) != 0) {
        receivedState.at(prmName) = prmValue;
      } else {
        Serial.print("[ERR] Неизвестный параметр \"");
        Serial.print(prmName.c_str());
        Serial.println("\"!");
      }
    }

    /* call update function */
    updateParams();
  }
}



/*   ---==== Подключение к комнате ====---   */

void connectToRoom() {

  // данные отсылаются в json
  DynamicJsonDocument doc(1024);
  JsonArray array = doc.to<JsonArray>();

  // добавляем название события, в данном случае - "connectToRoom".
  array.add("connectToRoom");

  // добавляем id и пароль комнаты для прохождения аутентификации
  JsonObject params = array.createNestedObject();
  params["roomId"] = roomID;
  params["roomPass"] = roomPass;

  // преобразуем json в строку
  String output;
  serializeJson(doc, output);

  // отправляем событие подключения к комнате
  socketIO.sendEVENT(output);

  // логируем все это дело для ясности
  Serial.print("[Appex] Connecting to the room ");
  Serial.print(roomID);
  Serial.print(" with json: ");
  Serial.println(output);

}



/*   ---==== Отправка данных ====---   */

void message(String eventType, JsonObject sendState) {

  // данные отсылаются в json
  DynamicJsonDocument doc(1024);
  JsonArray array = doc.to<JsonArray>();

  // добавляем название события, обычно это 'update'
  array.add(eventType);

  // добавляем id и пароль комнаты для прохождения аутентификации,
  // добавляем обновленные данные
  JsonObject params = array.createNestedObject();
  params["roomId"] = roomID;
  params["roomPass"] = roomPass;
  params["params"] = sendState;

  // преобразуем json в строку
  String output;
  serializeJson(doc, output);

  // шлем событие на сервер appex
  socketIO.sendEVENT(output);

}



/*   ---==== Setup ====---   */

void setup() {

  // запускаем Serial порт
  Serial.begin(115200);
  Serial.setDebugOutput(false);

  // подключаемся к WiFi
  WiFi.begin(ussid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("\n[LOG] Wifi connected!\n");

  // ip адрес устройства
  String ip = WiFi.localIP().toString();
  Serial.printf("[SETUP] IP adress: %s\n", ip.c_str());

  // подключаемся к серверу
  socketIO.beginSSL("www.appex-system.ru", 443, "/socket.io/?EIO=4");

  // если пришел запрос
  socketIO.onEvent(socketIOEvent);

}



/*   ---==== Loop ====---   */

void loop() {

  // слушаем сервер
  socketIO.loop();

  // обновляем состояние
  if (Serial.available() > 0) {
    String content = Serial.readString();

    DynamicJsonDocument doc(1024);
    JsonObject sendState = doc.createNestedObject();

    if (content == "true") {
      sendState["status"] = true;
      message("updateState", sendState);
    }

    if (content == "false") {
      sendState["status"] = false;
      message("updateState", sendState);
    }
  }
}
