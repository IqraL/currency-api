import express, { Request } from "express";
import { Item } from "./types";
import { groupBy } from "lodash";
import { generateAllPayouts } from "./generateAllPayouts";
import { addPayoutsToDB, getPayouts } from "./database";
import { Client } from "pg";

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

app.post("/", async (req: Request<{}, {}, Item[]>, res) => {
  const { body: soldItems } = req;
  const uploadId = new Date().getTime().toString();
  const soldItemsBysellerReference = groupBy(soldItems, "sellerReference");

  const allPayouts = generateAllPayouts(soldItemsBysellerReference, uploadId);
  await addPayoutsToDB(allPayouts, client);
  res.sendStatus(200);
});

app.get(
  "/payouts",
  async (req: Request<{}, {}, {}, { numberOfPayouts: string }>, res) => {
    const {
      query: { numberOfPayouts },
    } = req;

    const payouts = getPayouts(numberOfPayouts, client);

    res.send(payouts);
  }
);
