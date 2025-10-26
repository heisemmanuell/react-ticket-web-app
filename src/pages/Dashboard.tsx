import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, 
  X, 
  LogOut, 
  Ticket, 
  CheckCircle, 
  Clock, 
  PlusCircle,
  XCircle,
  BarChart3,
  ArrowRight } from 'lucide-react';

interface Ticket {
  id: string;
  eventName: string;
  eventDate: string;
  ticketType: string;
  price: number;
  status: 'open' | 'in_progress' | 'closed';
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load tickets from localStorage
    const storedTickets = localStorage.getItem(`tickets_${user?.id}`);
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    } else {
      // Sample data for demonstration with updated status values
      setTickets([]);
    }
  }, [user?.id]);

  const handleLogout = () => {
    logout();
  };

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
  const inProgressTickets = tickets.filter(ticket => ticket.status === 'in_progress').length;
  const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Ticket Web App</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/dashboard" 
                className="text-gray-900 font-medium hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/tickets" 
                className="text-gray-700 font-medium hover:text-indigo-600 transition-colors"
              >
                Tickets
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 animate-fadeIn">
              <nav className="flex flex-col space-y-3">
                <Link 
                  to="/dashboard" 
                  className="text-gray-900 font-medium hover:text-indigo-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/tickets" 
                  className="text-gray-700 font-medium hover:text-indigo-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tickets
                </Link>
                <div className="py-2 border-t border-gray-200">                
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <span className="text-gray-700">Welcome back, {user?.name}! 👋</span>            
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 pt-5 pb-5">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                      <Ticket className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
                      <dd className="text-2xl font-bold text-gray-900">{totalTickets}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 pt-5 pb-5">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Open</dt>
                      <dd className="text-2xl font-bold text-green-600">{openTickets}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 pt-5 pb-5">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                      <dd className="text-2xl font-bold text-amber-600">{inProgressTickets}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 pt-5 pb-5">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                      <X className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Closed</dt>
                      <dd className="text-2xl font-bold text-gray-600">{closedTickets}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className='mb-5'/>
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 col-span-full">
              Quick Actions
            </h2>

            {/* --- Create New Ticket --- */}
            <Link
              to="/tickets"
              className="bg-white hover:bg-gray-200 transition shadow-lg rounded-xl border border-gray-200 p-6 flex items-start gap-4 "
            >
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <PlusCircle className="h-7 w-7 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Create New Ticket
                </h3>
                <p className="text-gray-600 text-sm">
                  Set up a new ticket or request
                </p>
              </div>
            </Link>

            {/* --- Manage Tickets --- */}
            <Link
              to="/tickets"
              className="bg-white hover:bg-gray-200 transition shadow-lg rounded-xl border border-gray-200 p-6 flex items-start gap-4"
            >
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Ticket className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Manage Tickets
                </h3>
                <p className="text-gray-600 text-sm">
                  View and manage all your ticket sales
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;