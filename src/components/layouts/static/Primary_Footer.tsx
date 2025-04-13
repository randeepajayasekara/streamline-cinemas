import { IconMailFilled, IconLocation } from "@tabler/icons-react";

export function PrimaryFooterIndexOnly() {
  let getYear = () => {
    let currentYear = new Date().getFullYear();
    return currentYear;
  };

  return (
    <footer className="bottom-0 p-12 pt-6 bg-slate-950 dark:bg-white dark:border-t-4 dark:border-slate-400 backdrop-blur-[25px]">
      <div className="grid max-w-[2000px] grid-cols-1 lg:grid-cols-3 mx-auto w-[80%] justify-items-start mt-6">
        <div className="flex flex-col justify-self-center w-full">
          <img
            alt=""
            src="https://i.ibb.co/T9pQJr6/icon.png"
            className="h-auto w-16 invert dark:invert-0"
          />
        </div>
        <div className="flex flex-col lg:justify-self-center w-full mt-12 lg:mt-0">
          <h5 className="text-[1.4rem] text-white dark:text-black font-bold">
            Explore
          </h5>
          <div className="mt-4 flex flex-row w-max h-max">
            <div className="flex justify-center items-center">
              <IconMailFilled className="w-5 h-auto my-auto text-white dark:text-black" />
            </div>
            <div className="my-auto pl-4 text-[0.8rem] text-[#afafaf] dark:text-slate-800">
              <a
                href="mailto:quaristatechuse@gmail.com"
                className="hover:text-white duration-200 dark:hover:text-black"
              >
                contact.quarista@gmail.com
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-self-center lg:justify-self-end w-full mt-12 lg:mt-0">
          <h5 className="text-[1.4rem] text-white dark:text-black font-bold">
            Contact Us
          </h5>
          <div className="mt-4 flex flex-row w-max h-max">
            <div className="flex justify-center items-center">
              <IconMailFilled className="w-5 h-auto my-auto text-white dark:text-black" />
            </div>
            <div className="my-auto pl-4 text-[0.8rem] text-[#afafaf] dark:text-slate-800">
              <a
                href="mailto:streamliecinemas@gmail.com"
                className="hover:text-white duration-200 dark:hover:text-black"
              >
                streamlinecinemas@gmail.com
              </a>
            </div>
          </div>
          <div className="mt-4 flex flex-row w-max h-max">
            <div className="flex justify-center items-center">
              <IconLocation className="w-5 h-auto my-auto text-white dark:text-black" />
            </div>
            <div className="my-auto pl-4 text-[0.8rem] text-[#afafaf] dark:text-slate-800">
              <span
                className="hover:text-white duration-200 dark:hover:text-black"
              >
                Streamline Cinemas, Sri Lanka
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <hr className="mt-12 mb-8 border-[0.3px] border-[rgba(160,160,160,0.21)] dark:border-[rgba(59,59,59,0.21)] w-[80%] max-w-[2000px]" />
      </div>

      <div
        className="text-center mt-8 mb-8 text-[1rem] text-zinc-200 dark:text-zinc-700"
        id="footerfootertext"
      >
        © {getYear()} | By Randeepa Jayasekara | All Rights Reserved
      </div>
    </footer>
  );
}
