import {
  CartRedirectUrlsResponse,
  GraphQLCartCreationResponse,
  GraphQLCartQueryResponse,
  GraphQLClient,
  GraphQLProductsResponse,
  GraphQLResponse,
  ProductData,
} from "../types/bigcommerce";

export function gqlClient(options: {
  storeHash?: string;
  channelId?: number;
  jwt?: string;
  customerId?: number;
}): GraphQLClient {
  if (!options.storeHash) {
    throw new Error("Cannot create a GraphQL client without a store hash.");
  }

  if (!options.jwt) {
    throw new Error("Cannot create a GraphQL client without a JWT.");
  }

  if (options.channelId && isNaN(options.channelId)) {
    throw new Error("Channel ID must be a number.");
  }

  const channelSuffix =
    options.channelId && options.channelId > 1 ? `-${options.channelId}` : "";
  const url = `https://store-${options.storeHash}${channelSuffix}.mybigcommerce.com/graphql`;
  const customerHeader: Record<string, string> =
    typeof options.customerId !== "undefined" && Number(options.customerId) >= 0
      ? { "X-Bc-Customer-Id": String(options.customerId) }
      : {};

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${options.jwt}`,
    ...customerHeader,
  };

  async function fetcher(type: "query" | "mutation", query: string) {
    return fetch(url, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({
        query: `${type} { ${query} }`,
      }),
    }).then(res => res.json());
  }

  async function query<T = Record<string, any>>(
    query: string,
  ): Promise<GraphQLResponse<T>> {
    return fetcher("query", query);
  }

  async function mutation<T = Record<string, any>>(
    query: string,
  ): Promise<GraphQLResponse<T>> {
    return fetcher("mutation", query);
  }

  return {
    query,
    mutation,
  };
}

export async function queryInStockProducts({ query }: GraphQLClient) {
  const gqlResponse = await query<GraphQLProductsResponse>(`
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
                inventory {
                  isInStock
                  aggregated {
                    availableToSell
                  }
                }
              }
            }
          }
        }
      }
    }
  }`);

  const products: ProductData[] = gqlResponse.data.site.products.edges
    .flatMap(({ node: { productId, variants } }) => {
      return variants.edges.map(
        ({
          node: {
            variantId,
            sku,
            inventory: { isInStock, aggregated },
          },
        }) => ({
          productId,
          variantId,
          sku,
          isInStock,
          aggregated,
        }),
      );
    })
    .filter(({ isInStock }) => isInStock);

  return products;
}

export function formDataToGraphQLCartQuery(formData: FormData): string | undefined {
  // Parse a formData object and return the GraphQL query to create a cart.
  // This is extracted to a function to avoid duplicate code between SelectProducts client and server.
  const regExp = /\[pid:(\d+)\]\[vid:(\d+)\]-quantity/; // Regex to parse product ID and variant ID

  const lineItemsInput = Array.from(formData.entries())
    .filter(([key, value]) => value !== "0" && regExp.test(key))
    .map(([key, value]) => {
      const match = key.match(regExp);
      const productId = Number(match?.[1]);
      const variantId = Number(match?.[2]);
      return `{ productEntityId: ${productId}, variantEntityId: ${variantId}, quantity: ${Number(value)} }`;
    });

  if (!lineItemsInput.length) {
    return;
  }

  return `
  cart {
    createCart(input: {
      lineItems: [${lineItemsInput.join(",")}]
    }) {
      cart {
        entityId
      }
    }
  }`;
}

export async function createCartMutation(
  { mutation }: GraphQLClient,
  formData: FormData,
) {
  const query = formDataToGraphQLCartQuery(formData);

  if (!query) {
    return;
  }

  const result = await mutation<GraphQLCartCreationResponse>(query);

  return result;
}

export async function deleteCartMutation(
  { mutation }: GraphQLClient,
  cartId: string,
): Promise<string> {
  const result = await mutation(`
  cart {
    deleteCart(input: {
      cartEntityId: "${cartId}"
    }) {
      deletedCartEntityId
    }
  }`);

  return result.data.cart.deleteCart.deletedCartEntityId;
}

export async function queryCartData({ query }: GraphQLClient, cartId?: string) {
  const entityIdInput = cartId ? `(entityId: "${cartId}")` : "";
  const gqlResponse = await query<GraphQLCartQueryResponse>(`
  site {
    cart${entityIdInput} {
      entityId
      lineItems {
        physicalItems {
          entityId
          productEntityId
          name
          sku
          quantity
        }
        digitalItems {
          entityId
          productEntityId
          name
          sku
          quantity
        }
      }
    }
  }`);

  return gqlResponse;
}

export async function getCartRedirectUrls(options: {
  storeHash: string;
  accessToken: string;
  cartId: string;
}): Promise<CartRedirectUrlsResponse> {
  const uri = `https://api.bigcommerce.com/stores/${options.storeHash}/v3/carts/${options.cartId}/redirect_urls`;
  const resp = await fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Auth-Token": options.accessToken,
    },
  }).then(res => res.json());

  return resp;
}
