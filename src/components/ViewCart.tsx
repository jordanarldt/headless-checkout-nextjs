import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deleteCartMutation, gqlClient, queryCartData } from "../lib/bigcommerce";
import { CartDetails } from "./CartDetails";
import { CART_COOKIE_KEY } from "../constants";

const client = gqlClient({
  storeHash: process.env.BIGCOMMERCE_STORE_HASH,
  channelId: Number(process.env.BIGCOMMERCE_CHANNEL_ID),
  jwt: process.env.BIGCOMMERCE_GQL_TOKEN,
});

export const ViewCart: React.FC = async () => {
  const cartId = cookies().get(CART_COOKIE_KEY)?.value;
  const cartData = (await queryCartData(client, cartId)).data.site.cart;

  if (!cartData || !cartId) {
    redirect("/");
  }

  async function deleteCart() {
    "use server";

    if (!cartId) {
      return;
    }

    try {
      await deleteCartMutation(client, cartId);
      cookies().delete(CART_COOKIE_KEY);
      redirect("/");
    } catch (err) {
      console.error("Error deleting cart", err);
    }
  }

  async function goToCheckout() {
    "use server";

    redirect("/checkout");
  }

  return (
    <>
      <CartDetails cart={cartData} />
      <div className="mb-2 mt-4 flex justify-end">
        <form action={deleteCart}>
          <button
            className="mr-2 rounded-md px-4 py-1 text-blue-500  hover:text-blue-800"
            type="submit"
          >
            Delete cart
          </button>
        </form>
        <form action={goToCheckout}>
          <button
            className="rounded-md bg-blue-500 px-4 py-1 text-white hover:text-blue-200"
            type="submit"
          >
            Proceed to checkout
          </button>
        </form>
      </div>
    </>
  );
};
