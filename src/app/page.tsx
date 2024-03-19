import { SelectProducts } from "../components/SelectProducts";
import { Panel } from "../components/layout/Panel";

export default async function Home() {
  return (
    <Panel header="Step 1: Select products">
      <p>
        The first step of the headless flow is to pick out products to create your cart
        with. Typically, a user might add products to their cart individually and the cart
        would be created on the first product add. In this example, we&apos;re going to
        select all of the products first, and create the cart with all of them at once.
        <span className="my-2 block text-sm italic">
          Note: Only the first 50 products and their variants will be returned since this
          is only a simple example app.
        </span>
      </p>
      <SelectProducts />
    </Panel>
  );
}
