import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
async function main() {
    const pizzas = [
        {
            id: 1,
            name: 'Pepperoni with Onion',
            price: 8.99,
            image: 'pepperoni_with_onion.jpg',
            ingredients: 'Pepperoni, onion, mozzarella, tomato sauce'
        },
        {
            id: 2,
            name: 'Margherita',
            price: 7.99,
            image: 'margherita.jpg',
            ingredients: 'Mozzarella, tomato, basil, tomato sauce'
        },
        {
            id: 3,
            name: 'Four Cheese',
            price: 9.49,
            image: 'four_cheese.jpg',
            ingredients: 'Mozzarella, parmesan, gorgonzola, provolone, tomato sauce'
        },
        {
            id: 4,
            name: 'Pepperoni',
            price: 8.99,
            image: 'pepperoni.jpg',
            ingredients: 'Pepperoni, mozzarella, tomato sauce'
        },
        {
            id: 5,
            name: 'Portuguese',
            price: 9.00,
            image: 'portuguese.jpg',
            ingredients: 'Ham, egg, onion, olive, mozzarella, tomato sauce'
        },
        {
            id: 6,
            name: 'Vegetarian',
            price: 8.49,
            image: 'vegetarian.jpg',
            ingredients: 'Bell pepper, onion, tomato, mushroom, corn, mozzarella, tomato sauce'
        }
    ];


    for (let pizza of pizzas) {
        await prisma.product.upsert({
            where: { id: pizza.id },
            update: {},
            create: {
                name: pizza.name,
                price: pizza.price,
                image: pizza.image,
                ingredients: pizza.ingredients
            }
        });
    }
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })