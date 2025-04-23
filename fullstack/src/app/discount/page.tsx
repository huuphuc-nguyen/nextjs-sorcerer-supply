"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  createDiscountCode,
  getDiscountCodes,
  updateDiscountCode,
  deleteDiscountCode,
  Discount,
} from "@/lib/firebase/products";

export default function AddDiscount() {
  /* ── state ─────────────────────────────────────────── */
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  /* edit-mode state */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCode, setEditCode] = useState<string>("");
  const [editAmount, setEditAmount] = useState<number | "">("");

  const { toast } = useToast();

  /* ── helpers ───────────────────────────────────────── */
  const refresh = async () => {
    setLoading(true);
    setDiscounts(await getDiscountCodes());
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  /* ── create ────────────────────────────────────────── */
  const handleAdd = async () => {
    if (!code.trim() || amount === "" || Number(amount) <= 0) {
      toast({
        title: "Invalid input",
        description: "Enter a non-empty code and a positive amount.",
        variant: "destructive",
      });
      return;
    }
    try {
      await createDiscountCode(code.trim(), Number(amount));
      toast({ title: "Discount created!" });
      setCode("");
      setAmount("");
      await refresh();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message ?? "Could not create discount.",
        variant: "destructive",
      });
    }
  };

  /* ── delete ───────────────────────────────────────── */
  const handleDelete = async (id: string, dc: string) => {
    if (!confirm(`Delete discount code “${dc}”?`)) return;
    await deleteDiscountCode(id, dc);
    toast({ title: "Deleted." });
    await refresh();
  };

  /* ── save edit ─────────────────────────────────────── */
  const handleSaveEdit = async (id: string) => {
    if (!editCode.trim() || editAmount === "" || Number(editAmount) <= 0) {
      toast({
        title: "Invalid input",
        description: "Enter a non-empty code and a positive amount.",
        variant: "destructive",
      });
      return;
    }
    await updateDiscountCode(id, editCode.trim(), Number(editAmount));
    toast({ title: "Updated!" });
    setEditingId(null);
    setEditCode("");
    setEditAmount("");
    await refresh();
  };

  /* ── UI ────────────────────────────────────────────── */
  return (
    <div className="bg-black text-white min-h-screen px-6 py-4">
      {/* nav */}
      <nav className="flex justify-between items-center border-b border-gray-800 pb-4 mb-8">
        <h1 className="text-2xl font-bold">Sorcerer&nbsp;Supply</h1>
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/sellerDashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/discounts" className="hover:underline">
            Discounts
          </Link>
          <Link href="/" className="hover:underline">
            Back&nbsp;to&nbsp;Store
          </Link>
        </div>
      </nav>

      {/* create */}
      <div className="max-w-md space-y-4 mb-10">
        <h2 className="text-xl font-semibold">Create new discount</h2>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="CODE"
          className="w-full p-2 rounded bg-gray-800 outline-none"
        />

        <input
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
          type="number"
          min={1}
          placeholder="Amount (e.g. 25)"
          className="w-full p-2 rounded bg-gray-800 outline-none"
        />

        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
        >
          Add&nbsp;Discount
        </button>
      </div>

      {/* list */}
      <h2 className="text-xl font-semibold mb-4">Existing codes</h2>

      {loading ? (
        <p>Loading…</p>
      ) : discounts.length === 0 ? (
        <p className="text-gray-400">No discount codes yet.</p>
      ) : (
        <ul className="space-y-3">
          {discounts.map((d) => (
            <li
              key={d.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border border-gray-700 rounded-lg p-3"
            >
              {editingId === d.id ? (
                /* ── edit mode ── */
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <input
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      className="w-32 p-1 rounded bg-gray-800 outline-none text-center"
                    />
                    <input
                      value={editAmount}
                      onChange={(e) =>
                        setEditAmount(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      type="number"
                      min={1}
                      className="w-20 p-1 rounded bg-gray-800 outline-none text-center"
                    />
                  </div>

                  <div className="flex gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleSaveEdit(d.id)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                /* ── view mode ── */
                <>
                  <div>
                    <span className="font-bold">{d.code}</span>
                    <span className="ml-3 text-sm text-gray-400">
                      {d.amount}%&nbsp;off
                    </span>
                  </div>

                  <div className="flex gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => {
                        setEditingId(d.id);
                        setEditCode(d.code);
                        setEditAmount(d.amount);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(d.id, d.code)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
