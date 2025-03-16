export interface Invoice {
  id: string;
  number: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  
  // Client details
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  
  // Business details
  businessName: string;
  businessEmail: string;
  businessAddress?: string;
  businessLogo?: string;
  
  // Items
  items: InvoiceItem[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface PaymentDetails {
  method: 'stripe' | 'paypal' | 'bank_transfer';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionId?: string;
  amount: number;
  currency: string;
  date: string;
}

export interface RecurringInvoice extends Invoice {
  frequency: 'weekly' | 'monthly' | 'yearly';
  nextDueDate: string;
  endDate?: string;
  totalOccurrences?: number;
  completedOccurrences: number;
}