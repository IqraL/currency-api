import express, { Request } from "express";
import { Item, Payout, UniqItem } from "./types";
import { keyBy, groupBy, values } from "lodash";
import { v4 as createId } from "uuid";

const app = express();
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

const port = 5000;

// MAX_PAYOUT_AMOUNT in any currency
const MAX_PAYOUT_AMOUNT = 100000;

// create payout for item that exceeds the limit of MAX_PAYOUT
const createPayoutForItem = (item: UniqItem): Payout => {
  const payoutId = createId();
  const { name, priceAmount, ...rest } = item;
  return {
    payoutId,
    ...rest,
    payoutAmount: priceAmount,
    itemsInPayout: [item],
  };
};

const createPayoutForSeller = (
  sellerRef: string,
  allItemsSoldForSeller: UniqItem[]
) => {
  const itemsSoldForSellerByCurrency = groupBy(
    allItemsSoldForSeller,
    "currency"
  );

  let allPayoutsForSeller: Payout[] = [];

  for (const currency in itemsSoldForSellerByCurrency) {
    const itemsSoldForSeller = itemsSoldForSellerByCurrency[currency];

    const payoutsForSeller = itemsSoldForSeller.reduce(
      (currentPayoutsForSeller: Payout[], item: UniqItem) => {
        // if item price is greater then MAX_PAYOUT , create a payout for the item
        if (item.priceAmount >= MAX_PAYOUT_AMOUNT) {
          return [...currentPayoutsForSeller, createPayoutForItem(item)];
        }

        



        return [...currentPayoutsForSeller];
      },
      []
    );

    allPayoutsForSeller = [...allPayoutsForSeller, ...payoutsForSeller];
  }

  console.log("allPayoutsForSeller", allPayoutsForSeller);
};

const createPayoutObjectFunction = (
  soldItems: GroupBySellerRef
): Payout[] | void => {
  const sellerReferences = Object.keys(soldItems);

  const payouts: any = [];

  const x = sellerReferences.map((sellerRef) => {
    //@ts-ignore
    const itemsSoldForSeller: UniqItem[] = soldItems[sellerRef];
    createPayoutForSeller(sellerRef, itemsSoldForSeller);
  });
};

type GroupBySellerRef = {
  key: UniqItem[];
};

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

  const createPayoutObject = createPayoutObjectFunction(
    soldItemsBysellerReference
  );

  res.status(200).send();
});

app.listen(port, () => console.log(`Running on port ${port}`));
