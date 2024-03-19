import { useState } from "react";
import { ProductData } from "../../types/bigcommerce";

interface ProductRowProps extends ProductData {
  onSelect: (product: ProductData) => void;
}

export const ProductRow: React.FC<ProductRowProps> = ({ productId, variantId, sku }) => {
  const [quantity, setQuantity] = useState(0);

  function handleQuantityChange(event: React.ChangeEvent<HTMLInputElement>) {
    const leadingZeroRegexp = /^0+/;
    const value = Number(event.target.value.replace(leadingZeroRegexp, ""));

    if (value > 100) {
      return setQuantity(100);
    }

    setQuantity(value);
  }

  return (
    <div className="my-1 flex rounded-lg py-1 hover:bg-gray-100">
      <div className="flex-1 px-2">{productId}</div>
      <div className="flex-1 px-2">{variantId}</div>
      <div className="flex-[2] overflow-hidden text-ellipsis whitespace-nowrap px-2">
        {sku}
      </div>
      <div className="flex-1 px-2">
        <input
          // Since we are using NextJS server actions for the form, we need to make sure we have a name
          // that can easily be parsed when reading the form data in SelectProducts.tsx
          // The form data will be used to create a new cart with all of the products at once.
          name={`[pid:${productId}][vid:${variantId}]-quantity`}
          type="number"
          min="0"
          max="100"
          className="w-full rounded-md border pl-1"
          value={String(quantity)}
          onChange={handleQuantityChange}
        />
      </div>
    </div>
  );
};
