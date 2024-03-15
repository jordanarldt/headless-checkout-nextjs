import { ProductData } from "../types/bigcommerce";

interface ProductListProps {
  products: ProductData[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => (
  <div>
    {products.map(({ productId, variantId, sku }) => (
      <div key={variantId} className="flex">
        <div className="flex-1">{productId}</div>
        <div className="flex-1">{variantId}</div>
        <div className="flex-1">{sku}</div>
      </div>
    ))}
  </div>
);
