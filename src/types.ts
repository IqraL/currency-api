export type Item = {
  name: string;
  currency: string;
  priceAmount: number;
  sellerReference: string;
};

export type Payout = {
  payoutId: string;
  uploadId: string;
  sellerReference: string;
  currency: string;
  payoutAmount: number;
  itemsInPayout: Item[];
};

export type GroupBySellerRef = {
  [key: string]: Item[];
};
