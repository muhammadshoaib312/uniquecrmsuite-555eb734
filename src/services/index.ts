// Registry of every domain service.
// Import via `import { services } from "@/services"` so call sites read
// like a namespaced API: `services.leads.create(...)`.

import { Repository } from "@/api/repository";
import { BaseService } from "./base.service";
import type {
  Lead,
  Contact,
  Company,
  Deal,
  Task,
  Meeting,
  Quote,
  Invoice,
  Product,
  SupportTicket,
  Document,
  Activity,
} from "@/types/models";

/* Resource keys — the string is used for both the storage key suffix and
   the change-event channel. Keep these stable; UI subscribes by name. */
export const RESOURCES = {
  leads: "leads",
  contacts: "contacts",
  companies: "companies",
  deals: "deals",
  tasks: "tasks",
  meetings: "meetings",
  quotes: "quotes",
  invoices: "invoices",
  products: "products",
  tickets: "tickets",
  documents: "documents",
  activities: "activities",
} as const;

class LeadService extends BaseService<Lead> {
  constructor() {
    // Legacy key preserves data written by the older lead-store.
    super(new Repository<Lead>(RESOURCES.leads, { legacyKey: "uniquecrm-leads-added" }));
  }
}

export const services = {
  leads: new LeadService(),
  contacts: new BaseService<Contact>(new Repository(RESOURCES.contacts)),
  companies: new BaseService<Company>(new Repository(RESOURCES.companies)),
  deals: new BaseService<Deal>(new Repository(RESOURCES.deals)),
  tasks: new BaseService<Task>(new Repository(RESOURCES.tasks)),
  meetings: new BaseService<Meeting>(new Repository(RESOURCES.meetings)),
  quotes: new BaseService<Quote>(new Repository(RESOURCES.quotes)),
  invoices: new BaseService<Invoice>(new Repository(RESOURCES.invoices)),
  products: new BaseService<Product>(new Repository(RESOURCES.products)),
  tickets: new BaseService<SupportTicket>(new Repository(RESOURCES.tickets)),
  documents: new BaseService<Document>(new Repository(RESOURCES.documents)),
  activities: new BaseService<Activity>(new Repository(RESOURCES.activities)),
};

export type Services = typeof services;
