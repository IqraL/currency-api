import express, { Request } from "express";
import { GroupBySellerRef, Item, UniqItem } from "./types";
import { groupBy } from "lodash";
import { v4 as createId } from "uuid";
import { generateAllPayouts } from "./generateAllPayouts";

const app = express();
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

const port = 5000;

app.post("/", (req: Request, res) => {
  const { body: soldItems } = req;
  const uploadId = new Date().getTime();
  const uniqSoldItems: UniqItem[] = soldItems.map((soldItem: Item) => ({
    itemId: createId(),
    uploadId: `${uploadId}`,
    ...soldItem,
  }));

  const soldItemsBysellerReference = groupBy(
    uniqSoldItems,
    "sellerReference"
  ) as GroupBySellerRef;

  const allPayouts = generateAllPayouts(soldItemsBysellerReference);

  res.send(allPayouts);
});

app.listen(port, () => console.log(`Running on port ${port}`));
