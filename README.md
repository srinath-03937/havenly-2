# Havenly-  A Digital Hostel Management System

A complete, production-ready hostel and paying guest (PG) management system built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with Google Gemini AI for intelligent features.

## 🎯 Features

### Admin Features
- **Dashboard**: Overview of occupancy, complaints, revenue, and pending dues
- **AI Facility Insights**: Gemini AI-powered executive summary of hostel metrics
- **Room Management**: Create, edit, delete rooms with photo uploads and resident tracking
- **Complaint Management**: Track and update maintenance tickets with status progression
- **Financial Management**: 
  - View all transactions
  - View transactions by room with accordion expansion
  - Track pending dues per resident
- **Notice Board**: Publish announcements with AI-powered auto-draft feature

### Student Features
- **Dashboard**: Room details, pending dues, and quick actions
- **Payments**: View transaction history and pay dues with demo payment simulation
- **Complaints**: 
  - Lodge complaints with AI-enhanced descriptions
  - Visual 3-step progress bar (Pending → Assigned → Resolved)
  - Track complaint status
- **Notice Board**: Read admin announcements

### AI-Powered Features
- **Facility Insights**: Auto-generate executive summaries from occupancy and revenue data
- **Auto-Draft Notices**: Convert brief ideas into professional 4-sentence announcements
- **Enhance Descriptions**: Improve complaint descriptions to be professional and detailed

## 🏗️ Project Structure

```
dormflow/
├── backend/
│   ├── models/
│   │   └── index.js              # Mongoose schemas (User, Room, Complaint, Transaction, Notice)
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── admin.js              # Admin API endpoints
│   │   ├── student.js            # Student API endpoints
│   │   └── ai.js                 # Gemini AI integration
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── server.js                 # Express server setup
│   ├── package.json              # Backend dependencies
│   └── .env.example              # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx          # Authentication page with demo shortcut
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AdminRooms.jsx
    │   │   │   ├── AdminComplaints.jsx
    │   │   │   ├── AdminTransactions.jsx
    │   │   │   └── AdminNotices.jsx
    │   │   └── student/
    │   │       ├── StudentDashboard.jsx
    │   │       ├── StudentPayments.jsx
    │   │       ├── StudentComplaints.jsx
    │   │       └── StudentNotices.jsx
    │   ├── components/
    │   │   ├── Layout.jsx         # Main layout wrapper
    │   │   ├── Sidebar.jsx        # Navigation sidebar
    │   │   └── TopBar.jsx         # Top navigation bar
    │   ├── context/
    │   │   └── AuthContext.jsx    # Authentication context
    │   ├── hooks/
    │   │   └── useAuth.js         # Auth hook
    │   ├── utils/
    │   │   └── api.js             # API client with axios
    │   ├── App.jsx                # React Router setup
    │   ├── main.jsx               # React entry point
    │   └── index.css              # Tailwind styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- Google Gemini API Key

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update:
   ```
   MONGODB_URI=mongodb://localhost:27017/dormflow
   JWT_SECRET=your-secret-key-change-in-production
   PORT=5000
   GEMINI_API_KEY=your-gemini-api-key
   ```

3. **Start the server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:3000`

## 🔐 Demo Credentials

Quick demo access:
- **Email**: `sahithi@gmail.com`
- **Password**: `sahithi`
- **Role**: Admin

Click "Demo Login (Admin)" on the login page to instantly access the admin dashboard without API calls.

