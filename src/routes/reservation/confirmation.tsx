import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useReservation } from "@/contexts/ReservationContext";
import { generateQRCodeSVG } from "@/lib/qrcode";
import { toast } from "react-hot-toast";
import {
  IconCheck,
  IconDownload,
  IconShare,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconTicket,
  IconMovie,
  IconStar,
  IconHome,
  IconQrcode,
} from "@tabler/icons-react";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { state, resetReservation } = useReservation();
  const { reservationData } = state;
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    if (!reservationData.reservationId) {
      toast.error("No booking found");
      navigate("/reserve/showtime");
      return;
    }

    const qrData = `STREAMLINE-CINEMA|${reservationData.reservationId}|${reservationData.movie}|${reservationData.date}|${reservationData.time}|${reservationData.seats.map(s => s.id).join(',')}`;
    setQrCode(generateQRCodeSVG(qrData, 200));
  }, [reservationData, navigate]);

  const handleDownloadTicket = () => {
    const ticketData = {
      reservationId: reservationData.reservationId,
      movie: reservationData.movie,
      date: reservationData.date,
      time: reservationData.time,
      seats: reservationData.seats.map(s => s.id),
      experience: reservationData.experience,
      totalPrice: reservationData.totalPrice,
      userEmail: reservationData.userEmail,
    };
    
    const dataStr = JSON.stringify(ticketData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${reservationData.reservationId}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success("Ticket downloaded successfully!");
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Movie Ticket - Streamline Cinemas',
      text: `I just booked tickets for ${reservationData.movie}! 🎬\nDate: ${reservationData.date}\nTime: ${reservationData.time}\nSeats: ${reservationData.seats.map(s => s.id).join(', ')}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareData.text);
      toast.success("Copied to clipboard!");
    }
  };

  const handleNewBooking = () => {
    resetReservation();
    navigate("/reserve/showtime");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!reservationData.reservationId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 py-48 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <IconCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your movie tickets have been successfully booked
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Digital Ticket</h2>
                    <p className="text-blue-100">Streamline Cinemas</p>
                  </div>
                  <IconTicket className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <IconMovie className="w-6 h-6 text-blue-600" />
                        <span>Movie Details</span>
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Movie:</span>
                          <span className="font-medium text-gray-900 dark:text-white text-right">
                            {reservationData.movie}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                          <span className="font-medium text-gray-900 dark:text-white flex items-center space-x-1">
                            <IconStar className="w-4 h-4 text-yellow-500" />
                            <span>{reservationData.experience}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <IconCalendar className="w-6 h-6 text-green-600" />
                        <span>Show Details</span>
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Date:</span>
                          <span className="font-medium text-gray-900 dark:text-white text-right">
                            {formatDate(reservationData.date)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Time:</span>
                          <span className="font-medium text-gray-900 dark:text-white flex items-center space-x-1">
                            <IconClock className="w-4 h-4 text-purple-600" />
                            <span>{reservationData.time}</span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Theater:</span>
                          <span className="font-medium text-gray-900 dark:text-white flex items-center space-x-1">
                            <IconMapPin className="w-4 h-4 text-red-600" />
                            <span>Screen 1</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Seat Information
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Seats:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {reservationData.seats.map(seat => seat.id).join(", ")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Seats:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {reservationData.seats.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center space-x-2">
                        <IconQrcode className="w-6 h-6 text-indigo-600" />
                        <span>Your Ticket QR</span>
                      </h3>
                      
                      <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        {qrCode && (
                          <img
                            src={qrCode}
                            alt="Booking QR Code"
                            className="w-48 h-48 mx-auto"
                          />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 max-w-xs">
                        📱 Scan this QR code at the movie hall entrance
                      </p>
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Booking ID
                      </p>
                      <p className="text-lg font-mono bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg text-gray-900 dark:text-white">
                        {reservationData.reservationId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount Paid</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        LKR {reservationData.totalPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Booked for</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {reservationData.userEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleDownloadTicket}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <IconDownload className="w-5 h-5" />
                  <span>Download Ticket</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <IconShare className="w-5 h-5" />
                  <span>Share Booking</span>
                </button>

                <button
                  onClick={handleNewBooking}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <IconTicket className="w-5 h-5" />
                  <span>Book Another Movie</span>
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <IconHome className="w-5 h-5" />
                  <span>Back to Home</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Important Notes
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Please arrive 15 minutes before showtime</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Show your QR code at the entrance</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>No outside food or beverages allowed</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>For any queries, contact support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
  