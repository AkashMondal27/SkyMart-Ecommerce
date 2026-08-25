import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        SkyMart
      </h1>

      <div className="flex gap-3">
        <Button>Click Me</Button>

        <Button variant="secondary">
          Secondary
        </Button>

        <Button variant="destructive">
          Delete
        </Button>

        <Button variant="outline">
          Outline
        </Button>
      </div>
    </div>
  );
}

export default App;