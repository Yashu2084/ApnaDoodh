import { motion } from "framer-motion";

const products = [
  {
    name: "Cow Milk",
    price: "₹199 / liter",
    description: "Pure A2 milk from grass-fed cows delivered chilled every morning.",
    color: "bg-amber-50/90",
  },
  {
    name: "Buffalo Milk",
    price: "₹249 / liter",
    description: "Rich, creamy buffalo milk for premium tea, cereal, and home cooking.",
    color: "bg-slate-100/90",
  },
  {
    name: "Paneer",
    price: "₹329 / 250g",
    description: "Soft, handmade paneer made from fresh milk and traditional curdling.",
    color: "bg-emerald-50/90",
  },
  {
    name: "Curd",
    price: "₹159 / 500g",
    description: "Thick, probiotic curd made with live cultures and farm-fresh milk.",
    color: "bg-indigo-50/90",
  },
];

function ProductsSection() {
  return (
    <section id="products" className="pb-24 pt-14 sm:pt-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Our Dairy Range</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Choose the freshest dairy essentials for your home delivery plan.
        </h2>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Subscribe to a flexible weekly or monthly delivery and enjoy pure dairy products handcrafted from our pasture-based herd.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product, idx) => (
          <motion.article
            key={product.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="group overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-100/80 transition-transform duration-300 hover:-translate-y-2 hover:border-emerald-200"
          >
            <div className={`inline-flex h-16 w-16 items-center justify-center rounded-3xl ${product.color}`}>
              <span className="text-3xl font-semibold text-slate-900">{product.name.charAt(0)}</span>
            </div>
            <div className="mt-6 space-y-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">{product.name}</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{product.price}</p>
              </div>
              <p className="text-sm leading-6 text-slate-600">{product.description}</p>
            </div>
            <button className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Subscribe
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default ProductsSection;
