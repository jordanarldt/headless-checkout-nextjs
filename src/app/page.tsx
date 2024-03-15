import { Introduction } from "../components/Introduction";
import { SetupSteps } from "../components/SetupSteps";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <Introduction />
      <SetupSteps />
    </main>
  );
}
