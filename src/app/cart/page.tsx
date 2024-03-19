import { ViewCart } from "../../components/ViewCart";
import { Panel } from "../../components/layout/Panel";

export default function Cart() {
  return (
    <Panel header="Step 2: View cart">
      <p>
        The second step of the headless flow is to view and confirm the items in your cart
        prior to proceeding to the checkout page.
      </p>
      <ViewCart />
    </Panel>
  );
}
