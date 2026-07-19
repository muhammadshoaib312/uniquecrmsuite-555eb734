import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Package, Trash2, Pencil, Search } from "lucide-react";
import { PageHeader, GlassCard, Badge, StatCard } from "@/components/crm-ui";
import { Modal, Button, FormField, Input } from "@/components/ui-kit";
import { useRecordStore } from "@/lib/record-store";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — UniqueCRM" },
      { name: "description", content: "Product catalog, pricing, and inventory." },
    ],
  }),
  component: ProductsPage,
});

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Draft" | "Archived";
};

const SEED: Product[] = [
  { id: "s1", name: "UniqueCRM Starter", sku: "UCM-STR", category: "Plan", price: 29, stock: 999, status: "Active" },
  { id: "s2", name: "UniqueCRM Growth", sku: "UCM-GRW", category: "Plan", price: 79, stock: 999, status: "Active" },
  { id: "s3", name: "Onboarding — 4 week", sku: "SVC-ONB", category: "Service", price: 2400, stock: 20, status: "Active" },
  { id: "s4", name: "White-glove migration", sku: "SVC-MIG", category: "Service", price: 6800, stock: 8, status: "Draft" },
];

const tone: Record<Product["status"], "brand" | "info" | "default"> = { Active: "brand", Draft: "info", Archived: "default" };
type Form = Omit<Product, "id">;
const EMPTY: Form = { name: "", sku: "", category: "Plan", price: 0, stock: 0, status: "Active" };

function ProductsPage() {
  const { items: added, add, update, remove } = useRecordStore<Product>("products");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);

  const combined = [...added, ...SEED];
  const addedIds = new Set(added.map((p) => p.id));
  const filtered = combined.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()));

  function save() {
    if (!form.name) return;
    if (editing) update(editing.id, form as Partial<Product>);
    else add(form);
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Products"
        subtitle={`${combined.length} SKUs in your catalog`}
        actions={
          <button
            onClick={() => { setEditing(null); setForm(EMPTY); setOpen(true); }}
            className="gradient-brand-bg glow-shadow-sm inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" /> New product
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total SKUs" value={String(combined.length)} />
        <StatCard label="Active" value={String(combined.filter((p) => p.status === "Active").length)} />
        <StatCard label="Catalog value" value={`$${combined.reduce((a, p) => a + p.price * p.stock, 0).toLocaleString()}`} />
      </div>

      <GlassCard className="mt-6">
        <div className="relative mb-4 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="glass h-10 w-full rounded-lg border-0 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Product</th>
                <th className="pb-3 pr-4 font-medium">SKU</th>
                <th className="pb-3 pr-4 font-medium">Category</th>
                <th className="pb-3 pr-4 font-medium">Price</th>
                <th className="pb-3 pr-4 font-medium">Stock</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-white/5">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-[color:var(--brand-pink)]" />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{p.sku}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{p.category}</td>
                  <td className="py-3 pr-4 font-semibold gradient-text">${p.price.toLocaleString()}</td>
                  <td className="py-3 pr-4">{p.stock}</td>
                  <td className="py-3 pr-4"><Badge tone={tone[p.status]}>{p.status}</Badge></td>
                  <td className="py-3 text-right">
                    {addedIds.has(p.id) ? (
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setEditing(p); const { id, ...rest } = p; void id; setForm(rest); setOpen(true); }} className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => confirm("Delete this product?") && remove(p.id)} className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit product" : "New product"}
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save" : "Create"}</Button></>}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="SKU"><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></FormField>
          <FormField label="Category"><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></FormField>
          <FormField label="Price ($)"><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></FormField>
          <FormField label="Stock"><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Product["status"] })} className="glass h-10 w-full rounded-lg border-0 px-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]">
              {(["Active", "Draft", "Archived"] as const).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
