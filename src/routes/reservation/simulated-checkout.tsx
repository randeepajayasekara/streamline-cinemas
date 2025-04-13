import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "@/backend/firebase";

const auth = getAuth(app);
const db = getFirestore(app);

export default function CheckoutSimulation() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservationData = location.state || {
    movie: "Unknown",
    date: "Unknown",
    time: "Unknown",
    seats: [],
    experience: "Unknown",
    totalPrice: 0,
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePaymentSimulation = async () => {
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save reservation data in Firestore
      const reservationRef = doc(db, "reservations", user.uid);
      await setDoc(reservationRef, {
        ...reservationData,
        email: user.email,
        timestamp: new Date(),
      });

      // Redirect to confirmation page
      navigate("/confirmation", { state: { reservationData } });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-40 px-6 md:px-12 min-h-screen flex items-center justify-center">
      <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Simulated Checkout
        </h1>
        {reservationData ? (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Reservation Details</h2>
            <p className="text-gray-700">
              <strong>Movie:</strong> {reservationData.movie}
            </p>
            <p className="text-gray-700">
              <strong>Date:</strong> {reservationData.date}
            </p>
            <p className="text-gray-700">
              <strong>Time:</strong> {reservationData.time}
            </p>
            <p className="text-gray-700">
              <strong>Seats:</strong>{" "}
              {Array.isArray(reservationData.seats)
                ? reservationData.seats.join(", ")
                : "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Experience:</strong> {reservationData.experience}
            </p>
            <p className="text-gray-700">
              <strong>Total Price:</strong> {reservationData.totalPrice} LKR
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No reservation data found.</p>
        )}

        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePaymentSimulation();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Processing..." : "Simulate Payment"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
