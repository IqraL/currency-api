import { Payout, UniqItem } from "./types";
import { v4 as createId } from "uuid";

// create payout for item;
export const createPayout = (item: UniqItem): Payout => {
  const payoutId = createId();
  const { name, priceAmount, ...rest } = item;
  return {
    payoutId,
    ...rest,
    payoutAmount: priceAmount,
    itemsInPayout: [item],
  };
};

// retuen a update a payout, add new item and update payoutAmount
export const updatePayout = (payout: Payout, item: UniqItem): Payout => {
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
  item: UniqItem
) => {
  // payout that have not reached there max , add item to one of these to reduce number of payouts
  const payoutsWithoutMaxLimit = currentPayoutsForSeller.filter(
    (payout) => payout.payoutAmount < MAX_PAYOUT_AMOUNT
  );

  let payoutToAddTo: Payout | undefined;

  for (let i = 0; i < payoutsWithoutMaxLimit.length; i++) {
    const potentialPayoutToAddTo = payoutsWithoutMaxLimit[i];

    const newTotalOfPayout =
      potentialPayoutToAddTo.payoutAmount + item.priceAmount;

    const isNewTotalLessThenMaxLimit = newTotalOfPayout < MAX_PAYOUT_AMOUNT;

    const setInitialpayoutToAddTo =
      isNewTotalLessThenMaxLimit && !payoutToAddTo;

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
