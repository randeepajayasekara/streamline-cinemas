import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useReservation } from "@/contexts/ReservationContext";
import type { Seat } from "@/contexts/ReservationContext";
import { toast } from "react-hot-toast";
import {
  IconArmchair,
  IconCrown,
  IconCheck,
  IconX,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";

const rows = 8;
const cols = 8;

const generateSeats = (experienceType: string, reservedSeats: string[] = []): Seat[] => {
  const seats: Seat[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isBalcony = row < 2;
      const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
      let price = 0;

      switch (experienceType) {
        case "IMAX":
          price = isBalcony ? 3600 : 3400;
          break;
        case "3D":
          price = isBalcony ? 2100 : 1800;
          break;
        case "2D":
        default:
          price = isBalcony ? 1200 : 800;
          break;
      }

      seats.push({
        id: seatId,
        type: isBalcony ? "balcony" : "ground",
        price,
        isSelected: false,
        isReserved: reservedSeats.includes(seatId),
      });
    }
  }
  return seats;
};

export default function SeatSelection() {
  const navigate = useNavigate();
  const { state, setSeatsData } = useReservation();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const { reservationData } = state;

  useEffect(() => {
    if (!reservationData.movie) {
      toast.error("Please select a showtime first");
      navigate("/reserve/showtime");
      return;
    }

    const mockReservedSeats = ["A3", "A4", "B5", "C2", "E7"];
    const generatedSeats = generateSeats(reservationData.experience, mockReservedSeats);
    setSeats(generatedSeats);
  }, [reservationData, navigate]);

  const handleSeatClick = (seatId: string) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId && !seat.isReserved
          ? { ...seat, isSelected: !seat.isSelected }
          : seat
      )
    );
  };

  useEffect(() => {
    const selectedSeats = seats.filter((seat) => seat.isSelected);
    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    setTotalPrice(total);
  }, [seats]);

  const handleProceedToCheckout = () => {
    const selectedSeats = seats.filter((seat) => seat.isSelected);
    
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    if (selectedSeats.length > 6) {
      toast.error("Maximum 6 seats can be selected");
      return;
    }

    setLoading(true);
    setSeatsData({ seats: selectedSeats, totalPrice });
    
    setTimeout(() => {
      navigate("/reserve/checkout");
      setLoading(false);
    }, 500);
  };

  const getSeatIcon = (seat: Seat) => {
    if (seat.isReserved) return <IconX className="w-4 h-4" />;
    if (seat.isSelected) return <IconCheck className="w-4 h-4" />;
    return seat.type === "balcony" ? <IconCrown className="w-4 h-4" /> : <IconArmchair className="w-4 h-4" />;
  };

  const getSeatColor = (seat: Seat) => {
    if (seat.isReserved) return "bg-red-500 text-white cursor-not-allowed";
    if (seat.isSelected) return "bg-green-500 text-white border-green-600";
    return seat.type === "balcony" 
      ? "bg-yellow-400 text-gray-800 border-yellow-500 hover:bg-yellow-300" 
      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600";
  };

  const selectedSeats = seats.filter(seat => seat.isSelected);

  if (!reservationData.movie) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-48 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Seats
          </h1>
          <div className="text-lg text-gray-600 dark:text-gray-300">
            <p className="mb-2">{reservationData.movie} • {reservationData.experience}</p>
            <p>{reservationData.date} • {reservationData.time}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
            >
              <div className="mb-8">
                <div className="flex justify-center gap-8 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-400 rounded-lg border-2 border-yellow-500 flex items-center justify-center">
                      <IconCrown className="w-4 h-4 text-gray-800" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Balcony - LKR {reservationData.experience === "IMAX" ? "3,600" : reservationData.experience === "3D" ? "2,100" : "1,200"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                      <IconArmchair className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Ground - LKR {reservationData.experience === "IMAX" ? "3,400" : reservationData.experience === "3D" ? "1,800" : "800"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
                      <IconX className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Taken</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                      <IconCheck className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Selected</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {Array.from({ length: rows }, (_, rowIndex) => (
                  <motion.div
                    key={rowIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: rowIndex * 0.1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <div className="w-8 flex justify-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {String.fromCharCode(65 + rowIndex)}
                      </span>
                    </div>
                    {Array.from({ length: cols }, (_, colIndex) => {
                      const seatIndex = rowIndex * cols + colIndex;
                      const seat = seats[seatIndex];
                      
                      if (!seat) return null;
                      
                      return (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={seat.isReserved}
                          className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-sm font-medium transform hover:scale-105 disabled:hover:scale-100 ${getSeatColor(seat)}`}
                        >
                          {getSeatIcon(seat)}
                        </button>
                      );
                    })}
                    <div className="w-8 flex justify-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {String.fromCharCode(65 + rowIndex)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="relative">
                <div className="w-full h-6 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 dark:from-gray-600 dark:via-gray-400 dark:to-gray-600 rounded-full shadow-lg"></div>
                <div className="absolute top-0 w-full text-center">
                  <p className="text-sm font-medium pt-1 text-white">SCREEN</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Booking Summary
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Movie:</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right">
                    {reservationData.movie}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Date & Time:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {reservationData.date} {reservationData.time}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {reservationData.experience}
                  </span>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Selected Seats ({selectedSeats.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedSeats.map((seat) => (
                      <div key={seat.id} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {seat.id} ({seat.type})
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          LKR {seat.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                  <span>Total:</span>
                  <span>LKR {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/reserve/showtime")}
                  className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <IconArrowLeft className="w-5 h-5" />
                  <span>Back to Showtimes</span>
                </button>
                
                <button
                  onClick={handleProceedToCheckout}
                  disabled={totalPrice === 0 || loading}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    totalPrice === 0 || loading
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue to Payment</span>
                      <IconArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
