type ProductRecord = {
  _id: { toString(): string };
  title: string;
  description: string;
  category: string;
  country: string;
  artisanName: string;
  whatsapp?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function serializeProduct(product: ProductRecord) {
  return {
    _id: product._id.toString(),
    title: product.title,
    description: product.description,
    category: product.category,
    country: product.country,
    artisanName: product.artisanName,
    ...(product.whatsapp ? { whatsapp: product.whatsapp } : {}),
    ...(product.email ? { email: product.email } : {}),
    ...(product.createdAt ? { createdAt: product.createdAt } : {}),
    ...(product.updatedAt ? { updatedAt: product.updatedAt } : {}),
  };
}
