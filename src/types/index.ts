export type LeadStatus = 'sent' | 'unsent' | 'duplicate' | 'failed';

export type WorkingDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Broker {
  id: number;
  name: string;
  isActive: boolean;
  dailyCap: number;
  timezone: string;
  openingTime: string;
  closingTime: string;
  workingDays: WorkingDay[];
  createdAt: string;
  updatedAt: string;
  _count?: { leads: number };
}

export interface Form {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface DistributionBroker {
  id: number;
  distributionId: number;
  brokerId: number;
  percentage: number;
  isActive: boolean;
  broker: Broker;
}

export interface Distribution {
  id: number;
  name: string;
  formId: number;
  form: Form;
  distributionBrokers: DistributionBroker[];
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  ipAddress: string;
  formId: number;
  formName: string;
  brokerId: number | null;
  distributionId: number | null;
  status: LeadStatus;
  broker: { id: number; name: string } | null;
  form: { id: number; name: string; slug: string };
  createdAt: string;
  updatedAt: string;
}

export interface LeadStats {
  total: number;
  sent: number;
  unsent: number;
  duplicate: number;
  failed: number;
}

export interface ApiError {
  error?: string;
  message?: string;
  errors?: { msg: string; param: string }[];
}
