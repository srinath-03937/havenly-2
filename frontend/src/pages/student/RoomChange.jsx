import { useState, useEffect } from 'react';
import { Loader, ArrowRightLeft, Home, AlertCircle, Check } from 'lucide-react';
import { studentAPI } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

const RoomChange = () => {
  const { user } = useAuth();
  const [currentRoom, setCurrentRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [changeRequests, setChangeRequests] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomRes, roomsRes] = await Promise.all([
        studentAPI.getRoom(),
        studentAPI.getRooms()
      ]);

      setCurrentRoom(roomRes.data);
      setAvailableRooms(roomsRes.data.filter(room => 
        room.id !== roomRes.data?.id && 
        (room.occupancy || 0) < (room.capacity || 1)
      ));
      
      // Try to get room change requests, but handle if API doesn't exist yet
      try {
        const requestsRes = await studentAPI.getRoomChangeRequests();
        setChangeRequests(requestsRes.data || []);
      } catch (requestError) {
        console.log('Room change requests API not available yet');
        setChangeRequests([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedRoom) {
      alert('Please select a room');
      return;
    }

    try {
      setSubmitting(true);
      await studentAPI.requestRoomChange({
        current_room_id: currentRoom.id,
        requested_room_id: selectedRoom.id,
        reason: document.getElementById('change-reason').value
      });
      
      alert('Room change request submitted successfully!');
      setShowForm(false);
      setSelectedRoom(null);
      document.getElementById('change-reason').value = '';
      await fetchData();
    } catch (error) {
      alert('Error submitting request: ' + error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!currentRoom) {
    return (
      <div className="card text-center py-12">
        <Home className="mx-auto text-slate-400 mb-4" size={48} />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Room Assigned</h3>
        <p className="text-slate-600">You need to book a room first before requesting a change.</p>
      </div>
    );
  }

  return (
    <div className="space-y-responsive">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 text-responsive">
          Room Change
        </h1>
        <p className="text-slate-600 text-responsive-sm">
          Request a room change or view your change requests
        </p>
      </div>

      {/* Current Room */}
      <div className="card border-2 border-blue-200 bg-blue-50">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Current Room</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-600">Room Number</p>
            <p className="font-semibold text-slate-900">{currentRoom.room_number}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Type</p>
            <p className="font-semibold text-slate-900">{currentRoom.type}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Monthly Rent</p>
            <p className="font-semibold text-slate-900">₹{currentRoom.price}</p>
          </div>
        </div>
      </div>

      {/* Active Requests */}
      {changeRequests.length > 0 && (
        <div className="card border-2 border-amber-200 bg-amber-50">
          <h2 className="text-xl font-bold text-amber-900 mb-4">Active Change Requests</h2>
          <div className="space-y-3">
            {changeRequests.map((request) => (
              <div key={request.id} className="p-4 bg-white rounded-lg border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      Request to change to Room {request.requested_room?.room_number}
                    </p>
                    <p className="text-sm text-slate-600">
                      Status: <span className={`font-medium ${
                        request.status === 'Pending' ? 'text-amber-600' :
                        request.status === 'Approved' ? 'text-green-600' :
                        request.status === 'Rejected' ? 'text-red-600' : 'text-slate-600'
                      }`}>{request.status}</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      Applied: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {request.status === 'Approved' && (
                    <Check className="text-green-600" size={24} />
                  )}
                  {request.status === 'Rejected' && (
                    <AlertCircle className="text-red-600" size={24} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Room Change Request Form */}
      {!showForm && availableRooms.length > 0 && changeRequests.filter(r => r.status === 'Pending').length === 0 && (
        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <ArrowRightLeft size={20} />
            <span>Request Room Change</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="card border-2 border-indigo-200 bg-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900 mb-6">Request Room Change</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select New Room</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedRoom?.id === room.id
                        ? 'border-indigo-500 bg-indigo-100'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-slate-900">Room {room.room_number}</p>
                        <p className="text-sm text-slate-600">{room.type}</p>
                        <p className="text-xs text-slate-500">
                          {room.occupancy || 0}/{room.capacity || 1} occupied
                        </p>
                      </div>
                      <p className="font-bold text-indigo-600">₹{room.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Change *</label>
              <textarea
                id="change-reason"
                placeholder="Please explain why you want to change rooms..."
                className="input-field h-24"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSubmitRequest}
                disabled={submitting || !selectedRoom}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <ArrowRightLeft size={16} />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedRoom(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {availableRooms.length === 0 && (
        <div className="card text-center py-8">
          <Home className="mx-auto text-slate-400 mb-4" size={40} />
          <p className="text-slate-600">No other rooms are currently available for change.</p>
        </div>
      )}
    </div>
  );
};

export default RoomChange;
