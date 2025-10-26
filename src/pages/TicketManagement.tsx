import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, LogOut, AlertCircle, XIcon } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

interface TicketFormData {
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
}

const TicketManagement: React.FC = () => {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'closed'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadTickets();
  }, [user?.id]);

  const loadTickets = () => {
    try {
      const storedTickets = localStorage.getItem(`tickets_${user?.id}`);
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets));
      } else {
       setTickets([]);
      }
    } catch (error) {
      toast.error('Failed to load tickets. Please retry.');
    }
  };

  const saveTickets = (updatedTickets: Ticket[]) => {
    try {
      localStorage.setItem(`tickets_${user?.id}`, JSON.stringify(updatedTickets));
      setTickets(updatedTickets);
    } catch (error) {
      toast.error('Failed to save tickets. Please try again.');
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    if (!['open', 'in_progress', 'closed'].includes(formData.status)) {
      errors.status = 'Invalid status value';
    }

    if (!['low', 'medium', 'high'].includes(formData.priority)) {
      errors.priority = 'Invalid priority value';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
    });
    setFormErrors({});
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const newTicket: Ticket = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        priority: formData.priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedTickets = [...tickets, newTicket];
      saveTickets(updatedTickets);

      toast.success('Ticket created successfully!');
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description || '',
      status: ticket.status,
      priority: ticket.priority || 'medium',
    });
    setFormErrors({});
  };

  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !editingTicket) {
      return;
    }

    setIsLoading(true);

    try {
      const updatedTicket: Ticket = {
        ...editingTicket,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        priority: formData.priority,
        updatedAt: new Date().toISOString(),
      };

      const updatedTickets = tickets.map(ticket =>
        ticket.id === editingTicket.id ? updatedTicket : ticket
      );
      saveTickets(updatedTickets);

      toast.success('Ticket updated successfully!');
      setEditingTicket(null);
      resetForm();
    } catch (error) {
      toast.error('Failed to update ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
      saveTickets(updatedTickets);
      toast.success('Ticket deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete ticket. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-[1440] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Ticket Web App</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="text-gray-700 font-medium hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/tickets" 
                className="text-gray-900 font-medium hover:text-indigo-600 transition-colors"
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
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-4 pt-3 pb-4 flex flex-col space-y-2">
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 font-medium hover:text-indigo-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/tickets" 
                  className="text-gray-900 font-medium hover:text-indigo-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tickets
                </Link>              
                {/* <button
                  onClick={() => {
                    setIsCreateModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-green-600 hover:text-green-800 hover:bg-gray-50 rounded-md"
                >
                  Create Ticket
                </button> */}
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440] mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">         
          {/* Filter Buttons */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {(['all', 'open', 'in_progress', 'closed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition duration-300 ${
                      filter === status
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Create Ticket*/}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 self-start sm:self-auto"
              >
                Create Ticket
              </button>
            </div>
          </div>

          {/* Tickets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={30} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                <p className="text-gray-500 mb-4">No tickets match the selected filter.</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
                >
                  Create Your First Ticket
                </button>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition duration-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {ticket.title}
                        </h3>
                        {ticket.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                            {ticket.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(ticket.status)}`}>
                        Status: {ticket.status.replace('_', ' ')}
                      </span>
                      {ticket.priority && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                          Priority: {ticket.priority}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                      {ticket.updatedAt !== ticket.createdAt && (
                        <span className="ml-2">
                          • Updated: {new Date(ticket.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTicket(ticket)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingTicket) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTicket ? 'Edit Ticket' : 'Create New Ticket'}
                </h2>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingTicket(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >                  
                  <XIcon size={24} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={editingTicket ? handleUpdateTicket : handleCreateTicket} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter ticket title"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter ticket description (optional)"
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Ticket['status'] })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.status ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                  {formErrors.status && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.status}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      formErrors.priority ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  {formErrors.priority && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.priority}</p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingTicket(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : (editingTicket ? 'Update Ticket' : 'Create Ticket')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManagement;
