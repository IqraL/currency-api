import express, { Request } from "express";
import { Client } from "pg";
import WebSocket, { WebSocketServer } from "ws";
import { Server } from "socket.io";

const clientServer = new Server(4000, {
  cors: { origin: "*" },
});

clientServer.on("connection", (socket) => {
  const coincapWS = new WebSocket("wss://ws.coincap.io/prices?assets=ALL");

  coincapWS.on("message", (rawData) => {
    const data = rawData.toString();
    socket.emit("currencyData", data);
  });

  socket.on("close", () => {
    coincapWS.close();
    socket.disconnect(true);
  });
});

const app = express();
app.use(express.json());
app.use(express.urlencoded());

const port = 5000;

const client = new Client({
  host: "tai.db.elephantsql.com",
  port: 5432,
  user: "lowjqxwy",
  password: "q_KrWfNbpsMpm06PGjmLm7fQMDZtiyE3",
  database: "lowjqxwy",
});

client.connect();

app.listen(port, () => console.log(`Running on port ${port}`));

app.get("/", async (req, res) => {
  res.send();
});

//TODO: later
// app.get("/initalPrices", async (req, res) => {
//   try {
//       const allcurrenciesData = await axios.get("api.coincap.io/v2/assets", {});
//     res.send();
//   } catch (error) {
//     console.log("error", error);
//     res.send();
//   }
// });
