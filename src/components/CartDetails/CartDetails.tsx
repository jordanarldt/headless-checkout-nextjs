import { CartNode } from "../../types/bigcommerce";
import { CartItemRow } from "./CartItemRow";

interface CartDetailsProps {
  cart: CartNode;
}

export const CartDetails: React.FC<CartDetailsProps> = ({ cart }) => (
  <div>
    <strong>Cart ID: </strong>
    {cart.entityId}
    <div className="relative my-2 flex max-h-[400px] flex-col overflow-y-scroll rounded-sm border">
      <div className="sticky top-0 flex border-b bg-white py-1 font-semibold">
        <div className="flex-1 px-2">Product</div>
        <div className="flex-[2] px-2">SKU</div>
        <div className="flex-1 px-2">Quantity</div>
      </div>
      {[...cart.lineItems.physicalItems, ...cart.lineItems.digitalItems].map(item => (
        <CartItemRow key={item.entityId} {...item} />
      ))}
    </div>
  </div>
);
