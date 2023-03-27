import { connect } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { findByOriginalUrl, createHash } from "@/lib/utils";
import dbConnect from "@/lib/dbConnect";

const uri: string = process.env.MONGO_DB_URL || "";

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      res.status(405).send({ message: "Only POST requests allowed" });
      return;
    }

    const originalUrl = req?.body?.originalUrl;

    if (!originalUrl)
      return res.status(400).send({ error: "originalUrl is required" });

    await dbConnect();

    const response = await findByOriginalUrl(originalUrl);

    if (response) {
      return res.send({ hash: response.hash });
    }

    const hashCreated = await createHash(originalUrl);

    if (!hashCreated)
      res.status(400).send({ error: "There was an error creating hash" });

    res.send({ hash: hashCreated.hash });
  } catch (err) {
    res.status(400).send({ error: "There was an error" });
  }
}
