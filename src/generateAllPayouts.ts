import { GroupBySellerRef, Payout, UniqItem } from "./types";
import { generatePayoutsForSeller } from "./generatePayoutsForSeller";

export const generateAllPayouts = (
  soldItems: GroupBySellerRef
): Payout[] | void => {
  const sellerReferences = Object.keys(soldItems);

  let allPayouts: Payout[] = [];

  sellerReferences.forEach((sellerRef) => {
    //@ts-ignore
    const itemsSoldForSeller: UniqItem[] = soldItems[sellerRef];

    const payoutsForSeller = generatePayoutsForSeller(itemsSoldForSeller);

    allPayouts = [...allPayouts, ...payoutsForSeller];
  });

  return allPayouts;
};
