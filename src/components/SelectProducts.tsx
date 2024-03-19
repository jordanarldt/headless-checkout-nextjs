import { redirect } from "next/navigation";
import {
  createCartMutation,
  gqlClient,
  queryCartData,
  queryInStockProducts,
} from "../lib/bigcommerce";
import { ProductList } from "./ProductList";
import { cookies } from "next/headers";
import { CART_COOKIE_KEY } from "../constants";

const client = gqlClient({
  storeHash: process.env.BIGCOMMERCE_STORE_HASH,
  channelId: Number(process.env.BIGCOMMERCE_CHANNEL_ID),
  jwt: process.env.BIGCOMMERCE_GQL_TOKEN,
});

export const SelectProducts: React.FC = async () => {
  // If there's already a cart stored in the cookies, redirect to the cart page.
  const cartId = cookies().get(CART_COOKIE_KEY)?.value;
  if (cartId) {
    redirect("/cart");
  }

  // Since this is a Server Component, we can use a server-side request to fetch the
  // product data from graphQL instead of creating an api route and fetching on the client.
  const products = await queryInStockProducts(client);

  async function formSubmit(formData: FormData) {
    "use server";
    const cartResult = await createCartMutation(client, formData);

    if (!cartResult) {
      return;
    }

    const cartId = cartResult.data.cart.createCart.cart?.entityId;

    if (cartId) {
      // Set a server-side cookie for the cart ID
      cookies().set(CART_COOKIE_KEY, cartId, {
        sameSite: "strict",
        secure: true,
        httpOnly: true,
        maxAge: 60 * 15, // 15 minutes
      });

      redirect("/cart");
    }
  }

  return (
    <form action={formSubmit}>
      <ProductList products={products} />
      <div className="mb-2 mt-4 flex justify-end">
        <button
          className="rounded-md bg-blue-500 px-4 py-1 text-white hover:text-blue-200"
          type="submit"
        >
          Continue to next step
        </button>
      </div>
    </form>
  );
};
