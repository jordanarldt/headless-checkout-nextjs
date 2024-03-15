import { Section } from "./layout/Section";

export const Introduction: React.FC = () => (
  <Section>
    <h1 className="mb-4 text-center text-4xl font-bold">
      Welcome to this very simple headless store!
    </h1>
    <p>
      This is a simple example of a headless storefront with BigCommerce. Mainly aimed to
      show the headless flow of creating a cart and proceeding to an embedded checkout.
    </p>
  </Section>
);
