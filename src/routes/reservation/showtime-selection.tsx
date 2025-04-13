import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { toast } from 'react-hot-toast';

export default function ShowtimeSelection() {
  const [movies, setMovies] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [times, setTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [experienceTypes, _setExperienceTypes] = useState<string[]>(["2D", "3D", "IMAX"]);
  const [selectedExperience, setSelectedExperience] = useState<string>("");

  useEffect(() => {
    const db = getDatabase();
    const moviesRef = ref(db, "movies");

    const unsubscribe = onValue(moviesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const movieKeys = Object.keys(data);
        setMovies(movieKeys);

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
      const timesRef = ref(db, `movies/${selectedMovie}/showtimes`);
      onValue(timesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedTimes = data.map((time: string) => {
        const [hour, minute] = time.split(":").map(Number);
        return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
          });
          setTimes(formattedTimes);
        } else {
          setTimes([]);
        }
      });

      const unsubscribe = onValue(timesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setTimes(data);
        } else {
          setTimes([]);
        }
      });

      return () => off(timesRef); // Cleanup listener
    } else {
      setTimes([]);
    }
  }, [selectedMovie]);

  const handleSubmit = () => {
    if (selectedMovie && selectedDate && selectedTime && selectedExperience) {
      <Link
        to="/reserve/seat"
        state={{
          movie: selectedMovie,
          date: selectedDate,
          time: selectedTime,
          experience: selectedExperience,
        }}
      >
        Proceed to Seat Selection
      </Link>;
    } else {
      toast.error("Please select all options.");
    }
  };

  return (
    <div className="py-48">
      <h1>Showtime Selection</h1>
      <div>
        <label>Movie:</label>
        <select value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)}>
          <option value="">Select a movie</option>
          {movies.map((movie) => (
            <option key={movie} value={movie}>
              {movie}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Date:</label>
        <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
          <option value="">Select a date</option>
          {dates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Time:</label>
        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
          <option value="">Select a time</option>
          {times.map((time, index) => (
            <option key={index} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Experience:</label>
        <select value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)}>
          <option value="">Select an experience</option>
          {experienceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSubmit}>Proceed to Seat Selection</button>
    </div>
  );
}
