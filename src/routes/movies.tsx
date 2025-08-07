import { MovieListGridLayout } from "@/components/layouts/movie_list/layout";
import { motion } from "framer-motion";

export default function Movies() {
  return (
    <div className="py-48 bg-white dark:bg-black">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 2,
          ease: "backInOut",
        }}
      >
        <h2 className="max-w-7xl text-left pl-12 pb-12 mx-auto text-2xl md:text-3xl font-medium text-neutral-800 dark:text-neutral-200 underline underline-offset-8 decoration-2 decoration-amber-600 select-none">
          Premiere
        </h2>
        <div>
          <MovieListGridLayout />
        </div>
      </motion.div>
    </div>
  );
}
