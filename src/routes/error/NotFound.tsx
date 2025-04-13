import { Spotlight } from "@/components/animations/spotlight-new";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-full w-full overflow-clip overflow-x-clip relative">
      <Spotlight />
      <main className="grid h-screen w-screen place-items-center bg-white dark:bg-black px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-amber-400">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-700 dark:text-gray-300 sm:text-7xl">
            Page not found
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-amber-600 duration-200 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </Link>
            <a
              href="mailto:streamliecinemas@gmail.com"
              className="text-sm font-semibold text-gray-900 dark:text-gray-400"
            >
              Contact support <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

{
  /*
    text,
    duration,
  }: {
    text: string;
    duration?: number;
    automatic?: boolean;
  }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  
    useEffect(() => {
      if (svgRef.current && cursor.x !== null && cursor.y !== null) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
        const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
        setMaskPosition({
          cx: `${cxPercentage}%`,
          cy: `${cyPercentage}%`,
        });
      }
    }, [cursor]);
  */
}
