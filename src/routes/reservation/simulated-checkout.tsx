import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useReservation } from "@/contexts/ReservationContext";
import { generateReservationId } from "@/lib/qrcode";
import { toast } from "react-hot-toast";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "@/backend/firebase";
import {
  IconCreditCard,
  IconLock,
  IconMail,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
  IconLoader,
  IconCheck,
} from "@tabler/icons-react";

const auth = getAuth(app);
const db = getFirestore(app);

export default function CheckoutSimulation() {
  const navigate = useNavigate();
  const { state, completeReservation } = useReservation();
  const { reservationData } = state;
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  
  const [cardNumber, setCardNumber] = useState("4532 1234 5678 9012");
  const [expiryDate, setExpiryDate] = useState("12/26");
  const [cvv, setCvv] = useState("123");
  const [cardName, setCardName] = useState("John Doe");

  if (!reservationData.seats.length) {
    toast.error("Please select seats first");
    navigate("/reserve/seat");
    return null;
  }

  const handleAuthAndPayment = async () => {
    if (!email || !password || (isNewUser && password !== confirmPassword)) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);

    try {
      let user;
      
      if (isNewUser) {
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        toast.success("Account created successfully!");
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        toast.success("Signed in successfully!");
      }

      setPaymentStep(2);
      
      setTimeout(async () => {
        try {
          const reservationId = generateReservationId();
          const timestamp = new Date();

          const reservationRef = doc(db, "reservations", reservationId);
          await setDoc(reservationRef, {
            ...reservationData,
            reservationId,
            userEmail: user.email,
            timestamp,
            seats: reservationData.seats.map(seat => seat.id),
          });

          completeReservation({
            reservationId,
            userEmail: user.email!,
            timestamp,
          });

          setPaymentStep(3);
          
          setTimeout(() => {
            navigate("/reserve/confirmation");
          }, 2000);
          
        } catch (err: any) {
          toast.error("Payment failed. Please try again.");
          setPaymentStep(1);
        } finally {
          setLoading(false);
        }
      }, 2500);

    } catch (err: any) {
      const errorMessage = err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' 
        ? 'Invalid email or password' 
        : err.message;
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 dark:from-gray-900 dark:to-green-900 py-48 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Complete Your Booking
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Secure checkout for your movie experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
            >
              {paymentStep === 1 && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Account & Payment
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsNewUser(false)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          !isNewUser
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setIsNewUser(true)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          isNewUser
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <IconMail className="w-4 h-4" />
                        <span>Email Address</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <IconLock className="w-4 h-4" />
                        <span>Password</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {isNewUser && (
                      <div>
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <IconLock className="w-4 h-4" />
                          <span>Confirm Password</span>
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    )}

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <IconCreditCard className="w-5 h-5" />
                        <span>Payment Information (Demo)</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentStep === 2 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Processing Payment
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please wait while we secure your booking...
                  </p>
                </div>
              )}

              {paymentStep === 3 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Redirecting to your booking confirmation...
                  </p>
                </div>
              )}
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
                Order Summary
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
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Seats:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {reservationData.seats.map(seat => seat.id).join(", ")}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="space-y-2">
                  {reservationData.seats.map((seat) => (
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

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                  <span>Total:</span>
                  <span>LKR {reservationData.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {paymentStep === 1 && (
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/reserve/seat")}
                    className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <IconArrowLeft className="w-5 h-5" />
                    <span>Back to Seats</span>
                  </button>
                  
                  <button
                    onClick={handleAuthAndPayment}
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                      loading
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                    }`}
                  >
                    {loading ? (
                      <IconLoader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <IconLock className="w-5 h-5" />
                        <span>Complete Booking</span>
                      </>
                    )}
                  </button>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      🛡️ This is a simulated payment for demo purposes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
