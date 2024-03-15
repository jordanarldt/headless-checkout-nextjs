import { gqlClient } from "../lib/bigcommerce";
import { GraphQLProductsResponse, ProductData } from "../types/bigcommerce";
import { ProductList } from "./ProductList";
import { Panel } from "./layout/Panel";

export const SetupSteps: React.FC = async () => {
  const { query } = gqlClient({
    channelId: Number(process.env.BIGCOMMERCE_CHANNEL_ID),
    jwt: process.env.BIGCOMMERCE_GQL_TOKEN,
  });

  const gqlResponse = await query<GraphQLProductsResponse>`
  site {
    products(first: 50) {
      edges {
        node {
          productId: entityId
          name
          variants {
            edges {
              node {
                variantId: entityId
                sku
              }
            }
          }
        }
      }
    }
  }`;

  const products: ProductData[] = gqlResponse.data.site.products.edges.flatMap(
    ({ node: { productId, variants } }) => {
      return variants.edges.map(({ node: { variantId, sku } }) => ({
        productId,
        variantId,
        sku,
      }));
    },
  );

  return (
    <Panel header="Step 1: Select products">
      <span>
        The first step of the headless flow is to pick out a product to create your cart
        with.
        <span className="text-italic">
          Note: Only the first 50 products and their variants will be returned since this
          is only a simple example app.
        </span>
      </span>
      <ProductList products={products} />
    </Panel>
  );
};
