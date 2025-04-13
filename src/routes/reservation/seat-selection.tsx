import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type Seat = {
  id: string;
  type: "balcony" | "ground";
  price: number;
  isSelected: boolean;
  isReserved: boolean;
};

const rows = 8;
const cols = 8;

const generateSeats = (experienceType: string) => {
  const seats: Seat[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isBalcony = row < 2;
      let price = 0;

      // Adjust prices based on experience type
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
        id: `${row}-${col}`,
        type: isBalcony ? "balcony" : "ground",
        price,
        isSelected: false,
        isReserved: false,
      });
    }
  }
  return seats;
};

export default function SeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    experience: experienceType,
    reservedSeats,
  } = location.state || {};
  const [seats, setSeats] = useState<Seat[]>(
    generateSeats(experienceType || "3D")
  );
  const [totalPrice, setTotalPrice] = useState(0);

  // Mark reserved seats
  React.useEffect(() => {
    if (reservedSeats) {
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          reservedSeats.includes(seat.id) ? { ...seat, isReserved: true } : seat
        )
      );
    }
  }, [reservedSeats]);

  const handleSeatClick = (seatId: string) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId && !seat.isReserved
          ? { ...seat, isSelected: !seat.isSelected }
          : seat
      )
    );
  };

  const calculateTotalPrice = () => {
    const selectedSeats = seats.filter((seat) => seat.isSelected);
    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    setTotalPrice(total);
  };

  const handleProceedToCheckout = () => {
    const selectedSeats = seats.filter((seat) => seat.isSelected);
    const showtimeData = location.state; // Assuming data is passed from showtime-selection page
    navigate("/reserve/checkout", {
      state: { selectedSeats, totalPrice, showtimeData },
    });
  };

  React.useEffect(() => {
    calculateTotalPrice();
  }, [seats]);

  return (
    <div className="py-40 px-6 md:px-12">
      <h1 className="text-3xl font-medium mb-8 text-center text-black dark:text-white">
        Seat Selection
      </h1>
      <div className="mb-6">
        <div className="flex justify-center gap-8 border border-dotted border-zinc-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-300 rounded-md"></div>
            <span className="text-black dark:text-white">
              Balcony: Rs.
              {experienceType === "IMAX"
                ? 3600
                : experienceType === "3D"
                ? 2100
                : 1200}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white border border-gray-300 rounded-md"></div>
            <span className="text-black dark:text-white">
              Ground: Rs.
              {experienceType === "IMAX"
                ? 3400
                : experienceType === "3D"
                ? 1800
                : 800}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4 items-center justify-center">
        {seats.map((seat) => (
          <button
            key={seat.id}
            onClick={() => handleSeatClick(seat.id)}
            disabled={seat.isReserved}
            className={`p-4 rounded-md text-sm font-medium border ${
              seat.isReserved
                ? "bg-gray-400 cursor-not-allowed"
                : seat.isSelected
                ? "bg-green-500 text-white"
                : seat.type === "balcony"
                ? "bg-yellow-300"
                : "bg-white"
            } hover:shadow-md transition-all duration-200 ${
              !seat.isReserved && "hover:scale-105"
            }`}
          >
            {seat.id}
          </button>
        ))}
      </div>
      <div className="relative mt-12">
        <div className="w-full h-8 bg-zinc-700 rounded-b-full"></div>
        <div className="absolute top-0 w-full text-center">
          <p className="text-sm font-normal pt-1 text-zinc-200">Display</p>
        </div>
      </div>
      <div className="mt-8 text-center border border-dotted border-zinc-700 rounded-lg p-4">
        <p className="text-lg mb-4 text-black dark:text-white">
          Gross Amount: <span className="font-semibold">Rs.{totalPrice}</span>
        </p>
        <button
          onClick={handleProceedToCheckout}
          disabled={totalPrice === 0}
          className={`px-6 py-3 rounded-md text-white font-medium ${
            totalPrice === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-cyan-800 hover:bg-cyan-900"
          } transition-all duration-200`}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
