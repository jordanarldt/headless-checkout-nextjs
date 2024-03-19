import { CartItemData } from "../../types/bigcommerce";

export const CartItemRow: React.FC<CartItemData> = ({ name, sku, quantity }) => {
  return (
    <div className="my-1 flex rounded-lg py-1 hover:bg-gray-100">
      <div className="flex-1 px-2">{name}</div>
      <div className="flex-[2] overflow-hidden text-ellipsis whitespace-nowrap px-2">
        {sku}
      </div>
      <div className="flex-1 px-2">{quantity}</div>
    </div>
  );
};
