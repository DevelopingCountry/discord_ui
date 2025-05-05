let socket: WebSocket | null = null;
let onMessageCallback: ((msg: messages) => void) | null = null;
type messages = {
  dmId: string;
  messageId: string;
  userId: string;
  nickName: string;
  imageUrl: string;
  content: string;
  createdAt: string;
};
export function connectWebSocket(onMessage: (msg: messages) => void) {
  socket = new WebSocket(`ws://localhost:8080/ws`);
  onMessageCallback = onMessage;

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log("📥 Received message", message);

    if (onMessageCallback) {
      onMessageCallback(message);
    }
  };

  socket.onclose = () => {
    console.log("❌ WebSocket disconnected");
  };

  socket.onerror = (error) => {
    console.error("🔥 WebSocket error", error);
  };
}

export function sendMessage(dmId: string, content: string) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("WebSocket is not open");
    return;
  }

  const payload = {
    content,
  };

  socket.send(
    JSON.stringify({
      destination: `/app/dm/${dmId}`,
      body: JSON.stringify(payload),
    }),
  );
}
