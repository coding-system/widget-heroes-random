let socket;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;
const reconnectDelay = 5000; // 5 секунд
let isWidgetsStopped = false;

function connectWebSocket() {
   if (isWidgetsStopped) return;

   socket = new WebSocket("ws://localhost:8001");

   socket.onmessage = function (event) {
       console.log("Raw WebSocket message:", event.data);

       if (event.data instanceof Blob) {
           event.data
               .text()
               .then(processMessage)
               .catch((error) => {
                   console.error("Error reading Blob:", error);
               });
       } else {
           processMessage(event.data);
       }
   };

   socket.onclose = () => {
       if (!isWidgetsStopped && reconnectAttempts < maxReconnectAttempts) {
           reconnectAttempts++;
           setTimeout(connectWebSocket, reconnectDelay);
       }
   };

   socket.onerror = () => {
       socket.close();
   };

   socket.onpong = () => {
       console.log("Получен пинг от сервера на порт 8001");
   };
}

function processMessage(data) {
   try {
      const jsonData = JSON.parse(data);
      console.log("Parsed data:", jsonData);

      if (jsonData.command === "widgets_stopped") {
         isWidgetsStopped = true;
         socket.close();
         return;
      }

      if (jsonData.command) {
         executeCommand(jsonData.command, jsonData.args || []);
      } else {
         console.warn("Invalid command format:", jsonData);
      }
   } catch (error) {
      console.error("Error processing WebSocket message:", error);
   }
}

// ✅ Универсальная функция для выполнения команд
function executeCommand(command, args) {
   if (window.commands[command]) {
      console.log(`Executing command: ${command} with args:`, args);
      window.commands[command](...args); // Вызываем команду с аргументами
   } else {
      console.warn("Unknown command:", command);
   }
}

// Инициализация соединения
connectWebSocket();
