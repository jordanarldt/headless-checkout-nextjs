"use client";

import { useState } from "react";
import { ProductData } from "../../types/bigcommerce";
import { ProductRow } from "./ProductRow";

interface ProductListProps {
  products: ProductData[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [selectedProducts, setSelectedProducts] = useState<ProductData[]>([]);

  function handleProductSelect(product: ProductData) {
    console.log("Product selected", product);
  }

  return (
    <div className="relative my-2 flex max-h-[400px] flex-col overflow-y-scroll rounded-sm border">
      <div className="sticky top-0 flex border-b bg-white py-1 font-semibold">
        <div className="flex-1 px-2">Product ID</div>
        <div className="flex-1 px-2">Variant ID</div>
        <div className="flex-[2] px-2">SKU</div>
        <div className="flex-1 px-2">Quantity</div>
      </div>
      {products.map(product => (
        <ProductRow
          key={`${product.productId}-${product.variantId}-row`}
          onSelect={handleProductSelect}
          {...product}
        />
      ))}
    </div>
  );
};
