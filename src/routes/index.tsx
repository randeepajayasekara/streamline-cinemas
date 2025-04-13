import { motion } from "framer-motion";
import { ThreeDMarquee } from "@/components/layouts/3d-marquee";
import { Carousel } from "@/components/layouts/index-carousel";
import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";

export default function Index() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const db = getDatabase();
      const imagesRef = ref(db, "images"); // get the reference to the images node in from firebase
      try {
        const snapshot = await get(imagesRef);
        if (snapshot.exists()) {
          setImages(snapshot.val());
        } else {
          console.error("No data available");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const [slideData, setSlideData] = useState<
    { title: string; button: string; src: string }[]
  >([]);

  useEffect(() => {
    const fetchSlideData = async () => {
      const db = getDatabase();
      const slidesRef = ref(db, "slideData"); // get the reference to the slides node from firebase
      try {
        const snapshot = await get(slidesRef);
        if (snapshot.exists()) {
          setSlideData(snapshot.val());
        } else {
          console.error("No slide data available");
        }
      } catch (error) {
        console.error("Error fetching slide data:", error);
      }
    };

    fetchSlideData();
  }, []);

  return (
    <div>
      <div className="relative mx-auto my-10 flex h-[600px] w-full max-w-7xl flex-col items-center justify-center overflow-hidden sm:rounded-none xl:rounded-3xl border border-zinc-900">
        <img
          alt=""
          src="https://i.ibb.co/T9pQJr6/icon.png"
          className="w-24 h-auto dark:invert relative z-30 mx-auto -mb-8 select-none"
        />
        <h2 className="relative z-20 mx-auto max-w-4xl text-center text-4xl font-medium text-balance text-white md:text-6xl lg:text-6xl select-none">
          Streamline Cinemas
        </h2>
        <h2 className="relative z-20 mx-auto max-w-2xl text-center text-2xl font-normal text-balance text-white md:text-xl lg:text-xl select-none">
          Your unforgettable cinema experience
        </h2>

        {/* overlay */}
        <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
        <ThreeDMarquee
          className="pointer-events-none absolute inset-0 h-full w-full brightness-75"
          images={images}
        />
      </div>
      <div className="flex flex-col overflow-hidden py-14">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 2,
            ease: "backInOut",
          }}
        >
          <h2 className="max-w-full text-right pr-12 mx-auto text-xl md:text-3xl font-medium text-neutral-800 dark:text-neutral-200 underline underline-offset-8 decoration-2 decoration-zinc-600 select-none">
            Now Showing
          </h2>
          <div className="relative overflow-hidden w-full h-full py-20">
            <Carousel slides={slideData} />
          </div>
        </motion.div>
      </div>

    </div>
  );
}
