// Canonical domain models for UniqueCRM.
// Every module imports its shapes from here so we have a single source
// of truth ready for FastAPI schema alignment.

export type ID = string;
export type ISODate = string;

/* -------- Foundational -------- */
export interface User {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: "Admin" | "Manager" | "Member" | "Viewer";
}

export interface Workspace {
  id: ID;
  name: string;
  plan?: "Free" | "Pro" | "Enterprise";
  createdAt?: ISODate;
}

/* -------- Enums -------- */
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Proposal" | "Won" | "Lost";
export type LeadSource = "Website" | "Referral" | "LinkedIn" | "Cold call" | "Event" | "Other";
export type Priority = "High" | "Medium" | "Low";
export type DealStage = "New" | "Qualified" | "Proposal" | "Negotiation" | "Won" | "Lost";
export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Overdue";
export type QuoteStatus = "Draft" | "Sent" | "Accepted" | "Rejected";
export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";
export type TicketStatus = "Open" | "Pending" | "Resolved" | "Closed";
export type MeetingStatus = "Scheduled" | "Completed" | "Cancelled";

/* -------- CRM records -------- */
export interface Lead {
  id: ID;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  priority: Priority;
  source: LeadSource;
  owner: string;
  created: string;
}

export interface Contact {
  id: ID;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  tags: string[];
  tone?: number;
}

export interface Company {
  id: ID;
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  employees: number;
  revenue: string;
  manager: string;
  tone: number;
}

export interface Deal {
  id: ID;
  title: string;
  company: string;
  value: number;
  stage: DealStage;
  priority: Priority;
  due: string;
  owner?: string;
}

export interface Task {
  id: ID;
  title: string;
  status: TaskStatus;
  priority: Priority;
  due: string;
  assignee?: string;
  related?: string;
}

export interface Meeting {
  id: ID;
  title: string;
  with: string;
  date: string;
  time: string;
  status: MeetingStatus;
  location?: string;
}

export interface Activity {
  id: ID;
  type: "note" | "call" | "email" | "meeting" | "task" | "system";
  title: string;
  createdAt: ISODate;
  related?: string;
  actor?: string;
}

export interface Quote {
  id: ID;
  number: string;
  client: string;
  amount: number;
  status: QuoteStatus;
  expires: string;
}

export interface Invoice {
  id: ID;
  number: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
  due: string;
}

export interface Product {
  id: ID;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category?: string;
}

export interface SupportTicket {
  id: ID;
  subject: string;
  requester: string;
  priority: Priority;
  status: TicketStatus;
  created: string;
}

export interface Document {
  id: ID;
  name: string;
  type: string;
  size: string;
  owner: string;
  updated: string;
}
