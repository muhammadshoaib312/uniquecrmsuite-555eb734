// FormModal — a thin, opinionated wrapper around the design-system Modal.
// It gives every module the same submit/cancel behavior, validation
// surfacing, and loading state, so pages can stop hand-rolling modal logic.

import { type ReactNode, useState } from "react";
import { Modal, Button } from "@/components/ui-kit";

export function FormModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  disabled,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: () => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);

  async function handleSubmit() {
    if (busy || disabled) return;
    try {
      setBusy(true);
      await onSubmit();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button onClick={handleSubmit} disabled={busy || disabled}>
            {busy ? "Saving…" : submitLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}

/** Render `<FieldError name="email" errors={errors} />` under an Input. */
export function FieldError({ name, errors }: { name: string; errors?: Record<string, string> }) {
  const msg = errors?.[name];
  if (!msg) return null;
  return <div className="mt-1 text-xs text-rose-400">{msg}</div>;
}
