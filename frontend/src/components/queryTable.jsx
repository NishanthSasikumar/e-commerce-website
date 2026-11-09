import { useEffect, useState } from "react";
import { Button, message } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTicketNo } from "../slicers";
import { AgGridReact } from "ag-grid-react";

function SupportUsers() {
  const [tickets, setTickets] = useState([]);
  const dispatch = useDispatch();
  let { email } = useSelector((state) => state.role);
  const navigate = useNavigate();

  const getTickets = async () => {
    try {
      const response = await axios.get("http://localhost:3000/ticket/all", {
        withCredentials: true,
      });
      setTickets(response.data.tickets);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  const claimTicket = async (ticketNo) => {
    try {
      await axios.patch(
        "http://localhost:3000/ticket/claim",
        { ticketNo },
        { withCredentials: true },
      )
      setTickets((prev) =>
        prev.map((t) =>
          t.ticketNo === ticketNo ? { ...t, claimedBy: email } : t,
        ),
      );
      message.success("Ticket claimed");
    } catch (err) {
      message.error("Already claimed by another admin");
    }
  };

  const columns = [
    { headerName: "Ticket No", field: "ticketNo", width: 110 },
    { headerName: "Email", field: "email", flex: 1 },
    { headerName: "Issue", field: "issue", flex: 1 },
    { headerName: "Status", field: "status", width: 110 },
    {
      headerName: "Replied",
      field: "replied",
      width: 100,
      cellRenderer: (params) => (
        <span style={{ color: params.data.replied ? "green" : "gray" }}>
          {params.data.replied ? "Yes" : "No"}
        </span>
      ),
    },
    {
      headerName: "Claim",
      width: 130,
      cellRenderer: (params) => (
        <Button
          disabled={!!params.data.claimedBy}
          onClick={() => {
            claimTicket(params.data.ticketNo)}}
        >
          {params.data.claimedBy ? "Claimed" : "Claim"}
        </Button>
      ),
    },
    {
      headerName: "Open Chat",
      width: 130,
      cellRenderer: (params) => (
        
        <Button
          disabled={params.data.claimedBy !== email}
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
  console.log(tickets);
  console.log(email);
  
  return (
    <div style={{ height: "500px", padding: "20px" }}>
      <AgGridReact columnDefs={columns} rowData={tickets} />
    </div>
  );
}

export default SupportUsers;
