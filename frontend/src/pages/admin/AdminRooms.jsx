import { useState, useEffect } from 'react';
import { Plus, Loader, Trash2, Edit2, Upload } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    room_number: '',
    wing: '',
    type: 'Single AC',
    price: '',
    capacity: '',
    photo_url: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('room_number', formData.room_number);
      formDataToSend.append('wing', formData.wing);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('capacity', formData.capacity);
      
      // Add photo file if selected
      if (photoFile) {
        formDataToSend.append('photo', photoFile);
        console.log('Uploading photo:', photoFile.name);
      }
      
      await adminAPI.createRoom(formDataToSend);
      
      setFormData({
        room_number: '',
        wing: '',
        type: 'Single AC',
        price: '',
        capacity: '',
        photo_url: ''
      });
      setPhotoFile(null);
      setShowForm(false);
      await fetchRooms();
    } catch (error) {
      alert('Error creating room: ' + error.message);
      console.error('Room creation error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this room?')) {
      try {
        await adminAPI.deleteRoom(id);
        await fetchRooms();
      } catch (error) {
        alert('Error deleting room: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Room Management</h1>
          <p className="text-slate-600 mt-2">Manage hostel rooms and occupancy</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Room</span>
        </button>
      </div>

      {/* Add Room Form */}
      {showForm && (
        <div className="card border-2 border-indigo-200 bg-indigo-50">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Add New Room</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Room Number *</label>
                <input
                  type="text"
                  value={formData.room_number}
                  onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                  placeholder="101"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Wing *</label>
                <input
                  type="text"
                  value={formData.wing}
                  onChange={(e) => setFormData({ ...formData, wing: e.target.value })}
                  placeholder="A"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Room Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="Single AC">Single AC</option>
                  <option value="Shared Non-AC">Shared Non-AC</option>
                  <option value="Shared AC">Shared AC</option>
                  <option value="Double AC">Double AC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Price (₹) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="5000"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Capacity (persons) *</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="2"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Room Photo (Optional)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoFile(e.target.files[0])}
                    className="input-field flex-1"
                  />
                  {photoFile && <span className="text-sm text-green-600">✓ {photoFile.name}</span>}
                </div>
                <p className="text-xs text-slate-500 mt-1">Upload a room photo (JPG, PNG, etc. Max 5MB)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Room'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms Table */}
      <div className="card overflow-x-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">All Rooms</h2>

        {rooms.length === 0 ? (
          <p className="text-slate-600 text-center py-8">No rooms available</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Room No.</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Wing</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Occupancy</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Residents</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-900">{room.room_number}</td>
                  <td className="py-3 px-4 text-slate-600">{room.wing}</td>
                  <td className="py-3 px-4 text-slate-600">{room.type}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">₹{room.price}</td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${(room.occupancy / room.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-600 mt-1">
                      {room.occupancy}/{room.capacity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {room.residents && room.residents.length > 0 ? (
                        room.residents.map((resident, idx) => (
                          <p key={idx} className="text-xs text-slate-600">
                            {resident.name}
                          </p>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400">Empty</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600">
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminRooms;
