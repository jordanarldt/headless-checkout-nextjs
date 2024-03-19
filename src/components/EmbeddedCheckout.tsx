"use client";

import { embedCheckout } from "@bigcommerce/checkout-sdk";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface EmbeddedCheckoutProps {
  embeddedUrl: string;
}

export const EmbeddedCheckout: React.FC<EmbeddedCheckoutProps> = ({ embeddedUrl }) => {
  const rendered = useRef(false);
  const containerId = "checkout-container";

  useEffect(() => {
    if (!rendered.current) {
      embedCheckout({ containerId, url: embeddedUrl });
      rendered.current = true;
    }
  }, [embeddedUrl]);

  return (
    <>
      <div className="mb-2 mt-4 flex justify-end">
        <Link href="/cart">
          <button className="mb-2 rounded-md bg-blue-500 px-4 py-1 text-white hover:text-blue-200">
            Go back to Cart
          </button>
        </Link>
      </div>
      <div id={containerId}></div>
    </>
  );
};
