import { NextRequest, NextResponse } from "next/server";
import { gqlClient, queryCartData } from "./lib/bigcommerce";
import { CART_COOKIE_KEY } from "./constants";

export async function middleware(req: NextRequest) {
  const client = gqlClient({
    storeHash: process.env.BIGCOMMERCE_STORE_HASH,
    channelId: Number(process.env.BIGCOMMERCE_CHANNEL_ID),
    jwt: process.env.BIGCOMMERCE_GQL_TOKEN,
  });

  // Simple middleware to cleanup the cookie if the cart doesn't exist.
  const cartId = req.cookies.get(CART_COOKIE_KEY)?.value;
  const cartExists = cartId
    ? (await queryCartData(client, cartId)).data.site.cart !== null
    : false;

  const response = NextResponse.next();

  if (cartId && !cartExists) {
    response.cookies.delete(CART_COOKIE_KEY);
  }

  return response;
}

export const config = {
  matcher: ["/", "/cart", "/checkout"],
};
