import { PizzaList } from "@/components/home/pizza-list";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { api } from "@/lib/axios";

export default async function Page() {
  const pizzaReq = await api.get("/pizzas");
  const pizzas = pizzaReq.data.pizzas ?? [];

  return (
    <div className="container mx-auto px-4">
      <Header />
      <main className="mb-10">
        <PizzaList pizzas={pizzas} />
      </main>
      <Footer />
    </div>
  );
}
