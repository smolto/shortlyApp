// lib/models/test.model.ts
import { Model, Schema } from "mongoose";
import createModel from "../createModel";

interface IUrl {
  originalUrl: string;
  hash: string;
}

type UrlModel = Model<IUrl, {}>;

const urlSchema = new Schema<IUrl, UrlModel>({
  originalUrl: String,
  hash: String,
});

export default createModel<IUrl, UrlModel>("url", urlSchema);
