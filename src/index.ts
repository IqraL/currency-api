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

//upload items to / - example data in sample-test-data-postman.json
app.post("/", async (req: Request<{}, {}, Item[]>, res) => {
  const { body: soldItems } = req;
  const uploadId = new Date().getTime().toString();
  const soldItemsBysellerReference = groupBy(soldItems, "sellerReference");

  const allPayouts = generateAllPayouts(soldItemsBysellerReference, uploadId);
  await addPayoutsToDB(allPayouts, client);
  res.sendStatus(200);
});

// example: localhost:5000/payouts?numberOfPayouts=10
// gets the last payouts that where saved in the db
app.get(
  "/payouts",
  async (req: Request<{}, {}, {}, { numberOfPayouts: string }>, res) => {
    const {
      query: { numberOfPayouts },
    } = req;

    const payouts = await getPayouts(numberOfPayouts, client);
    res.json(payouts);
  }
);
