import { Payout, UniqItem } from "./types";
import { groupBy } from "lodash";
import { findPayoutToUpdate, createPayout, updatePayout } from "./helper";
import { MAX_PAYOUT_AMOUNT } from "./constants";

// generate all payouts for seller
export const generatePayoutsForSeller = (allItemsSoldForSeller: UniqItem[]) => {
  // different currencies will never have same payout for the same seller, so group items by currency
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

  return allPayoutsForSeller;
};
