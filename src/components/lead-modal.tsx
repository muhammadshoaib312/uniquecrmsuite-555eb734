// Shared add/edit lead form used by the Leads list and Lead details page.
import { useEffect, useState } from "react";
import { z } from "zod";
import { Modal, Button, FormField, Input } from "@/components/ui-kit";
import { FieldError } from "@/components/form-modal";
import { required, emailField, phoneField, dateField, validate } from "@/utils/validation";
import type { Lead, LeadSource } from "@/types/models";

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"] as const;
export const LEAD_PRIORITIES = ["High", "Medium", "Low"] as const;
export const LEAD_SOURCES: LeadSource[] = ["Website", "Referral", "LinkedIn", "Cold call", "Event", "Other"];

export type LeadForm = Omit<Lead, "id" | "created">;

const EMPTY_FORM: LeadForm = {
  name: "", company: "", email: "", phone: "",
  status: "New", priority: "Medium", source: "Website", owner: "",
  notes: "", followUpDate: "", followUpTime: "", followUpNote: "", followUpDone: false,
};

const schema = z.object({
  name: required("Full name").pipe(z.string().max(100)),
  company: z.string().trim().max(100),
  email: emailField,
  phone: phoneField,
  owner: z.string().trim().max(100),
  notes: z.string().trim().max(2000).optional(),
  followUpDate: dateField.optional(),
  followUpTime: z.string().trim().refine((v) => v === "" || /^\d{2}:\d{2}$/.test(v), { message: "Enter a valid time" }).optional(),
  followUpNote: z.string().trim().max(500).optional(),
});

const selectCls = "glass h-10 w-full rounded-lg border-0 px-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]";
const areaCls = "glass w-full rounded-lg border-0 p-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]";

export function LeadModal({
  open, editing, onClose, onSave,
}: {
  open: boolean;
  editing: Lead | null;
  onClose: () => void;
  onSave: (l: LeadForm) => void;
}) {
  const [form, setForm] = useState<LeadForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    setErrors({});
    if (editing) {
      const { id: _id, created: _created, ...rest } = editing;
      setForm({ ...EMPTY_FORM, ...rest });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editing, open]);

  const set = <K extends keyof LeadForm>(k: K, v: LeadForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  function submit() {
    const res = validate(schema, form);
    if (!res.ok) { setErrors(res.errors); return; }
    if (form.followUpTime && !form.followUpDate) { setErrors({ followUpDate: "Pick a date for the follow-up time" }); return; }
    const next = { ...form, ...res.data } as LeadForm;
    // A changed follow-up date/time re-opens the follow-up.
    if (editing && (editing.followUpDate !== next.followUpDate || editing.followUpTime !== next.followUpTime)) next.followUpDone = false;
    onSave(next);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit lead" : "Add lead"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{editing ? "Save changes" : "Create lead"}</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Full name">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" />
          <FieldError name="name" errors={errors} />
        </FormField>
        <FormField label="Company">
          <Input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company" />
          <FieldError name="company" errors={errors} />
        </FormField>
        <FormField label="Email">
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@company.com" />
          <FieldError name="email" errors={errors} />
        </FormField>
        <FormField label="Phone">
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555…" />
          <FieldError name="phone" errors={errors} />
        </FormField>
        <FormField label="Status">
          <select value={form.status} onChange={(e) => set("status", e.target.value as Lead["status"])} className={selectCls}>
            {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Priority">
          <select value={form.priority} onChange={(e) => set("priority", e.target.value as Lead["priority"])} className={selectCls}>
            {LEAD_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </FormField>
        <FormField label="Source">
          <select value={form.source} onChange={(e) => set("source", e.target.value as LeadSource)} className={selectCls}>
            {LEAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Assigned owner">
          <Input value={form.owner} onChange={(e) => set("owner", e.target.value)} placeholder="Owner name" />
          <FieldError name="owner" errors={errors} />
        </FormField>
        <FormField label="Follow-up date">
          <Input type="date" value={form.followUpDate ?? ""} onChange={(e) => set("followUpDate", e.target.value)} />
          <FieldError name="followUpDate" errors={errors} />
        </FormField>
        <FormField label="Follow-up time">
          <Input type="time" value={form.followUpTime ?? ""} onChange={(e) => set("followUpTime", e.target.value)} />
          <FieldError name="followUpTime" errors={errors} />
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Follow-up note">
            <Input value={form.followUpNote ?? ""} onChange={(e) => set("followUpNote", e.target.value)} placeholder="What should happen next?" />
            <FieldError name="followUpNote" errors={errors} />
          </FormField>
        </div>
        <div className="sm:col-span-2">
          <FormField label="Notes">
            <textarea rows={3} value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} className={areaCls} placeholder="Background, needs, context…" />
            <FieldError name="notes" errors={errors} />
          </FormField>
        </div>
      </div>
    </Modal>
  );
}
