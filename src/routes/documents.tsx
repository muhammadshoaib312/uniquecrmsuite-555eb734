import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, FileText, Download, Trash2, Search } from "lucide-react";
import { PageHeader, GlassCard, Badge } from "@/components/crm-ui";
import { Modal, Button, FormField, Input } from "@/components/ui-kit";
import { useRecordStore } from "@/lib/record-store";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — UniqueCRM" },
      { name: "description", content: "Contracts, proposals, and shared files." },
    ],
  }),
  component: DocumentsPage,
});

type Doc = { id: string; name: string; type: string; size: string; owner: string; related: string; created: string };

const SEED: Doc[] = [
  { id: "s1", name: "Acme MSA v3.pdf", type: "PDF", size: "482 KB", owner: "Ava Chen", related: "Acme Corp", created: "Jul 12, 2026" },
  { id: "s2", name: "Northwind proposal.docx", type: "DOCX", size: "128 KB", owner: "Marcus Kim", related: "Northwind", created: "Jul 14, 2026" },
  { id: "s3", name: "Globex pricing.xlsx", type: "XLSX", size: "94 KB", owner: "Priya Nair", related: "Globex", created: "Jul 15, 2026" },
  { id: "s4", name: "Stark SOC2 report.pdf", type: "PDF", size: "1.2 MB", owner: "Diego Alvarez", related: "Stark Industries", created: "Jul 16, 2026" },
];

type Form = Omit<Doc, "id" | "created">;
const EMPTY: Form = { name: "", type: "PDF", size: "0 KB", owner: "You", related: "" };

function DocumentsPage() {
  const { items: added, add, remove } = useRecordStore<Doc>("documents");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [q, setQ] = useState("");

  const combined = [...added, ...SEED];
  const filtered = combined.filter((d) =>
    !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.related.toLowerCase().includes(q.toLowerCase()),
  );
  const addedIds = new Set(added.map((d) => d.id));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Documents"
        subtitle={`${combined.length} files across your accounts`}
        actions={
          <button
            onClick={() => { setForm(EMPTY); setOpen(true); }}
            className="gradient-brand-bg glow-shadow-sm inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            Upload
          </button>
        }
      />

      <GlassCard>
        <div className="relative mb-4 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search documents…"
            className="glass h-10 w-full rounded-lg border-0 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Type</th>
                <th className="pb-3 pr-4 font-medium">Related</th>
                <th className="pb-3 pr-4 font-medium">Owner</th>
                <th className="pb-3 pr-4 font-medium">Size</th>
                <th className="pb-3 pr-4 font-medium">Created</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-t border-white/5">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[color:var(--brand-pink)]" />
                      <span className="font-medium">{d.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4"><Badge tone="default">{d.type}</Badge></td>
                  <td className="py-3 pr-4 text-muted-foreground">{d.related}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{d.owner}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{d.size}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{d.created}</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      {addedIds.has(d.id) && (
                        <button
                          onClick={() => confirm("Delete this document?") && remove(d.id)}
                          className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-rose-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">No documents match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Upload document"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!form.name) return;
                const created = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
                add({ ...form, created });
                setOpen(false);
              }}
            >Save</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="File name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="proposal.pdf" /></FormField>
          <FormField label="Type"><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="PDF" /></FormField>
          <FormField label="Related record"><Input value={form.related} onChange={(e) => setForm({ ...form, related: e.target.value })} placeholder="Acme Corp" /></FormField>
          <FormField label="Owner"><Input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} /></FormField>
          <FormField label="Size"><Input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="420 KB" /></FormField>
        </div>
      </Modal>
    </div>
  );
}
