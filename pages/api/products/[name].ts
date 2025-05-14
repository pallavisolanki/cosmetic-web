// pages/api/products/[name].ts
import { NextApiRequest, NextApiResponse } from "next";
import { products } from "../../../src/data/products";

const slugify = (str: string) =>
  str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  const product = products.find(
    (p) => slugify(p.name) === (name as string).toLowerCase()
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.status(200).json(product);
}
