import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useReservation } from "@/contexts/ReservationContext";
import {
  IconMovie,
  IconCalendarWeekFilled,
  IconClock,
  IconEyeglassFilled,
  IconArrowRight,
  IconSparkles,
} from "@tabler/icons-react";

interface Movie {
  name: string;
  thumbnail: string;
}

export default function ShowtimeSelection() {
  const navigate = useNavigate();
  const { setShowtimeData } = useReservation();
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const moviesRef = ref(db, "movies");

    onValue(moviesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const movieList = Object.keys(data).map((key) => ({
          name: key,
          thumbnail: data[key].thumbnail || "",
        }));
        setMovies(movieList);

        const today = new Date();
        const generatedDates = Array.from({ length: 14 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          return date.toISOString().split("T")[0];
        });
        setDates(generatedDates);
      } else {
        setMovies([]);
        setDates([]);
      }
    });

    return () => off(moviesRef);
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

      return () => off(timesRef);
    } else {
      setTimes([]);
    }
  }, [selectedMovie]);
  
  const handleSubmit = () => {
    if (selectedMovie && selectedDate && selectedTime && selectedExperience) {
      setLoading(true);
      
      setShowtimeData({
        movie: selectedMovie.name,
        date: selectedDate,
        time: selectedTime,
        experience: selectedExperience,
        movieThumbnail: selectedMovie.thumbnail,
      });

      setTimeout(() => {
        navigate("/reserve/seat");
        setLoading(false);
      }, 500);
    } else {
      toast.error("Please select all options.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getExperienceIcon = (experience: string) => {
    switch (experience) {
      case 'IMAX':
        return <IconSparkles className="w-5 h-5" />;
      case '3D':
        return <IconEyeglassFilled className="w-5 h-5" />;
      default:
        return <IconMovie className="w-5 h-5" />;
    }
  };

  const getExperiencePrice = (experience: string) => {
    switch (experience) {
      case 'IMAX':
        return 'From LKR 3,400';
      case '3D':
        return 'From LKR 1,800';
      default:
        return 'From LKR 800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-950 py-48 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Book Your Experience
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select your preferred movie, showtime, and experience for the perfect cinema visit
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="xl:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
                Select Your Showtime
              </h2>
              
              <div className="space-y-8">
                <div>
                  <label className="flex items-center space-x-3 text-lg font-medium text-gray-900 dark:text-white mb-4">
                    <IconMovie className="w-6 h-6 text-blue-600" />
                    <span>Choose Movie</span>
                  </label>
                  <select
                    className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

                <div>
                  <label className="flex items-center space-x-3 text-lg font-medium text-gray-900 dark:text-white mb-4">
                    <IconCalendarWeekFilled className="w-6 h-6 text-green-600" />
                    <span>Select Date</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {dates.slice(0, 8).map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          selectedDate === date
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                            : "border-gray-200 dark:border-gray-600 hover:border-green-300 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="text-sm font-medium">{formatDate(date)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-3 text-lg font-medium text-gray-900 dark:text-white mb-4">
                    <IconClock className="w-6 h-6 text-purple-600" />
                    <span>Pick Time</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {times.map((time, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          selectedTime === time
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                            : "border-gray-200 dark:border-gray-600 hover:border-purple-300 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-3 text-lg font-medium text-gray-900 dark:text-white mb-4">
                    <IconEyeglassFilled className="w-6 h-6 text-orange-600" />
                    <span>Experience Type</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {experienceTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedExperience(type)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedExperience === type
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-orange-300 bg-white dark:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          {getExperienceIcon(type)}
                          <span className={`font-semibold ${
                            selectedExperience === type
                              ? "text-orange-700 dark:text-orange-400"
                              : "text-gray-700 dark:text-gray-300"
                          }`}>
                            {type}
                          </span>
                        </div>
                        <div className={`text-sm ${
                          selectedExperience === type
                            ? "text-orange-600 dark:text-orange-500"
                            : "text-gray-500 dark:text-gray-400"
                        }`}>
                          {getExperiencePrice(type)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="xl:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Booking Summary
              </h3>
              
              {selectedMovie ? (
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={selectedMovie.thumbnail}
                      alt={selectedMovie.name}
                      className="w-full h-1/2 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-white font-bold text-lg truncate">
                        {selectedMovie.name}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Date:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDate(selectedDate)}
                        </span>
                      </div>
                    )}
                    
                    {selectedTime && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Time:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedTime}
                        </span>
                      </div>
                    )}
                    
                    {selectedExperience && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                        <span className="font-medium text-gray-900 dark:text-white flex items-center space-x-1">
                          {getExperienceIcon(selectedExperience)}
                          <span>{selectedExperience}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <IconMovie className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a movie to see details
                  </p>
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={!selectedMovie || !selectedDate || !selectedTime || !selectedExperience || loading}
                className={`w-full mt-8 py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  selectedMovie && selectedDate && selectedTime && selectedExperience && !loading
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Continue to Seats</span>
                    <IconArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
