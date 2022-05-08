export const TEST_ITEM_ONE = {
  name: "test-item-one",
  currency: "GBP",
  priceAmount: 50,
  sellerReference: "sellerRefOne",
};

export const TEST_ITEM_TWO = {
  name: "test-item-two",
  currency: "GBP",
  priceAmount: 50,
  sellerReference: "sellerRefOne",
};

export const PAYOUT_EXAMPLE = {
  payoutId: "payoutId-test",
  uploadId: "uploadId-test",
  sellerReference: "sellerReference-test",
  currency: "GBP",
  payoutAmount: TEST_ITEM_ONE.priceAmount,
  itemsInPayout: [TEST_ITEM_ONE],
};