## 🗄️ Database Schemas

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: 'admin', 'student'),
  phone: String,
  room_id: ObjectId (ref: Room),
  hotelName: String,
  createdAt: Date
}
```

### Room
```javascript
{
  room_number: String (unique),
  wing: String,
  type: String (enum: 'Single AC', 'Shared Non-AC', 'Shared AC', 'Double AC'),
  price: Number,
  capacity: Number,
  occupancy: Number,
  photo_url: String,
  createdAt: Date
}
```

### Complaint
```javascript
{
  user_id: ObjectId (ref: User),
  category: String (enum: 'Plumbing', 'Electrical', 'Maintenance', 'Cleaning', 'Other'),
  description: String,
  status: String (enum: 'Pending', 'Assigned', 'Resolved'),
  date: Date,
  assignedTo: ObjectId (ref: User)
}
```

### Transaction
```javascript
{
  user_id: ObjectId (ref: User),
  room_id: ObjectId (ref: Room),
  amount: Number,
  status: String (enum: 'Pending', 'Paid'),
  month: String,
  date: Date,
  paidDate: Date
}
```

### Notice
```javascript
{
  title: String,
  content: String,
  date: Date,
  createdBy: ObjectId (ref: User)
}
```

## 🎨 UI/UX Features

- **Color Palette**: Slate (primary) + Indigo (accent) + White (background)
- **Responsive Design**: Mobile-first approach with hidden sidebar on mobile
- **Tailwind CSS**: Modern utility-first styling with ample whitespace
- **Lucide Icons**: Clean, professional icons throughout the app
- **Loading States**: Animated spinners and loading indicators
- **Visual Feedback**: Progress bars, status badges, and transitions

## 🔑 Key Routes

### Admin Routes
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/rooms` - All rooms with residents
- `POST /api/admin/rooms` - Create room
- `GET /api/admin/complaints` - All complaints
- `PUT /api/admin/complaints/:id` - Update complaint status
- `GET /api/admin/transactions` - All transactions
- `GET /api/admin/transactions-by-room` - Transactions grouped by room
- `POST /api/admin/notices` - Create notice
- `GET /api/admin/notices` - All notices

### Student Routes
- `GET /api/student/room` - My room details
- `GET /api/student/transactions` - My transactions
- `PUT /api/student/transactions/:id` - Pay transaction
- `POST /api/student/complaints` - Create complaint
- `GET /api/student/complaints` - My complaints
- `GET /api/student/notices` - All notices

### AI Routes
- `POST /api/ai/facility-insights` - Generate facility insights
- `POST /api/ai/draft-notice` - Auto-draft notice
- `POST /api/ai/enhance-complaint` - Enhance complaint description

## 🤖 AI Integration

Uses **Google Gemini 2.5 Flash** API for:
1. **Executive Summaries**: Analyzes occupancy, complaints, and revenue to generate 3-point insights
2. **Notice Auto-Draft**: Converts brief ideas into professional 4-sentence announcements
3. **Description Enhancement**: Improves informal complaint descriptions into professional, detailed ones

## 🔐 Security Features

- **JWT Authentication**: Token-based authentication with 30-day expiry
- **Password Hashing**: bcryptjs with salt rounds
- **Role-Based Access Control**: Separate routes and features for admin/student
- **Protected Routes**: Frontend route guards based on user roles
- **CORS Enabled**: Secure cross-origin requests

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (Sidebar hidden, single column)
- **Tablet**: 768px - 1024px (Sidebar toggleable)
- **Desktop**: > 1024px (Sidebar always visible)

## 🛠️ Tech Stack

### Frontend
- React 18 with Hooks
- Vite (fast build tool)
- React Router v6
- Tailwind CSS 3
- axios (HTTP client)
- lucide-react (icons)

### Backend
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs (password hashing)
- Google Generative AI
- CORS middleware

## 📦 Build & Deploy

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Deployment
Ensure `.env` variables are set on your hosting platform:
- MongoDB connection string
- JWT secret
- Gemini API key
- Port (default: 5000)

## 🎓 Learning Resources

This project demonstrates:
- Full-stack MERN development
- JWT authentication and authorization
- RESTful API design
- React hooks and context API
- Responsive UI design with Tailwind CSS
- AI API integration
- Database modeling with Mongoose

## 📝 Notes

- Demo credentials bypass the actual API (client-side mock)
- Payment processing is simulated with a 1.5s delay
- File uploads for photos use base64 encoding
- Notices can be auto-drafted or manually created
- All timestamps are in UTC

## 🔄 Future Enhancements

- Photo gallery for rooms
- SMS/Email notifications
- Advanced analytics dashboard
- Multiple hostel management
- Visitor management system
- Maintenance staff portal
- Real payment gateway integration
- Document upload for complaints

## 📄 License

MIT License - Feel free to use this project for learning and commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please fork and submit pull requests.

---

Built with ❤️ using MERN Stack & Google Gemini AI
