import { Payout, Item } from "./types";
import { v4 as createId } from "uuid";
import { MAX_PAYOUT_AMOUNT } from "./constants";

// create payout for item;
export const createPayout = (item: Item, uploadId: string): Payout => {
  const payoutId = createId();
  const { name, priceAmount, ...rest } = item;
  return {
    payoutId,
    uploadId,
    ...rest,
    payoutAmount: priceAmount,
    itemsInPayout: [item],
  };
};

// retuen a update a payout, add new item and update payoutAmount
export const updatePayout = (payout: Payout, item: Item): Payout => {
  const { payoutAmount, itemsInPayout } = payout;

  const newPayoutAmount = payoutAmount + item.priceAmount;
  const newItemsInPayout = [...itemsInPayout, item];

  return {
    ...payout,
    payoutAmount: newPayoutAmount,
    itemsInPayout: newItemsInPayout,
  };
};

export const findPayoutToUpdate = (
  currentPayoutsForSeller: Payout[],
  item: Item
) => {
  // payouts that have not reached there max , add item to one of these to reduce number of payouts
  const payoutsWithoutMaxLimit = currentPayoutsForSeller.filter(
    (payout) => payout.payoutAmount < MAX_PAYOUT_AMOUNT
  );

  let payoutToAddTo: Payout | undefined;

  /*
  Find the best payout to append to with the new item 
  */
  for (let i = 0; i < payoutsWithoutMaxLimit.length; i++) {
    const potentialPayoutToAddTo = payoutsWithoutMaxLimit[i];

    const newTotalOfPayout =
      potentialPayoutToAddTo.payoutAmount + item.priceAmount;

    const isNewTotalLessThenMaxLimit = newTotalOfPayout < MAX_PAYOUT_AMOUNT;

    const setInitialpayoutToAddTo =
      isNewTotalLessThenMaxLimit && !payoutToAddTo;

    /* 
      use the payout with the highest payoutAmount 
      which will not reach the max limit when the new item is added
      because this will save the payout with the smaller payoutAmount to be
      used after when there is another iteam to be added
      this way decreasing the number of payouts needed 
      */
    const updatePayoutToAddTo =
      isNewTotalLessThenMaxLimit &&
      !!payoutToAddTo &&
      payoutToAddTo.payoutAmount < potentialPayoutToAddTo.payoutAmount;

    if (updatePayoutToAddTo || setInitialpayoutToAddTo) {
      payoutToAddTo = potentialPayoutToAddTo;
    }
  }

  return payoutToAddTo;
};
