import { createFileRoute } from "@tanstack/react-router";
import { Plus, Download, MoreHorizontal } from "lucide-react";
import { useRecordStore } from "@/lib/record-store";
import { PageHeader, GlassCard, Badge, StatCard } from "@/components/crm-ui";

export const Route = createFileRoute("/invoices")({
  head: () => ({
    meta: [
      { title: "Invoices — UniqueCRM" },
      { name: "description", content: "Billing, revenue, and outstanding invoices." },
    ],
  }),
  component: InvoicesPage,
});

type Invoice = { id: string; client: string; amount: number | string; due: string; status: string };

function InvoicesPage() {
  const { items: invoices } = useRecordStore<Invoice>("invoices");
  const amount = (inv: Invoice) => Number(String(inv.amount).replace(/[^0-9.]/g, "")) || 0;
  const total = (predicate: (inv: Invoice) => boolean) => `$${invoices.filter(predicate).reduce((sum, inv) => sum + amount(inv), 0).toLocaleString()}`;
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Invoices"
        subtitle="Billing and revenue collection"
        actions={
          <button className="gradient-brand-bg glow-shadow-sm inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02]">
            <Plus className="h-4 w-4" />
            New invoice
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Outstanding" value={total((inv) => inv.status === "Sent")} />
        <StatCard label="Paid this month" value={total((inv) => inv.status === "Paid" && String(inv.due).slice(0, 7) === new Date().toISOString().slice(0, 7))} />
        <StatCard label="Overdue" value={total((inv) => inv.status === "Overdue")} />
      </div>

      <GlassCard className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Invoice</th>
                <th className="pb-3 pr-4 font-medium">Client</th>
                <th className="pb-3 pr-4 font-medium">Amount</th>
                <th className="pb-3 pr-4 font-medium">Due</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-white/5">
                  <td className="py-3 pr-4 font-mono text-xs">{inv.id}</td>
                  <td className="py-3 pr-4 font-medium">{inv.client}</td>
                  <td className="py-3 pr-4 font-semibold">{`$${amount(inv).toLocaleString()}`}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{inv.due}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={inv.status === "Paid" ? "success" : inv.status === "Overdue" ? "warning" : inv.status === "Sent" ? "info" : "default"}>{inv.status}</Badge>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!invoices.length && <tr><td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">No invoices yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
