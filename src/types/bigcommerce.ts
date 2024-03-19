import { JwtPayload } from "jsonwebtoken";

export interface GraphQLClient {
  query<T = Record<string, any>>(query: string): Promise<GraphQLResponse<T>>;
  mutation<T = Record<string, any>>(query: string): Promise<GraphQLResponse<T>>;
}

export interface GraphQLResponse<T = Record<string, any>> {
  data: T;
  errors: any[];
}

interface VariantsNode {
  variantId: number;
  sku: string;
  inventory: {
    isInStock: boolean;
    aggregated: {
      availableToSell: number;
    } | null;
  };
}

interface VariantsConnection {
  edges: { node: VariantsNode }[];
}

interface ProductNode {
  productId: number;
  name: string;
  variants: VariantsConnection;
}

interface ProductsConnection {
  edges: {
    node: ProductNode;
  }[];
}

export interface GraphQLProductsResponse {
  site: {
    products: ProductsConnection;
  };
}

export interface ProductData {
  productId: number;
  variantId: number;
  sku: string;
}

export interface GraphQLCartCreationResponse {
  cart: {
    createCart: {
      cart: {
        entityId: string;
      } | null;
    };
  };
}

export type CartItemData = {
  entityId: string;
  productEntityId: string;
  name: string;
  sku: string;
  quantity: number;
};

export interface CartNode {
  entityId: string;
  lineItems: {
    physicalItems: CartItemData[];
    digitalItems: CartItemData[];
  };
}

export interface GraphQLCartQueryResponse {
  site: {
    cart: CartNode | null;
  };
}

export interface CartRedirectUrlsResponse {
  data: {
    cart_url: string;
    checkout_url: string;
    embedded_checkout_url: string;
  };
}
