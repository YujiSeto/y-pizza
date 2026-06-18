import { PizzaList } from "@/components/home/pizza-list";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getAllProducts } from "@/services/product";

export default async function Page() {
  const rawPizzas = await getAllProducts();

  const pizzas = rawPizzas.map((pizza) => ({
    ...pizza,
    image: `/pizzas/${pizza.image}`,
  }));

  // Parse and stringify to serialize Prisma objects (like Decimal) for Client Component
  const serializedPizzas = JSON.parse(JSON.stringify(pizzas));

  return (
    <div className="container mx-auto px-4">
      <Header />
      <main className="mb-10">
        <PizzaList pizzas={serializedPizzas} />
      </main>
      <Footer />
    </div>
  );
}
