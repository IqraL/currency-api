export type Item = {
  name: string;
  currency: string;
  priceAmount: number;
  sellerReference: string;
};

export type UniqItem = {
  itemId: string;
  uploadId: string;
  sellerReference: string;
  currency: string;
  name: string;
  priceAmount: number;
};

export type Payout = {
  payoutId: string;
  uploadId: string;
  sellerReference: string;
  currency: string;
  payoutAmount: number;
  itemsInPayout: UniqItem[];
};
