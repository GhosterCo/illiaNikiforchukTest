import React, { useState, useEffect, useRef } from "react";
import "./LogViewer.css";

const App = () => {
  const [wsData, setWsData] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const httpRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const url = `${protocol}://localhost:4000/view-log-ws`;
    const socket = new WebSocket(url);

    socket.addEventListener("message", (event) => {
      setWsData((prevData) => prevData + event.data);
    });

    socket.addEventListener("open", () => {
      socket.send("Hello Server!");
    });

    return () => {
      socket.close();
    };
  }, []);

  // Автоматична прокрутка донизу
  useEffect(() => {
    if (autoScroll) {
      if (httpRef.current) {
        httpRef.current.scrollTop = httpRef.current.scrollHeight;
      }
      if (wsRef.current) {
        wsRef.current.scrollTop = wsRef.current.scrollHeight;
      }
    }
  }, [wsData, autoScroll]);

  const toggleAutoScroll = () => {
    setAutoScroll((prev) => !prev);
  };

  return (
    <div className="log-viewer">
      <button onClick={toggleAutoScroll}>
        {autoScroll ? "Stop Auto Scroll" : "Start Auto Scroll"}
      </button>

      <div className="log-container" ref={wsRef}>
        <h3>Last chunk from WebSocket:</h3>
        <pre>{wsData}</pre>
      </div>
    </div>
  );
};

export default App;
