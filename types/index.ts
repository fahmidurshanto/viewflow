export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: 'Sale' | 'Rent';
  propertyType: 'Apartment' | 'House' | 'Villa' | 'Commercial' | 'Studio';
  status: 'Available' | 'Under Offer' | 'Sold/Let';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  specs: {
    bedrooms: number;
    bathrooms: number;
    areaSqFt: number;
  };
  images: string[];
  featured?: boolean;
  createdAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  stage: 'Enquiry' | 'Contacted' | 'Viewing' | 'Offer' | 'Closed';
  budget: number;
  preferredLocation: string;
  interestedProperty?: Property;
  notes?: string;
  source: 'Website' | 'Portal' | 'Referral' | 'Walk-in' | 'Direct Call';
  createdAt: string;
  updatedAt: string;
}

export interface Viewing {
  _id: string;
  property: Property;
  lead: Lead;
  scheduledDate: string;
  durationMinutes: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show';
  feedback?: {
    rating?: number;
    comments?: string;
    interestedInOffer?: boolean;
  };
  reminderSent: boolean;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  relatedLead?: Lead;
  relatedProperty?: Property;
}

export interface DashboardMetrics {
  metrics: {
    totalProperties: number;
    availableProperties: number;
    soldProperties: number;
    totalLeads: number;
    totalViewings: number;
    completedViewings: number;
    conversionRate: number;
  };
  leadsByStage: Record<string, number>;
  upcomingViewings: Viewing[];
  pendingTasks: Task[];
}

export interface ActivityLog {
  _id: string;
  user?: string;
  lead?: Lead;
  property?: Property;
  viewing?: Viewing;
  type: 'Call' | 'Email' | 'Viewing Note' | 'Stage Changed' | 'General' | 'Viewing Booked' | 'Viewing Completed' | 'Reminder Sent';
  title?: string;
  note: string;
  author?: string;
  isRead?: boolean;
  createdAt: string;
  updatedAt?: string;
}

