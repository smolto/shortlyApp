import { connect } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { findByOriginalUrl, createHash, findByHash } from "@/lib/utils";
import dbConnect from "@/lib/dbConnect";

const uri: string = process.env.MONGO_DB_URL || "";

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      res.status(405).send({ message: "Only POST requests allowed" });
      return;
    }

    const { id: hash } = req.query;

    await dbConnect();

    const response = await findByHash(hash as string);

    if (!response)
      return res.status(400).send({ error: "hash does not exist" });
    res.send({ data: response });
  } catch (err) {
    res.status(400).send({ error: "There was an error" });
  }
}
