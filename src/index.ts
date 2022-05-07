import express, { Request } from "express";
import { Item, Payout, UniqItem } from "./types";
import { groupBy } from "lodash";
import { v4 as createId } from "uuid";
import { findPayoutToUpdate, createPayout, updatePayout } from "./helper";

const app = express();
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

const port = 5000;

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
        const payoutToAppend = findPayoutToUpdate(
          currentPayoutsForSeller,
          item
        );

        /* 
           if item price is greater then MAX_PAYOUT 
           OR if every previous payous created reach > maxlimit with this item 
           create a payout for the 
        */
        if (item.priceAmount >= MAX_PAYOUT_AMOUNT || !payoutToAppend) {
          return [...currentPayoutsForSeller, createPayout(item)];
        }

        // remove the payoutToAppend from currentPayoutsForSeller,
        // payoutToAppend will be updated then placed back in
        const currentPayoutsForSellerFiltered = currentPayoutsForSeller.filter(
          (payout) => payout.payoutId !== payoutToAppend.payoutId
        );

        const updatedPayout = updatePayout(payoutToAppend, item);

        return [...currentPayoutsForSellerFiltered, updatedPayout];
      },
      []
    );

    allPayoutsForSeller = [...allPayoutsForSeller, ...payoutsForSeller];
  }
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
