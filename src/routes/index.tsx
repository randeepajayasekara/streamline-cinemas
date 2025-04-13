import { motion } from "framer-motion";
import { WobbleCard } from "@/components/layouts/wobble-card";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/theme/mode-toggle";

export default function Index() {
  const features = [
    {
      title: "Track the nearest dustbin in the preferred area,",
      description:
        "With our smart dustbin network, you can track the nearest bin in your area or any selected location at your ease.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Handful of Services,",
      description:
        "We provide a handful of services that can be taken from our service beyond the expectations.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Updates Section,",
      description:
        "We provide you with the latest updates and keynotes that are happening right now, posted by the administrators",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r  dark:border-neutral-800",
    },
    {
      title: "An Awesome Help Desk,",
      description:
        "We provide you with the best help desk that can help you with any queries or issues you have within our service*",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];

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
          <div className="h-full flex items-start lg:items-center justify-center mt-28 lg:mt-32">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl w-full mx-4">
              <WobbleCard
                containerClassName="col-span-1 lg:col-span-2 h-full bg-teal-800 min-h-[500px] lg:min-h-[300px]"
                className=""
              >
                <div
                  className="max-w-xs cursor-pointer"
                  onClick={() =>
                    (window.location.href = "/verified/portal/track")
                  }
                >
                  <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                    Track the nearest dustbin in your area.
                  </h2>
                  <p className="mt-4 text-left  text-base/6 text-neutral-200">
                    With our smart dustbin network, you can track the nearest
                    bin in your area at your ease.
                  </p>
                </div>
                <img
                  src="https://cdn3d.iconscout.com/3d/premium/thumb/recycle-trash-can-3d-icon-download-in-png-blend-fbx-gltf-file-formats--garbage-bin-delete-go-green-pack-nature-icons-4995306.png?f=webp"
                  width={500}
                  height={500}
                  alt="linear demo image"
                  className="absolute -right-4 lg:-right-[20%]  filter -bottom-24 object-contain rounded-2xl cursor-pointer"
                  onClick={() =>
                    (window.location.href = "/verified/portal/track")
                  }
                />
              </WobbleCard>
        
                <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-sky-800">
                  <h2
                    className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white"
                  >
                    Need our service?
                  </h2>
                  <p
                    className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200"
                  >
                    We got you covered. We will provide your
                    organization/company/business with the best service you can
                    get.
                  </p>
                </WobbleCard>
              
              <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-purple-950 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
                <div
                  className="max-w-sm"
                  onClick={() =>
                    (window.location.href = "/verified/_active/chatbot")
                  }
                >
                  <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                    Introducing the Multi Functional AI Assistant
                  </h2>
                  <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                    Our newest assistant can help you from tracking the nearest
                    dustbin to providing you with the best service.
                  </p>
                </div>
                <img
                  src="https://pixcap.com/cdn/library/template/1726693206704/thumbnail/Chatbot_3D_Icon_transparent_800_emp.webp"
                  width={500}
                  height={500}
                  alt="linear demo image"
                  className="absolute -right-10 md:-right-[20%] lg:-right-[0%] -bottom-16 object-contain rounded-2xl cursor-pointer"
                  onClick={() =>
                    (window.location.href = "/verified/_active/chatbot")
                  }
                />
              </WobbleCard>
            </div>
          </div>

          <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto mt-24">
            <div className="px-4">
              <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                Packed with many features
              </h4>

              <p className="text-sm lg:text-base  max-w-2xl  my-2 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                From Nearest Dustbin Tracking to Large Scale Organizational
                needs, we have got you covered.
              </p>
            </div>

            <div className="relative ">
              <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 border-2 rounded-md dark:border-zinc-800">
                {features.map((feature) => (
                  <FeatureCard
                    key={feature.title}
                    className={feature.className}
                  >
                    <FeatureTitle>{feature.title}</FeatureTitle>
                    <FeatureDescription>
                      {feature.description}
                    </FeatureDescription>
                    <div className=" h-full w-full">{feature.skeleton}</div>
                  </FeatureCard>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 1.5,
            ease: "backInOut",
          }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-center mx-4 md:items-center md:justify-center mb-16">
            <h4
              className="text-3xl md:text-4xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white"
              id="support_uid"
            >
              Need Service?
            </h4>
            
          </div>
        </motion.div>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <ModeToggle />
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className=" max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base  max-w-4xl text-left mx-auto",
        "text-neutral-500 text-center font-normal dark:text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full  p-5  mx-auto  dark:bg-neutral-900  group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
          {/* TODO */}
          <img
            src="https://static.vecteezy.com/system/resources/previews/048/219/899/non_2x/3d-pin-location-on-land-map-pin-icon-location-pin-map-pin-location-pin-icon-location-pin-icon-transparent-background-free-png.png"
            alt="header"
            width={800}
            height={800}
            className="h-full w-full aspect-video object-cover object-left-top rounded-sm"
          />
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <div className="w-full  mx-auto bg-transparent dark:bg-transparent group h-full">
      <div className="flex flex-1 w-full h-full flex-col space-y-2  relative">
        {/* TODO */}

        <img
          src="https://i.postimg.cc/C54fHqNF/image-removebg-preview.png"
          alt="header"
          width={800}
          height={800}
          className="h-full w-full aspect-square object-cover object-center rounded-sm blur-sm transition-all duration-200"
        />
      </div>
    </div>
  );
};

export const SkeletonTwo = () => {
  const images = [
    "https://images.vexels.com/media/users/3/192759/isolated/preview/4809a1e9d3567ab4e62b8d35a02189aa-minimalist-clock-stroke.png",
    "https://cdn.iconscout.com/icon/free/png-256/free-ios-weather-icon-download-in-svg-png-gif-file-formats--11-pack-user-interface-icons-461610.png?f=webp",
    "https://cdn3d.iconscout.com/3d/premium/thumb/alert-3d-icon-download-in-png-blend-fbx-gltf-file-formats--warning-alarm-notification-web-development-pack-design-icons-5618481.png?f=webp",
    "https://pixcap.com/cdn/library/template/1726693206704/thumbnail/Chatbot_3D_Icon_transparent_800_emp.webp",
  ];

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  };
  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      {/* TODO */}
      <div className="flex flex-row -ml-20">
        {images.map((image, idx) => (
          <motion.div
            variants={imageVariants}
            key={"images-first" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-300 shrink-0 overflow-hidden"
          >
            <img
              src={image}
              alt="asset_mages"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {images.map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-300 shrink-0 overflow-hidden"
          >
            <img
              src={image}
              alt="asset_images"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute left-0 z-40 inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent  h-full pointer-events-none" />
      <div className="absolute right-0 z-40 inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black  to-transparent h-full pointer-events-none" />
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
      <img
        src="https://cdn3d.iconscout.com/3d/premium/thumb/information-helpdesk-3d-icon-download-in-png-blend-fbx-gltf-file-formats--ask-info-answer-earphone-pack-user-interface-icons-10917876.png?f=webp"
        alt="header"
        width={800}
        height={800}
        className="h-full w-full aspect-square object-cover object-center rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
      />
    </div>
  );
};
