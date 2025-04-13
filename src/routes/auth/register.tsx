import { RegisterForm } from "@/components/layouts/auth_ui/register-form";
import { motion } from "framer-motion";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col-reverse gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <span className="flex items-center gap-2 font-medium select-none text-black dark:text-white">
            <div className="flex items-center justify-center rounded-md text-black dark:text-white">
              <img
                src="https://i.ibb.co/T9pQJr6/icon.png"
                className="w-8 h-auto select-none"
              />
            </div>
            Streamline Cinemas
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <motion.div
              initial={{ opacity: 0.0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
            >
              <RegisterForm />
            </motion.div>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <img
          src="https://i.postimg.cc/0NQtJ4cp/hall-bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover select-none"
        />
      </div>
    </div>
  );
}
