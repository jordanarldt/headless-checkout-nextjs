import { GraphQLResponse } from "../types/bigcommerce";

export function gqlClient(options: {
  channelId?: number;
  jwt?: string;
  customerId?: number;
}) {
  if (!options.jwt) {
    throw new Error("Cannot create a GraphQL client without a JWT.");
  }

  if (options.channelId && isNaN(options.channelId)) {
    throw new Error("Channel ID must be a number.");
  }

  const channelSuffix =
    options.channelId && options.channelId > 1 ? `-${options.channelId}` : "";
  const url = `https://store-${process.env.BIGCOMMERCE_STORE_HASH}${channelSuffix}.mybigcommerce.com/graphql`;
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
      headers,
      body: JSON.stringify({
        query: `${type} { ${query} }`,
      }),
    }).then(res => res.json());
  }

  async function query<T = Record<string, any>>(
    query: TemplateStringsArray,
  ): Promise<GraphQLResponse<T>> {
    return fetcher("query", query[0]);
  }

  async function mutation<T = Record<string, any>>(
    query: TemplateStringsArray,
  ): Promise<GraphQLResponse<T>> {
    return fetcher("mutation", query[0]);
  }

  return {
    query,
    mutation,
  };
}
