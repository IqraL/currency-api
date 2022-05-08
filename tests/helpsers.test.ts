import { PAYOUT_EXAMPLE, TEST_ITEM_ONE, TEST_ITEM_TWO } from "./mockData";

const { createPayout, updatePayout } = require("../src/helper");

test("createPayout returns a correct payout", () => {
  const uploadId = "upload-id-test";
  const { name, priceAmount, ...rest } = TEST_ITEM_ONE;

  const expectedPayout = {
    uploadId,
    ...rest,
    payoutAmount: TEST_ITEM_ONE.priceAmount,
    itemsInPayout: [TEST_ITEM_ONE],
  };

  const createdPayout = createPayout(TEST_ITEM_ONE, uploadId);
  const { payoutId, ...result } = createdPayout;

  expect(result).toEqual(expectedPayout);
});

test("updatePayout adds new item to payout with updated payoutAmount", () => {
  const expectResult = {
    ...PAYOUT_EXAMPLE,
    payoutAmount: PAYOUT_EXAMPLE.payoutAmount + TEST_ITEM_TWO.priceAmount,
    itemsInPayout: [...PAYOUT_EXAMPLE.itemsInPayout, TEST_ITEM_TWO],
  };

  const result = updatePayout(PAYOUT_EXAMPLE, TEST_ITEM_TWO);

  expect(result).toEqual(expectResult);
});
