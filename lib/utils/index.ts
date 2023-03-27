import urlSchema from "@/lib/models/url.model";
import crypto from "crypto";

export async function findByHash(hash: string) {
  const response = await urlSchema.findOne({ hash });
  return response;
}

export async function findByOriginalUrl(originalUrl: string) {
  const response = await urlSchema.findOne({ originalUrl });
  return response;
}

export async function hashExists(hash: string) {
  const response = await urlSchema.findOne({ hash });
  if (response) return true;
  return false;
}

export async function createHash(originalUrl: string) {
  var newUrl = new urlSchema({
    originalUrl,
    hash: generateHash(originalUrl, 4),
  });

  const response = await newUrl.save();

  return response;
}

export async function deleteHash(hash: string) {
  const response = await urlSchema.deleteOne({ hash });

  return response;
}

export function generateHash(data: string, len: number) {
  return crypto
    .createHash("shake256", { outputLength: len })
    .update(data)
    .digest("hex");
}
