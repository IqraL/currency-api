import { Client, QueryResult } from "pg";
import { DbPayoutRow, Payout } from "./types";

const INSERT_PAYOUT_QUERY =
  "insert into payouts (upload_id, payout,seller_ref,currency,payout_id,date) values ($1, $2, $3, $4, $5, $6)";

const SELECT_PAYOUT_QUERY = "Select * FROM payouts ORDER BY date DESC";

export const addPayoutsToDB = async (payouts: Payout[], client: Client) => {
  try {
    const date = new Date();
    const dateString = `${date}`;

    const insertQuerys: Promise<QueryResult>[] = [];

    payouts.forEach((payout) => {
      const { uploadId, sellerReference, currency, payoutId } = payout;

      const payoutValues = [
        uploadId,
        `${JSON.stringify(payout)}`,
        sellerReference,
        currency,
        payoutId,
        dateString,
      ];
      insertQuerys.push(client.query(INSERT_PAYOUT_QUERY, payoutValues));
    });

    await Promise.all(insertQuerys);
  } catch (error) {
    console.log(error);
  }
};

export const getPayouts = async (numberOfPayouts: string, client: Client) => {
  try {
    const queryWithLimit = `${SELECT_PAYOUT_QUERY} Limit ${numberOfPayouts}`;
    const result = await client.query(queryWithLimit);
    return formatPayoutRow(result?.rows || []);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const formatPayoutRow = (dbRows: DbPayoutRow[]) =>
  dbRows.map((row) => ({ ...row.payout, date: row.date }));
