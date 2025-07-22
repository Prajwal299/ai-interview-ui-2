# AI Interview Screener - React Frontend

A professional React application for AI-powered interview screening with a modern black and white design.

## 🚀 Features

- **Authentication System**: JWT-based login/register with local token storage
- **Professional UI**: Clean black and white design system using shadcn/ui
- **Campaign Management**: Create and manage interview screening campaigns
- **Backend Integration**: Ready-to-connect with Flask API endpoints
- **Responsive Design**: Mobile-first responsive interface
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom client
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── Layout.tsx            # Main app layout with navigation
│   └── ProtectedRoute.tsx    # Route protection component
├── contexts/
│   └── AuthContext.tsx       # Authentication state management
├── lib/
│   ├── api.ts               # API client for Flask backend
│   ├── auth.ts              # Authentication utilities
│   └── utils.ts             # General utilities
├── pages/
│   ├── Login.tsx            # Login page
│   ├── Register.tsx         # Registration page
│   ├── Dashboard.tsx        # Main dashboard
│   ├── CreateCampaign.tsx   # Campaign creation
│   └── NotFound.tsx         # 404 page
└── hooks/                   # Custom React hooks
```

## 🔧 Backend API Integration

The app is configured to work with your Flask backend. The API client includes endpoints for:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Campaigns
- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns/<id>` - Get campaign details
- `PUT /api/campaigns/<id>` - Update campaign
- `DELETE /api/campaigns/<id>` - Delete campaign
- `POST /api/campaigns/<id>/candidates` - Upload candidates
- `POST /api/campaigns/<id>/start` - Start campaign

### Voice/Interview
- `POST /api/voice/call_handler` - Handle voice calls
- `POST /api/voice/recording_handler` - Handle recordings
- `GET /api/campaigns/<id>/results` - Get campaign results

## ⚙️ Setup & Configuration

1. **Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```bash
   VITE_API_URL=http://13.203.2.67:5000/api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🎨 Design System

The app uses a professional black and white color scheme with:
- **Primary**: Pure black for main actions and text
- **Secondary**: Light gray for secondary elements
- **Background**: White with subtle gray cards
- **Accent**: Strategic use of success/warning colors for status
- **Typography**: Clean, professional font hierarchy

## 🔐 Authentication Flow

1. **Token Storage**: JWT tokens stored in localStorage
2. **Auto-redirect**: Unauthenticated users redirected to login
3. **Protected Routes**: Dashboard and app features require authentication
4. **Token Validation**: Automatic logout on 401 responses

## 📱 Key Components

### AuthContext
Manages authentication state and provides login/logout functionality.

### API Client
Centralized HTTP client with automatic token handling and error management.

### Protected Routes
Ensures only authenticated users can access the main application.

### Layout Component
Provides consistent navigation and user menu across the app.

## 🚀 Deployment

This React app can be deployed on any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Your preferred hosting platform

Make sure to update the `VITE_API_URL` environment variable to point to your production Flask backend.

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Backend Integration Notes

- The Flask backend should return JWT tokens in the response
- CORS should be configured to allow requests from the frontend origin
- API responses should include proper error messages for user feedback
- File uploads (CSV) should be handled as FormData
