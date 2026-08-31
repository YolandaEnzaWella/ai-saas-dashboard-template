"use client";

import * as React from "react";
import { CreditCard, Loader2, MoreHorizontal, Plus, ShieldCheck, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { useToast } from "@/components/ui/toast";
import { paymentMethods as seedMethods } from "@/data/billing";
import type { PaymentMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

const brandTint: Record<string, string> = {
  Visa: "from-[#1a1f71] to-[#2b3a9c]",
  Mastercard: "from-[#7a1f1f] to-[#c1440e]",
  Amex: "from-[#0b5c8a] to-[#1a8bbf]",
};

export function PaymentMethodsView() {
  const { toast } = useToast();
  const [methods, setMethods] = React.useState<PaymentMethod[]>(seedMethods);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<PaymentMethod | null>(null);
  const [form, setForm] = React.useState({ number: "", holder: "", expiry: "", cvc: "", country: "US" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const makeDefault = (id: string) => {
    setMethods((current) => current.map((method) => ({ ...method, isDefault: method.id === id })));
    toast({ title: "Default card updated", description: "Future invoices will use this card.", tone: "success" });
  };

  const remove = () => {
    if (!pendingDelete) return;
    setMethods((current) => current.filter((method) => method.id !== pendingDelete.id));
    toast({ title: "Card removed", description: `${pendingDelete.brand} •••• ${pendingDelete.last4}`, tone: "success" });
    setPendingDelete(null);
  };

  const addCard = () => {
    const nextErrors: Record<string, string> = {};
    const digits = form.number.replace(/\s/g, "");
    if (digits.length < 15) nextErrors.number = "Enter a valid card number.";
    if (form.holder.trim().length < 3) nextErrors.holder = "Enter the cardholder name.";
    if (!/^\d{2}\/\d{2,4}$/.test(form.expiry)) nextErrors.expiry = "Use MM/YY.";
    if (form.cvc.length < 3) nextErrors.cvc = "3 or 4 digits.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setOpen(false);
      setMethods((current) => [
        ...current,
        {
          id: `pm_${Date.now()}`,
          brand: digits.startsWith("4") ? "Visa" : digits.startsWith("5") ? "Mastercard" : "Amex",
          last4: digits.slice(-4),
          expiry: form.expiry,
          holder: form.holder,
          isDefault: current.length === 0,
          country: form.country,
        },
      ]);
      setForm({ number: "", holder: "", expiry: "", cvc: "", country: "US" });
      toast({ title: "Card added", description: "Your new payment method is ready.", tone: "success" });
    }, 800);
  };

  return (
    <>
      <PageHeader
        title="Payment methods"
        description="Cards on file for this workspace. The default card is charged automatically."
        breadcrumbs={[{ label: "Billing", href: "/billing" }, { label: "Payment methods" }]}
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden />
            Add card
          </Button>
        }
      />

      {methods.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payment method on file"
          description="Add a card so invoices are settled automatically at the end of each billing period."
          action={<Button onClick={() => setOpen(true)}>Add card</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {methods.map((method) => (
            <Card key={method.id} className="overflow-hidden">
              <div
                className={cn(
                  "relative bg-gradient-to-br p-5 text-white",
                  brandTint[method.brand] ?? "from-slate-700 to-slate-900",
                )}
              >
                <div className="flex items-start justify-between">
                  <CreditCard className="h-6 w-6 opacity-80" aria-hidden />
                  <Dropdown
                    trigger={({ toggle }) => (
                      <button
                        type="button"
                        onClick={toggle}
                        aria-label={`Actions for card ending ${method.last4}`}
                        className="rounded-md p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden />
                      </button>
                    )}
                  >
                    {(close) => (
                      <>
                        {!method.isDefault && (
                          <DropdownItem
                            onClick={() => {
                              makeDefault(method.id);
                              close();
                            }}
                          >
                            <Star className="h-4 w-4 text-muted-foreground" aria-hidden />
                            Make default
                          </DropdownItem>
                        )}
                        <DropdownItem onClick={close}>
                          <CreditCard className="h-4 w-4 text-muted-foreground" aria-hidden />
                          Update billing address
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem
                          tone="danger"
                          onClick={() => {
                            setPendingDelete(method);
                            close();
                          }}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                          Remove card
                        </DropdownItem>
                      </>
                    )}
                  </Dropdown>
                </div>
                <p className="mt-8 font-mono text-lg tracking-widest">•••• •••• •••• {method.last4}</p>
                <div className="mt-4 flex items-end justify-between text-xs">
                  <span className="opacity-80">{method.holder}</span>
                  <span className="opacity-80">{method.expiry}</span>
                </div>
              </div>
              <CardContent className="flex items-center justify-between py-3.5">
                <span className="flex items-center gap-2 text-sm">
                  {method.brand}
                  <span className="text-xs text-muted-foreground">· {method.country}</span>
                </span>
                {method.isDefault ? (
                  <Badge tone="success">Default</Badge>
                ) : (
                  <button
                    type="button"
                    onClick={() => makeDefault(method.id)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Make default
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-success" aria-hidden />
              Card security
            </CardTitle>
            <CardDescription>
              Card details never touch this dashboard — connect a PSP such as Stripe Elements and
              this form posts a token instead.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add a payment method"
        description="This is a demo form. Wire it to your payment provider's tokenization SDK before going live."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addCard} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {saving ? "Adding…" : "Add card"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Card number" htmlFor="card-number" error={errors.number}>
            <Input
              id="card-number"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              value={form.number}
              onChange={(event) => setForm((current) => ({ ...current, number: event.target.value }))}
            />
          </Field>
          <Field label="Cardholder name" htmlFor="card-holder" error={errors.holder}>
            <Input
              id="card-holder"
              placeholder="Amara Okafor"
              value={form.holder}
              onChange={(event) => setForm((current) => ({ ...current, holder: event.target.value }))}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Expiry" htmlFor="card-expiry" error={errors.expiry}>
              <Input
                id="card-expiry"
                placeholder="09/28"
                value={form.expiry}
                onChange={(event) => setForm((current) => ({ ...current, expiry: event.target.value }))}
              />
            </Field>
            <Field label="CVC" htmlFor="card-cvc" error={errors.cvc}>
              <Input
                id="card-cvc"
                inputMode="numeric"
                placeholder="123"
                maxLength={4}
                value={form.cvc}
                onChange={(event) => setForm((current) => ({ ...current, cvc: event.target.value }))}
              />
            </Field>
            <Field label="Country" htmlFor="card-country">
              <Select
                id="card-country"
                value={form.country}
                onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))}
              >
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="ID">Indonesia</option>
                <option value="SG">Singapore</option>
              </Select>
            </Field>
          </div>
        </div>
      </Modal>

      <Modal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Remove this card?"
        description={`${pendingDelete?.brand ?? ""} ending ${pendingDelete?.last4 ?? ""} will no longer be charged for invoices.`}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={remove}>
              Remove card
            </Button>
          </>
        }
      />
    </>
  );
}
