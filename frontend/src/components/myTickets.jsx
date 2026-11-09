import { useEffect, useState } from "react";
import { Button, Modal, Input } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTicketNo } from "../slicers";
import { AgGridReact } from "ag-grid-react";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [modal, setModal] = useState(false);
  const [issue, setIssue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getMyTickets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/ticket/mytickets",
        {
          withCredentials: true,
        },
      );
      setTickets(response.data.tickets);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyTickets();
  }, []);

  const submitTicket = async () => {
    if (!issue.trim()) {
      alert("Please type your issue");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/ticket/create",
        { issue },
        { withCredentials: true },
      );
      const ticketNo = response.data.ticket.ticketNo;
      dispatch(setTicketNo(ticketNo));
      setIssue("");
      setModal(false);
      navigate("/supportchat");
    } catch (err) {
      console.log(err);
    }
  };
  console.log(tickets);
  
  const columns = [
    { headerName: "Ticket No", field: "ticketNo", width: 110 },
    { headerName: "Issue", field: "issue", flex: 1 },
    { headerName: "Status", field: "status", width: 120 },
    {
      headerName: "Replied",
      field: "replied",
      width: 110,
      cellRenderer: (params) => (
        <span style={{ color: params.data.replied ? "green" : "gray" }}>
          {params.data.replied ? "Yes" : "No"}
        </span>
      ),
    },
    {
      headerName: "Open Chat",
      width: 130,
      cellRenderer: (params) => (
        <Button
          type="primary"
          onClick={() => {
            dispatch(setTicketNo(params.data.ticketNo));
            navigate("/supportchat");
          }}
        >
          Open Chat
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <h3>My Tickets</h3>
        <Button type="primary" onClick={() => setModal(true)}>
          Raise New Ticket
        </Button>
      </div>

      <div style={{ height: "500px" }}>
        <AgGridReact columnDefs={columns} rowData={tickets} />
      </div>

      <Modal
        title="Raise a Ticket"
        open={modal}
        onCancel={() => {
          setModal(false);
          setIssue("");
        }}
        footer={null}
      >
        <p>Describe your issue</p>
        <Input.TextArea
          rows={4}
          placeholder="Type your issue here..."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />
        <Button
          type="primary"
          style={{ marginTop: "15px" }}
          onClick={submitTicket}
        >
          Submit
        </Button>
      </Modal>
    </div>
  );
}

export default MyTickets;
