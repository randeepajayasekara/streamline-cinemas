import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { toast } from "react-hot-toast";
import {
  IconMovie,
  IconCalendarWeekFilled,
  IconClock,
  IconEyeglassFilled,
  IconArrowRight,
} from "@tabler/icons-react";

interface Movie {
  name: string;
  thumbnail: string;
}

export default function ShowtimeSelection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [times, setTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [experienceTypes, _setExperienceTypes] = useState<string[]>([
    "2D",
    "3D",
    "IMAX",
  ]);
  const [selectedExperience, setSelectedExperience] = useState<string>("");

  useEffect(() => {
    const db = getDatabase();
    const moviesRef = ref(db, "movies");

    onValue(moviesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const movieList = Object.keys(data).map((key) => ({
          name: key,
          thumbnail: data[key].thumbnail || "", // Assuming each movie has a `thumbnail` property
        }));
        setMovies(movieList);

        const today = new Date();
        const generatedDates = Array.from({ length: 14 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
        });
        setDates(generatedDates);
      } else {
        setMovies([]);
        setDates([]);
      }
    });

    return () => off(moviesRef); // Cleanup listener
  }, []);

  useEffect(() => {
    if (selectedMovie) {
      const db = getDatabase();
      const timesRef = ref(db, `movies/${selectedMovie.name}/showtimes`);
      onValue(timesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedTimes = data.map((time: string) => {
            const [hour, minute] = time.split(":").map(Number);
            return `${hour.toString().padStart(2, "0")}:${minute
              .toString()
              .padStart(2, "0")}`;
          });
          setTimes(formattedTimes);
        } else {
          setTimes([]);
        }
      });

      return () => off(timesRef); // Cleanup listener
    } else {
      setTimes([]);
    }
  }, [selectedMovie]);

  const navigate = useNavigate();
  
  const handleSubmit = () => {
    if (selectedMovie && selectedDate && selectedTime && selectedExperience) {
      navigate("/reserve/seat", {
        state: {
          movie: selectedMovie.name,
          date: selectedDate,
          time: selectedTime,
          experience: selectedExperience,
        },
      });
    } else {
      toast.error("Please select all options.");
    }
  };

  return (
    <div className="py-48 px-6 max-w-6xl mx-auto min-h-screen flex flex-col">
      <h1 className="text-5xl font-medium text-center mb-12 text-black dark:text-white">
        Showtime Selection
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-shrink">
        <div className="space-y-6 flex flex-col justify-center border border-dotted border-zinc-700 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <label className="text-lg font-medium flex items-center space-x-2 text-black dark:text-white">
              <IconMovie />
              <span>Movie:</span>
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedMovie?.name || ""}
              onChange={(e) => {
                const movie = movies.find((m) => m.name === e.target.value);
                setSelectedMovie(movie || null);
              }}
            >
              <option value="">Select a movie</option>
              {movies.map((movie) => (
                <option key={movie.name} value={movie.name}>
                  {movie.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-lg font-medium flex items-center space-x-2 text-black dark:text-white">
              <IconCalendarWeekFilled />
              <span>Date:</span>
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">Select a date</option>
              {dates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-lg font-medium flex items-center space-x-2 text-black dark:text-white">
              <IconClock />
              <span>Time:</span>
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">Select a time</option>
              {times.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-lg font-medium flex items-center space-x-2 text-black dark:text-white">
              <IconEyeglassFilled />
              <span>Experience:</span>
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
            >
              <option value="">Select an experience</option>
              {experienceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-start space-x-6 border border-dotted border-zinc-700 rounded-lg p-4">
          {selectedMovie && (
            <img
              src={selectedMovie.thumbnail}
              alt={selectedMovie.name}
              className="w-64 h-auto rounded-lg shadow-md"
            />
          )}
          <div className="flex flex-col space-y-2">
            {selectedMovie && (
              <p className="text-lg font-bold text-black dark:text-white">
                {selectedMovie.name}
              </p>
            )}
            {selectedDate && (
              <p className="text-lg text-black dark:text-white">
                {selectedDate}
              </p>
            )}
            {selectedTime && (
              <p className="text-lg text-black dark:text-white">
                {selectedTime}
              </p>
            )}
            {selectedExperience && (
              <p className="text-lg text-black dark:text-white">
                {selectedExperience}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="text-center mt-6">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-cyan-800 text-white font-medium rounded-md shadow-md hover:bg-cyan-900 duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="flex flex-row items-center justify-center">
            Proceed to Seat Selection <IconArrowRight />
          </span>
        </button>
      </div>
    </div>
  );
}
