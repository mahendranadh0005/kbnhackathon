// src/components/OwnerDashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  PlusCircle,
  Edit3,
  Trash2,
  Upload,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/** ----------------------------
 *  DATA TYPES (UI UNCHANGED)
 *  ---------------------------- */
type Product = {
  /** server id (Mongo) */
  _id?: string;
  /** client numeric id preserved for UI lists/checkboxes/pagination */
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  location: string;
  directions: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
};

type OwnerDashboardProps = { onBack: () => void };

/** API base (adjust if needed) */
const API_URL = "http://localhost:5000/api/products";

/** Local constant kept (used only as fallback) */
const STORAGE_KEY = "owner_products_v1";

const categories = [
  "Grocery",
  "Bakery",
  "Produce",
  "Dairy",
  "Electronics",
  "Home",
  "Health",
  "Beauty",
  "Other",
];

/** Same sample products for graceful fallback if API fails (UI texts unchanged) */
const sampleProducts: Omit<Product, "_id">[] = [
  {
    id: 101,
    name: "Organic Apples",
    sku: "APL-ORG-001",
    category: "Produce",
    price: 3.99,
    stock: 120,
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=80&auto=format&fit=crop",
    location: "Aisle 2",
    directions: "Go straight, second shelf on the right",
    description: "Crisp, fresh, organically grown apples.",
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 102,
    name: "Fresh Sourdough Bread",
    sku: "BRD-SRD-014",
    category: "Bakery",
    price: 2.5,
    stock: 45,
    image:
      "https://images.unsplash.com/photo-1608198093002-ad4e0054842e?w=800&q=80&auto=format&fit=crop",
    location: "Bakery",
    directions: "Left from entrance, near the counter",
    description: "Daily baked sourdough loaf with crisp crust.",
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 103,
    name: "Whole Milk 1L",
    sku: "MLK-WHL-1L",
    category: "Dairy",
    price: 1.99,
    stock: 200,
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80&auto=format&fit=crop",
    location: "Refrigerated Aisle",
    directions: "Back of store, second fridge on left",
    description: "Rich and creamy whole milk.",
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 2,
  },
];

/** Helper: map server product → UI Product (ensures numeric id for UI) */
const fromServer = (sp: any, fallbackIndex = 0): Product => {
  const numericId =
    typeof sp.id === "number"
      ? sp.id
      : typeof sp.createdAt === "number"
      ? sp.createdAt
      : Date.now() + fallbackIndex;
  return {
    _id: sp._id,
    id: numericId,
    name: sp.name ?? "",
    sku: sp.sku ?? "",
    category: sp.category ?? "Other",
    price: Number(sp.price ?? 0),
    stock: Number(sp.stock ?? 0),
    image:
      sp.image ??
      "https://via.placeholder.com/600x400?text=Product",
    location: sp.location ?? "",
    directions: sp.directions ?? "",
    description: sp.description ?? "",
    createdAt: typeof sp.createdAt === "number" ? sp.createdAt : Date.now(),
    updatedAt: typeof sp.updatedAt === "number" ? sp.updatedAt : Date.now(),
  };
};

