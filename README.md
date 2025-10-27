# Ticket Web App

A modern, responsive ticket management application built with React, TypeScript, and Tailwind CSS. Features user authentication, dashboard analytics, and complete CRUD operations for ticket management.

**Important**: This application does not come with pre-built user accounts. Users must register themselves using the signup form.

## 🚀 Features

- **User Authentication**: Secure login/signup with localStorage simulation
- **Dashboard**: Analytics overview with ticket statistics
- **Ticket Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Responsive Design**: Mobile-first approach with collapsible navigation
- **Form Validation**: Real-time validation with toast notifications
- **Protected Routes**: Route-based authentication guards

## 🛠️ Frameworks and Libraries Used

### Core Frameworks
- **React 19.1.1**: Modern React with hooks and concurrent features
- **TypeScript ~5.9.3**: Type-safe JavaScript development
- **Vite 7.1.7**: Fast build tool and development server

### UI and Styling
- **Tailwind CSS 4.1.16**: Utility-first CSS framework
- **React Hot Toast**: Beautiful toast notifications
- **Lucide-react**: For icons

### Routing and State Management
- **React Router DOM 6.x**: Client-side routing
- **React Context API**: Global state management for authentication

### Development Tools
- **ESLint 9.36.0**: Code linting and formatting
- **Vite Plugin React**: React integration for Vite

## 📋 Prerequisites

- **Node.js**: Version 16.x or higher
- **npm**: Version 7.x or higher (comes with Node.js)
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## 🏗️ Setup and Installation

### 1. Clone and Navigate
```bash
cd react-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Development Server
```bash
npm run dev
```
The application will start at `http://localhost:5173`

## 🌐 Deployment and Hosting

### Local Development
- Run `npm run dev` for hot-reloading development server
- Access at `http://localhost:5173`

### Production Build
- Run `npm run build` to create optimized production bundle
- Output will be in the `dist/` directory
- Run `npm run preview` to test production build locally

### Hosted On

#### Vercel 
- Find the app using : https://react-ticket-web-app.vercel.app/

## 📱 Usage Guide

### First Time Setup
1. Visit the application URL : https://react-ticket-web-app.vercel.app/
2. Click "Get Started" on the landing page
3. Fill out the signup form with your details
4. You'll be automatically logged in and redirected to the dashboard
5. You can go to ticket section and perform CRUD operation on tickets
6. When done, simply click on "Logout" to exit the app

### Navigation
- **Landing Page** (`/`): Marketing page with app information
- **Login** (`/auth/login`): User authentication
- **Signup** (`/auth/signup`): User registration
- **Dashboard** (`/dashboard`): Main analytics and overview (protected)
- **Ticket Management** (`/tickets`): CRUD operations for tickets (protected)

### Creating Tickets
1. Navigate to Dashboard or Ticket Management
2. Click "Create Ticket" button
3. Fill in required fields (title and status are mandatory)
4. Optional: Add description and set priority
5. Click "Create Ticket"

### Managing Tickets
- **View**: Browse tickets in card format with status filtering
- **Edit**: Click "Edit" on any ticket card
- **Delete**: Click "Delete" with confirmation dialog
- **Filter**: Use status buttons to filter tickets (All, Open, In Progress, Closed)

## 🏛️ Architecture Overview

### UI Components Structure

#### Pages
- `LandingPage`: Marketing homepage with hero section and features
- `Login`: Authentication form with validation
- `Signup`: User registration form
- `Dashboard`: Analytics dashboard with statistics cards
- `TicketManagement`: CRUD interface for tickets

#### Components
- `ProtectedRoute`: Route guard for authenticated pages
- `AuthContext`: Global authentication state provider

#### Layout
- **Header**: Navigation with responsive mobile menu
- **Main Content**: Page-specific content with max-width container (1440px)
- **Footer**: Site-wide footer (on all pages)

### State Management

#### Authentication State (`AuthContext`)
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

#### Ticket Data Structure
```typescript
interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}
```

### Data Persistence
- **Authentication**: Stored in `localStorage` with key `ticketapp_session`
- **User Accounts**: Stored in `localStorage` with key `ticketapp_users`
- **Tickets**: Stored per user with key `tickets_${userId}`

## ♿ Accessibility Features

### Implemented
- **Semantic HTML**: Proper heading hierarchy and ARIA labels
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus Management**: Visible focus indicators and logical tab order
- **Screen Reader Support**: ARIA labels and descriptive text
- **Color Contrast**: compliant color combinations
- **Responsive Design**: Works on all screen sizes and devices

### Form Accessibility
- **Field Labels**: All form inputs have associated labels
- **Error Announcements**: Form validation errors are announced to screen readers
- **Required Fields**: Clearly marked with asterisks and ARIA attributes
- **Input Types**: Appropriate input types (email, password, etc.)

## Known Issues and Limitations

### Current Limitations
1. **Data Persistence**: All data is stored in localStorage (resets on browser clear)
2. **No Backend**: Authentication and data are simulated - not production-ready
3. **Single User Session**: Only one user can be logged in per browser
4. **No Real-time Updates**: Changes don't sync across multiple tabs/windows

### Browser Compatibility
- **Supported**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Performance Notes
- **Bundle Size**: Optimized with Vite's tree-shaking
- **Images**: No images used - pure CSS icons and SVGs
- **Memory**: Minimal memory footprint for client-side operations

## 🔐 Security Notes

### Current Implementation
- **Client-side Only**: No server-side validation or security
- **localStorage**: Sensitive data stored in browser storage
- **No Encryption**: Passwords stored in plain text (demo only)

## 📞 Support

### Getting Help
- Clear localStorage if experiencing issues: `localStorage.clear()`