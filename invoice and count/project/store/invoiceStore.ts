import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Invoice, RecurringInvoice } from '@/types/invoice';

interface InvoiceStore {
  invoices: Invoice[];
  recurringInvoices: RecurringInvoice[];
  businessProfile: {
    name: string;
    email: string;
    address?: string;
    logo?: string;
    taxNumber?: string;
  };
  settings: {
    defaultCurrency: string;
    defaultPaymentTerms: number;
    defaultTaxRate: number;
    automaticReminders: boolean;
    reminderDays: number[];
  };
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  addRecurringInvoice: (invoice: RecurringInvoice) => void;
  updateBusinessProfile: (profile: Partial<InvoiceStore['businessProfile']>) => void;
  updateSettings: (settings: Partial<InvoiceStore['settings']>) => void;
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set) => ({
      invoices: [],
      recurringInvoices: [],
      businessProfile: {
        name: '',
        email: '',
      },
      settings: {
        defaultCurrency: 'USD',
        defaultPaymentTerms: 30,
        defaultTaxRate: 0,
        automaticReminders: true,
        reminderDays: [7, 3, 1],
      },
      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [invoice, ...state.invoices],
        })),
      updateInvoice: (id, updatedInvoice) =>
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
          ),
        })),
      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id),
        })),
      addRecurringInvoice: (invoice) =>
        set((state) => ({
          recurringInvoices: [invoice, ...state.recurringInvoices],
        })),
      updateBusinessProfile: (profile) =>
        set((state) => ({
          businessProfile: { ...state.businessProfile, ...profile },
        })),
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
    }),
    {
      name: 'invoice-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);