/** Helper: payload to send to server (exclude client-only numeric id) */
const toServer = (p: Product) => ({
  name: p.name,
  sku: p.sku,
  category: p.category,
  price: p.price,
  stock: p.stock,
  image: p.image,
  location: p.location,
  directions: p.directions,
  description: p.description ?? "",
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onBack }) => {
  // navigation
  const [activeTab, setActiveTab] = useState("products");

  // data
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // ui state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // filters/sort/pagination
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"createdAt" | "price" | "stock" | "name">(
    "createdAt"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // form
  const emptyForm = {
    name: "",
    sku: "",
    category: "Other",
    price: "",
    stock: "",
    image: "",
    location: "",
    directions: "",
    description: "",
  } as any;
  const [form, setForm] = useState<any>(emptyForm);
  const [imagePreview, setImagePreview] = useState<string>("");

  /** ---------------
   * LOAD: from API
   * --------------- */
  const fetchAll = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const mapped = Array.isArray(data)
        ? data.map((d, i) => fromServer(d, i))
        : [];
      setProducts(mapped);
    } catch (e) {
      // graceful fallback to sample (same as before)
      setProducts(sampleProducts);
      setToast("Using sample data (API unavailable)");
    }
  };

  useEffect(() => {
    fetchAll();
    // (No localStorage syncing: backend is source of truth)
  }, []);

  // derived list
  const filtered = useMemo(() => {
    let list = [...products];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "All") {
      list = list.filter((p) => p.category === categoryFilter);
    }

    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortBy) {
        case "price":
          return (a.price - b.price) * dir;
        case "stock":
          return (a.stock - b.stock) * dir;
        case "name":
          return a.name.localeCompare(b.name) * dir;
        default:
          return (a.createdAt - b.createdAt) * dir;
      }
    });

    return list;
  }, [products, query, categoryFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  // helpers
  const resetForm = () => {
    setForm(emptyForm);
    setImagePreview("");
  };

  const openAdd = () => {
    setEditing(null);
    resetForm();
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price.toString(),
      stock: p.stock.toString(),
      image: p.image,
      location: p.location,
      directions: p.directions,
      description: p.description || "",
    });
    setImagePreview(p.image);
    setShowModal(true);
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Product name is required";
    if (!form.sku.trim()) return "SKU is required";
    if (!form.price || isNaN(parseFloat(form.price))) return "Price must be a number";
    if (!form.stock || isNaN(parseInt(form.stock))) return "Stock must be a number";
    if (!form.location.trim()) return "Location is required";
    if (!form.directions.trim()) return "Directions are required";
    return null;
  };

  /** -----------------------
   * CREATE / UPDATE (API)
   * ----------------------- */
  const saveProduct = async () => {
    const err = validateForm();
    if (err) {
      setToast(err);
      return;
    }

    // Make a UI product payload
    const uiPayload: Product = {
      _id: editing?._id,
      id: editing ? editing.id : Date.now(), // keep numeric id for UI
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      image:
        form.image || imagePreview || "https://via.placeholder.com/600x400?text=Product",
      location: form.location.trim(),
      directions: form.directions.trim(),
      description: form.description?.trim(),
      createdAt: editing ? editing.createdAt : Date.now(),
      updatedAt: Date.now(),
    };

    try {
      if (editing?._id) {
        // UPDATE
        const res = await fetch(`${API_URL}/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toServer(uiPayload)),
        });
        if (!res.ok) throw new Error("Failed to update");
        setToast("Product updated");
      } else {
        // CREATE
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toServer(uiPayload)),
        });
        if (!res.ok) throw new Error("Failed to add");
        setToast("Product added");
      }

      // Refresh list from server to stay in sync
      await fetchAll();
    } catch (e) {
      // If server fails, still update UI (optional); but we’ll just notify
      setToast("Server error. Please check backend.");
    }

    setShowModal(false);
    setEditing(null);
    resetForm();
  };

  /** -----------------------
   * DELETE (Single / Bulk)
   * ----------------------- */
  const deleteProduct = async (id: number) => {
    const item = products.find((p) => p.id === id);
    const serverId = item?._id;
    try {
      if (serverId) {
        const res = await fetch(`${API_URL}/${serverId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
      }
      setToast("Product deleted");
    } catch {
      setToast("Server error. Could not delete");
    } finally {
      // Update UI regardless and then refetch to ensure accuracy
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      await fetchAll();
    }
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) return;

    try {
      const targets = products.filter((p) => selectedIds.includes(p.id) && p._id);
      await Promise.all(
        targets.map((t) => fetch(`${API_URL}/${t._id}`, { method: "DELETE" }))
      );
      setToast("Selected products deleted");
    } catch {
      setToast("Server error. Some items may remain.");
    } finally {
      setSelectedIds([]);
      await fetchAll();
    }
  };

  /** -----------------------
   * EXPORT / IMPORT
   * ----------------------- */
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!Array.isArray(data)) throw new Error("Invalid file");

        // sanitize → POST each to API
        const safe = data
          .filter((d) => d && (d.name || d.sku))
          .map((d) => ({
            name: String(d.name ?? "").trim(),
            sku: String(d.sku ?? "").trim(),
            category: String(d.category ?? "Other"),
            price: Number(d.price ?? 0),
            stock: Number(d.stock ?? 0),
            image:
              d.image ??
              "https://via.placeholder.com/600x400?text=Product",
            location: String(d.location ?? ""),
            directions: String(d.directions ?? ""),
            description: String(d.description ?? ""),
            createdAt: Number(d.createdAt ?? Date.now()),
            updatedAt: Date.now(),
          }));

        await Promise.all(
          safe.map((item) =>
            fetch(API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item),
            })
          )
        );

        await fetchAll();
        setToast("Products imported");
      } catch {
        setToast("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    (e.target as any).value = "";
  };

  // modal image input assists
  const onImageUrlChange = (val: string) => {
    setForm((f: any) => ({ ...f, image: val }));
    setImagePreview(val);
  };

  // UI components (UNCHANGED)
  const Toolbar = () => (
    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div className="flex gap-3 items-center">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-yellow-700/70" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, SKU, location…"
            className="pl-9 pr-3 py-2 rounded-xl bg-white/80 border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white/80 border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option>All</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-white/80 border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="createdAt">Newest</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>
          <button
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="px-3 py-2 rounded-xl bg-white/80 border border-yellow-200 hover:bg-yellow-100"
            title="Toggle sort direction"
          >
            {sortDir === "asc" ? "Asc" : "Desc"}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-yellow-300 hover:bg-yellow-50 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Import</span>
          <input className="hidden" type="file" accept="application/json" onChange={handleImport} />
        </label>

        <button
          onClick={exportJSON}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-yellow-300 hover:bg-yellow-50"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow hover:shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          Add Product
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-white via-amber-50 to-amber-100">
      {/* Top Bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/70 backdrop-blur-md border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-amber-800 font-semibold">Store Management</p>
              <h1 className="text-xl font-black text-amber-900 tracking-tight">Owner Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-amber-300 hover:bg-amber-50"
              title="Back to Landing"
            >
              <ArrowLeft className="w-4 h-4" />
              Landing
            </button>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 pt-[76px] pb-6 bg-white/70 backdrop-blur-md border-r border-amber-200 flex-col">
        <nav className="px-4 py-4 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "products", label: "Products", icon: Package },
            { id: "orders", label: "Orders", icon: ShoppingBag },
            { id: "customers", label: "Customers", icon: Users },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "settings", label: "Settings", icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                activeTab === id
                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow"
                  : "hover:bg-amber-100 text-amber-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto px-4">
          <div className="rounded-2xl border border-amber-200 bg-white p-4">
            <p className="text-sm font-semibold text-amber-900">Tips</p>
            <p className="text-xs text-amber-800/80 mt-1">
              Use <b>Export</b> to back up your products, and <b>Import</b> to restore or migrate.
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 pt-[92px] px-4 md:px-8 pb-12">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { label: "Total Products", value: products.length.toString() },
                {
                  label: "Low Stock (<10)",
                  value: products.filter((p) => p.stock < 10).length.toString(),
                },
                {
                  label: "Avg Price",
                  value:
                    products.length > 0
                      ? `₹${(
                          products.reduce((a, b) => a + b.price, 0) / products.length
                        ).toFixed(2)}`
                      : "₹0.00",
                },
                {
                  label: "Inventory Value",
                  value: `₹${products
                    .reduce((a, b) => a + b.price * b.stock, 0)
                    .toFixed(2)}`,
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm hover:shadow-md transition"
                >
                  <p className="text-sm text-amber-800">{c.label}</p>
                  <p className="text-3xl font-black text-amber-900 mt-2">{c.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-amber-900">Quick Actions</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab("products")}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                >
                  Manage Products
                </button>
                <button className="px-4 py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-50">
                  View Orders
                </button>
                <button className="px-4 py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-50">
                  Customers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm">
              <Toolbar />
            </div>

            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
              {/* table header actions */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200 bg-amber-50">
                <div className="text-sm text-amber-900">
                  {selectedIds.length
                    ? `${selectedIds.length} selected`
                    : `${filtered.length} products`}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={deleteSelected}
                    disabled={!selectedIds.length}
                    className={`px-3 py-2 rounded-lg border ${
                      selectedIds.length
                        ? "bg-red-500 text-white border-red-600 hover:bg-red-600"
                        : "bg-white text-amber-800 border-amber-300 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    Delete Selected
                  </button>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(parseInt(e.target.value));
                      setPage(1);
                    }}
                    className="px-3 py-2 rounded-lg bg-white border border-amber-300"
                  >
                    {[6, 9, 12, 24].map((n) => (
                      <option key={n} value={n}>
                        {n}/page
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white">
                    <tr className="text-left border-b border-amber-200">
                      <th className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={
                            pageItems.length > 0 &&
                            pageItems.every((p) => selectedIds.includes(p.id))
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds((prev) => [
                                ...prev,
                                ...pageItems
                                  .map((p) => p.id)
                                  .filter((id) => !prev.includes(id)),
                              ]);
                            } else {
                              setSelectedIds((prev) =>
                                prev.filter((id) => !pageItems.map((p) => p.id).includes(id))
                              );
                            }
                          }}
                        />
                      </th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Updated</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((p) => (
                      <tr key={p.id} className="border-b last:border-b-0 border-amber-100">
                        <td className="px-4 py-3 align-top">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(p.id)}
                            onChange={(e) =>
                              setSelectedIds((prev) =>
                                e.target.checked
                                  ? [...prev, p.id]
                                  : prev.filter((x) => x !== p.id)
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover border border-amber-200"
                            />
                            <div>
                              <div className="font-semibold text-amber-900">{p.name}</div>
                              <div className="text-xs text-amber-800/70">
                                {p.description?.slice(0, 60)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{p.sku}</td>
                        <td className="px-4 py-3">{p.category}</td>
                        <td className="px-4 py-3">₹{p.price.toFixed(2)}</td>
                        <td className="px-4 py-3">{p.stock}</td>
                        <td className="px-4 py-3">
                          <div className="text-sm">{p.location}</div>
                          <div className="text-xs text-amber-800/70">{p.directions}</div>
                        </td>
                        <td className="px-4 py-3">
                          {new Date(p.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEdit(p)}
                              className="px-3 py-1.5 rounded-lg border border-amber-300 bg-white hover:bg-amber-50 inline-flex items-center gap-2"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 inline-flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!pageItems.length && (
                      <tr>
                        <td colSpan={9} className="px-4 py-10 text-center text-amber-800/70">
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-amber-200 bg-white">
                <div className="text-sm text-amber-900">
                  Page {page} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`p-2 rounded-lg border ${
                      page === 1
                        ? "border-amber-200 text-amber-400 cursor-not-allowed"
                        : "border-amber-300 hover:bg-amber-50"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`p-2 rounded-lg border ${
                      page === totalPages
                        ? "border-amber-200 text-amber-400 cursor-not-allowed"
                        : "border-amber-300 hover:bg-amber-50"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OTHER TABS (stubs; unchanged) */}
        {activeTab === "orders" && (
          <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-amber-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-amber-900">Orders</h3>
            <p className="text-amber-800/80 mt-2">Connect to your backend API to show orders.</p>
          </div>
        )}
        {activeTab === "customers" && (
          <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-amber-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-amber-900">Customers</h3>
            <p className="text-amber-800/80 mt-2">List of customers with purchase history.</p>
          </div>
        )}
        {activeTab === "analytics" && (
          <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-amber-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-amber-900">Analytics</h3>
            <p className="text-amber-800/80 mt-2">Hook charts here (Recharts/Chart.js).</p>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-amber-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-amber-900">Settings</h3>
            <p className="text-amber-800/80 mt-2">Store name, address, branding, etc.</p>
          </div>
        )}
      </main>

      {/* MODAL: Add/Edit Product */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-amber-200 bg-amber-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-amber-900">
                  {editing ? "Edit Product" : "Add Product"}
                </h3>
                <button
                  className="p-2 rounded-lg hover:bg-amber-100"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    resetForm();
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* left: preview */}
                <div className="md:col-span-1">
                  <div className="aspect-video rounded-xl border border-amber-200 overflow-hidden bg-amber-50 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-amber-800/70">
                        <ImageIcon className="w-10 h-10" />
                        <p className="text-sm mt-2">Image preview</p>
                      </div>
                    )}
                  </div>
                  <input
                    value={form.image}
                    onChange={(e) => onImageUrlChange(e.target.value)}
                    placeholder="Image URL"
                    className="mt-3 w-full px-3 py-2 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* right: form */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-amber-800">Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-amber-800">SKU</label>
                    <input
                      value={form.sku}
                      onChange={(e) => setForm((f: any) => ({ ...f, sku: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-amber-800">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm((f: any) => ({ ...f, category: e.target.value }))
                      }
                      className="mt-1 w-full px-3 py-2 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {categories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-amber-800">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm((f: any) => ({ ...f, price: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-amber-800">Stock</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => setForm((f: any) => ({ ...f, stock: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-amber-800">Location</label>
                    <input
                      value={form.location}
                      onChange={(e) =>
                        setForm((f: any) => ({ ...f, location: e.target.value }))
                      }
                      className="mt-1 w-full px-3 py-2 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-amber-800">Directions</label>
                    <input
                      value={form.directions}
                      onChange={(e) =>
                        setForm((f: any) => ({ ...f, directions: e.target.value }))
                      }
                      className="mt-1 w-full px-3 py-2 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-amber-800">Description</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm((f: any) => ({ ...f, description: e.target.value }))
                      }
                      className="mt-1 w-full px-3 py-2 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-amber-200 bg-amber-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-lg bg-white border border-amber-300 hover:bg-amber-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProduct}
                  className="px-5 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600"
                >
                  {editing ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="px-4 py-2 rounded-xl bg-amber-600 text-white shadow-lg">
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnerDashboard;
