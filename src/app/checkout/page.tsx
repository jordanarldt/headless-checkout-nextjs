import { cookies } from "next/headers";
import { Panel } from "../../components/layout/Panel";
import { getCartRedirectUrls, gqlClient, queryCartData } from "../../lib/bigcommerce";
import { CART_COOKIE_KEY } from "../../constants";
import { redirect } from "next/navigation";
import { EmbeddedCheckout } from "../../components/EmbeddedCheckout";

const client = gqlClient({
  storeHash: process.env.BIGCOMMERCE_STORE_HASH,
  channelId: Number(process.env.BIGCOMMERCE_CHANNEL_ID),
  jwt: process.env.BIGCOMMERCE_GQL_TOKEN,
});

async function getEmbeddedCheckoutUrl(cartId: string): Promise<string> {
  const resp = await getCartRedirectUrls({
    storeHash: process.env.BIGCOMMERCE_STORE_HASH ?? "",
    accessToken: process.env.BIGCOMMERCE_AUTH_TOKEN ?? "",
    cartId,
  });

  return resp.data.embedded_checkout_url;
}

export default async function Checkout() {
  const cartId = cookies().get(CART_COOKIE_KEY)?.value;
  const cartData = (await queryCartData(client, cartId)).data.site.cart;

  if (!cartData || !cartId) {
    redirect("/");
  }

  const embeddedUrl = await getEmbeddedCheckoutUrl(cartId);

  return (
    <Panel header="Step 3: Checkout">
      <EmbeddedCheckout embeddedUrl={embeddedUrl} />
    </Panel>
  );
}
