import { useEffect, useRef, useState } from "react";
import { Button, Input } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { socket } from "../App";
import { useNavigate } from "react-router-dom";

function SupportChat() {
  const role = useSelector((state) => state.role);
  const ticketNo = useSelector((state) => state.ticketNo);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [ticket, setTicket] = useState(null);
  const navigate = useNavigate();

  const loadMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/ticket/messages/${ticketNo}`,
        { withCredentials: true },
      );
      console.log(response.data);

      setMessages(response.data.messages);
      setTicket(response.data.ticket);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!ticketNo) return;
    socket.emit("joinTicket", ticketNo);
    loadMessages();

    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("ticketClosed", () => {
      alert("This ticket has been closed.");
      navigate("/");
    });

    return () => {
      socket.off("message");
      socket.off("ticketClosed");
    };
  }, [ticketNo]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("message", {
      ticketNo,
      sender: role.email,
      message,
      senderRole: role.role,
    });
    setMessage("");
  };

  const closeTicket = async () => {
    try {
      await axios.patch(
        "http://localhost:3000/ticket/close",
        { ticketNo },
        { withCredentials: true },
      );
      socket.emit("ticketClosed", ticketNo);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ width: "600px", margin: "30px auto" }}>
      {ticket && (
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <bold>Ticket #{ticket.ticketNo}</bold> — {ticket.issue}
            <div
              style={{
                marginLeft: "10px",
                color: ticket.status === "Completed" ? "green" : "grey",
              }}
            >
              Status : {ticket.status}
            </div>
          </div>
          {ticket.status !== "Completed" && (
            <Button onClick={closeTicket}>Close Ticket</Button>
          )}
        </div>
      )}

      <div
        style={{
          border: "1px solid lightgray",
          height: "500px",
          overflowY: "scroll",
          padding: "15px",
          borderRadius: "10px",
          background: "white",
        }}
      >
        {messages.map((msg) => (
          <div
            style={{
              display: "flex",
              justifyContent:
                msg.sender === role.email ? "flex-end" : "flex-start",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                background: msg.sender === role.email ? "blue" : "white",
                color: msg.sender === role.email ? "white" : "black",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "60%",
              }}
            >
              <div>{msg.message}</div>
              <small>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}
      </div>

      {ticket?.status !== "Completed" && (
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message"
          />
          <Button type="primary" onClick={sendMessage}>
            Send
          </Button>
        </div>
      )}
    </div>
  );
}

export default SupportChat;
