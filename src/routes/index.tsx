import { motion } from "framer-motion";

export default function Index() {
  return (
    <div>
      <div className="flex flex-col overflow-hidden">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 1.5,
            ease: "backInOut",
          }}
        >
          <div>Test</div>
        </motion.div>
      </div>
    </div>
  );
}
