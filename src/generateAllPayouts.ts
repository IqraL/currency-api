import { GroupBySellerRef, Payout, Item } from "./types";
import { generatePayoutsForSeller } from "./generatePayoutsForSeller";

export const generateAllPayouts = (
  soldItems: GroupBySellerRef,
  uploadId: string
): Payout[] => {
  const sellerReferences = Object.keys(soldItems);

  let allPayouts: Payout[] = [];

  sellerReferences.forEach((sellerRef) => {
    const itemsSoldForSeller: Item[] = soldItems[sellerRef];

    const payoutsForSeller = generatePayoutsForSeller(
      itemsSoldForSeller,
      uploadId
    );

    allPayouts = [...allPayouts, ...payoutsForSeller];
  });

  return allPayouts;
};
