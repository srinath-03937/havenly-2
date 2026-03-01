import { useState, useEffect } from 'react';
import { Loader, Home, MapPin, Users, DollarSign, Check, X, CreditCard, Calendar } from 'lucide-react';
import { studentAPI } from '../../utils/api';

const PLACEHOLDER_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJvb208L3RleHQ+PC9zdmc+';
import { useNavigate } from 'react-router-dom';

const StudentRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRoom, setUserRoom] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [paymentPreview, setPaymentPreview] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomsAndUserData();
  }, []);

  const fetchRoomsAndUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch all available rooms (student endpoint)
      const roomsRes = await studentAPI.getRooms();
      setRooms(roomsRes.data);
      
      // Get current user's room (if any)
      try {
        const userRoomRes = await studentAPI.getRoom();
        setUserRoom(userRoomRes.data);
      } catch (error) {
        // User might not have a room assigned yet
        setUserRoom(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = async (roomId, occupied) => {
    if (occupied) {
      alert('This room is already fully occupied');
      return;
    }

    if (userRoom) {
      alert('You already have a room assigned. Please contact admin to change rooms.');
      return;
    }

    try {
      // First, get payment preview
      setBookingStatus('preview');
      const previewRes = await studentAPI.previewRoomBooking(roomId);
      setPaymentPreview(previewRes.data);
      setSelectedRoom(roomId);
      setShowPaymentModal(true);
      setBookingStatus(null);
    } catch (error) {
      console.error('Error getting payment preview:', error);
      setBookingStatus(null);
      alert('Failed to prepare booking: ' + error.response?.data?.message || error.message);
    }
  };

  const handlePaymentConfirmation = async () => {
    if (!selectedRoom) return;

    try {
      setPaymentProcessing(true);
      const response = await studentAPI.bookRoom(selectedRoom);
      
      // Show success message
      setBookingStatus('success');
      setShowPaymentModal(false);
      
      // Refresh data after a short delay
      setTimeout(() => {
        fetchRoomsAndUserData();
        setBookingStatus(null);
        setSelectedRoom(null);
        setPaymentPreview(null);
      }, 2000);
    } catch (error) {
      console.error('Error booking room:', error);
      setPaymentProcessing(false);
      alert('Failed to book room: ' + error.response?.data?.message || error.message);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedRoom(null);
    setPaymentPreview(null);
    setPaymentProcessing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-responsive">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 text-responsive">
          Available Rooms
        </h1>
        <p className="text-slate-600 text-responsive-sm">
          Browse and book your hostel room
        </p>
      </div>

      {/* Current Room Status */}
      {userRoom ? (
        <div className="card border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-3 sm:space-y-0">
            <Check className="text-green-600 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Your Current Booking</h2>
              <p className="text-slate-600 mb-4 text-responsive-sm">
                You are currently assigned to Room <span className="font-semibold">{userRoom.room_number}</span> in <span className="font-semibold">{userRoom.wing}</span> wing.
              </p>
              <button
                onClick={() => navigate('/student/payments')}
                className="btn-secondary text-sm w-full sm:w-auto"
              >
                View Room Details & Payments
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
          <p className="text-slate-700 font-semibold text-responsive-sm">
            👋 No room assigned yet. Select a room below to book!
          </p>
        </div>
      )}

      {/* Rooms Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {rooms.map((room) => {
          const isOccupied = (room.occupancy || 0) >= (room.capacity || 1);
          const isUserRoom = userRoom?.id === room.id;

          return (
            <div
              key={room.id}
              className={`card transition hover:shadow-lg ${
                isOccupied ? 'opacity-60' : ''
              } ${isUserRoom ? 'border-2 border-green-500' : ''}`}
            >
              {/* Room Image */}
              <div className="mb-4 h-32 sm:h-40 bg-slate-200 rounded-lg overflow-hidden">
                <img
                  src={(function() {
                    const url = room.photo_url;
                    console.log(`Room ${room.room_number} photo_url:`, url);
                    if (!url) return PLACEHOLDER_SVG;
                    
                    // Handle via.placeholder.com URLs by showing proper placeholder instead
                    if (url.includes('via.placeholder.com') || url.includes('picsum.photos')) {
                      return PLACEHOLDER_SVG;
                    }
                    
                    // Accept full URLs, relative server paths, and base64 data URIs
                    if (/^(https?:\/\/|data:image\/|\/)/.test(url)) return url;
                    
                    // If it's a plain filename, serve from backend uploads
                    if (/^[^/]+\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
                      const uploadsUrl = `http://localhost:5000/uploads/${url}`;
                      console.log(`Trying backend uploads URL for room ${room.room_number}:`, uploadsUrl);
                      return uploadsUrl;
                    }
                    
                    console.warn(`Invalid photo_url format for room ${room.room_number}:`, url);
                    return PLACEHOLDER_SVG;
                  })()}
                  alt={`Room ${room.room_number}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { 
                    console.error(`Failed to load image for room ${room.room_number}:`, e.currentTarget.src);
                    e.currentTarget.src = PLACEHOLDER_SVG;
                  }}
                  onLoad={(e) => { e.currentTarget.style.opacity = '1'; }}
                  style={{ opacity: '0', transition: 'opacity 0.3s' }}
                />
              </div>

              {/* Room Info */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Room {room.room_number}</h3>
                    <div className="flex items-center text-slate-600 text-sm mt-1">
                      <MapPin size={16} className="mr-1 flex-shrink-0" />
                      <span>Wing {room.wing}</span>
                    </div>
                  </div>
                  {isUserRoom && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold inline-block self-start">
                      ✓ Your Room
                    </span>
                  )}
                </div>

                {/* Room Details */}
                <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-semibold text-slate-900">{room.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-slate-600">
                      <Users size={16} className="mr-1 flex-shrink-0" />
                      Capacity:
                    </span>
                    <span className="font-semibold text-slate-900">{room.capacity} person(s)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Occupancy:</span>
                    <span className="font-semibold text-slate-900">
                      {room.occupancy || 0}/{room.capacity}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                    <span className="flex items-center text-slate-600">
                      <DollarSign size={16} className="mr-1 flex-shrink-0" />
                      Monthly:
                    </span>
                    <span className="font-bold text-indigo-600 text-lg">₹{room.price}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="text-center">
                  {isOccupied ? (
                    <div className="bg-red-50 text-red-700 py-2 px-3 rounded-lg text-sm font-semibold">
                      ❌ Fully Occupied
                    </div>
                  ) : isUserRoom ? (
                    <div className="bg-green-50 text-green-700 py-2 px-3 rounded-lg text-sm font-semibold">
                      ✓ Already Booked
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBookRoom(room.id, isOccupied)}
                      disabled={bookingStatus === 'preview' || bookingStatus === 'booking'}
                      className={`w-full btn-primary text-sm disabled:opacity-50 flex items-center justify-center space-x-2 min-h-[44px] ${
                        bookingStatus === 'preview' || bookingStatus === 'booking' ? 'cursor-not-allowed' : ''
                      }`}
                    >
                      <Home size={16} />
                      <span>
                        {bookingStatus === 'preview' ? 'Preparing...' : 
                         bookingStatus === 'booking' ? 'Booking...' : 
                         'Book & Pay'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {rooms.length === 0 && (
        <div className="card text-center py-8 sm:py-12">
          <Home className="mx-auto text-slate-400 mb-4" size={40} />
          <p className="text-slate-600 text-lg text-responsive-sm">No rooms available at the moment</p>
        </div>
      )}

      {/* Payment Confirmation Modal - Mobile Optimized */}
      {showPaymentModal && paymentPreview && (
        <div className="modal-mobile">
          <div className="modal-content-mobile">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Confirm Room Booking</h3>
              <button
                onClick={closePaymentModal}
                disabled={paymentProcessing}
                className="text-slate-400 hover:text-slate-600 disabled:opacity-50 p-1"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Room Details */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-900 mb-2">Room Details</h4>
                <div className="text-sm text-indigo-700 space-y-1">
                  <p>Room {paymentPreview.room.room_number}, Wing {paymentPreview.room.wing}</p>
                  <p>Type: {paymentPreview.room.type}</p>
                  <p>Capacity: {paymentPreview.room.capacity} person(s)</p>
                  <p>Occupancy: {paymentPreview.room.occupancy}/{paymentPreview.room.capacity}</p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Payment Details</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Amount:</span>
                    <span className="font-bold text-lg">₹{paymentPreview.payment.amount}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 flex-shrink-0" />
                    <span>{paymentPreview.payment.month}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-2">{paymentPreview.payment.description}</p>
                </div>
              </div>

              {/* Processing Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>Important:</strong> By confirming, you agree to pay the first month's rent. 
                  The payment will be processed immediately and the room will be assigned to you.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={closePaymentModal}
                disabled={paymentProcessing}
                className="btn-secondary disabled:opacity-50 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentConfirmation}
                disabled={paymentProcessing}
                className="btn-primary disabled:opacity-50 flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[44px]"
              >
                {paymentProcessing ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    <span>Pay & Book</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRooms;
