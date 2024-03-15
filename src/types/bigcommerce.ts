export interface GraphQLResponse<T = Record<string, any>> {
  data: T;
  errors: any[];
}

interface VariantsNode {
  variantId: number;
  sku: string;
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
