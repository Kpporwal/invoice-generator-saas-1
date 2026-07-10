import CustomerCard from "./CustomerCard";
import { useState } from "react";
import CustomerSearch from "../customer/CustomerSearch";
import CustomerFilters from "../customer/CustomerFilters";
import CustomerTable from "../customer/CustomersTable";
import CustomerDrawer from "../customer/CustomerDrawer";
import CustomerDetailDrawer from "../customer/CustomerDetailDrawer";
import { useEffect } from "react";
import { useAuth } from "../../store/AuthContext";
import { getCustomers, deleteCustomer } from "../../lib/customers";
import type { Customer } from "../../types/customers";
import { getCollectedToday } from "../../lib/customerLedger";
import {
  Users,
  Wallet,
 IndianRupee,
  TrendingUp,
  Plus,
} from "lucide-react";


export default function CustomerManagement() {
    const [search, setSearch] = useState("");

const [filter, setFilter] = useState("All");
const [drawerOpen, setDrawerOpen] = useState(false);
const { user } = useAuth();
const [collectedToday, setCollectedToday] = useState(0);

const [customers, setCustomers] = useState<Customer[]>([]);
const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);
    const [selectedCustomer, setSelectedCustomer] =
  useState<Customer | null>(null);

const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

useEffect(() => {
  if (user) {
    loadCustomers();
    loadCollectedToday();
  }
}, [user]);

async function loadCollectedToday() {
  if (!user) return;

  const { total, error } = await getCollectedToday(user.id);

  if (error) {
    console.error("Collected today error:", error);
    return;
  }

  setCollectedToday(total);
}

async function handleDeleteCustomer(customer: Customer) {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${customer.customer_name}?`
  );

  if (!confirmed) return;

  if (!customer.id) {
    alert("Customer ID not found");
    return;
  }

  const { error } = await deleteCustomer(customer.id);

  if (error) {
    alert(error.message);
    return;
  }

  await loadCustomers();
}

async function loadCustomers() {
  if (!user) return;

  const { data, error } = await getCustomers(user.id);

  if (error) {
    console.error("Customers loading error:", error);
    return;
  }

  if (data) {
    setCustomers(data);

    setSelectedCustomer((currentCustomer) => {
      if (!currentCustomer?.id) {
        return currentCustomer;
      }

      return (
        data.find((customer) => customer.id === currentCustomer.id) ??
        currentCustomer
      );
    });
  }
}
const totalCustomers = customers.length;

const totalOutstanding = customers.reduce(
  (total, customer) =>
    total + Number(customer.outstanding || 0),
  0
);

const totalPurchase = customers.reduce(
  (total, customer) =>
    total + Number(customer.total_purchase || 0),
  0
);
const filteredCustomers = customers.filter((customer) => {
  const query = search.toLowerCase().trim();

  const matchesSearch =
    !query ||
    customer.customer_name?.toLowerCase().includes(query) ||
    customer.phone?.toLowerCase().includes(query) ||
    customer.gst_number?.toLowerCase().includes(query);

  if (!matchesSearch) {
    return false;
  }

  const outstanding = Number(customer.outstanding || 0);

  const today = new Date();
today.setHours(0, 0, 0, 0);

const dueDate = customer.last_invoice_due_date
  ? new Date(customer.last_invoice_due_date)
  : null;

if (dueDate) {
  dueDate.setHours(0, 0, 0, 0);
}

// Due = payment baki hai, lekin due date abhi cross nahi hui.
if (filter === "Due") {
  return (
    outstanding > 0 &&
    (!dueDate || dueDate >= today)
  );
}

// Paid = koi outstanding baki nahi.
if (filter === "Paid") {
  return outstanding === 0;
}

// Overdue = payment baki hai aur due date cross ho chuki hai.
if (filter === "Overdue") {
  return (
    outstanding > 0 &&
    dueDate !== null &&
    dueDate < today
  );
}

  if (filter === "Recent") {
    if (!customer.created_at) return false;

    const createdAt = new Date(customer.created_at);
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return createdAt >= sevenDaysAgo;
  }

  return true;
});
  return (
  <div className="p-4 md:p-8 bg-slate-50 min-h-screen">

    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

      {/* Title - mobile hamburger ke liye space */}
      <div className="pl-14 md:pl-0">
        <h1 className="text-3xl font-bold text-slate-800">
          Customer Management
        </h1>

        <p className="text-slate-500 mt-1">
          Manage customer ledger & due payments
        </p>
      </div>

      {/* Add Customer Button */}
      <button
        onClick={() => {
          setEditingCustomer(null);
          setDrawerOpen(true);
        }}
        className="w-full md:w-auto inline-flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-lg font-semibold transition-all"
      >
        <Plus className="w-5 h-5" />
        <span>Add Customer</span>
      </button>

    </div>
      {/* Summary */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">

        <CustomerCard
          title="Total Customers"
          value={totalCustomers.toString()}
          color="blue"
          icon={<Users size={28} />}
        />

        <CustomerCard
          title="Outstanding"
          value={`₹${totalOutstanding.toLocaleString("en-IN")}`}
          color="red"
          icon={<Wallet size={28} />}
        />

       <CustomerCard
  title="Collected Today"
  value={`₹${collectedToday.toLocaleString("en-IN")}`}
  color="green"
  icon={<IndianRupee size={28} />}
/>

        <CustomerCard
          title="This Month Sales"
          value={`₹${totalPurchase.toLocaleString("en-IN")}`}
          color="purple"
          icon={<TrendingUp size={28} />}
        />

      </div>

      {/* Search */}

      <div className="mt-6 mb-4">
  <CustomerSearch
    value={search}
    onChange={setSearch}
  />
</div>
<div className="mt-4 overflow-x-auto">
  <CustomerFilters
    active={filter}
    onChange={setFilter}
  />
</div>

      {/* Table */}

  
<div className="mt-10">
  <CustomerTable
  customers={filteredCustomers}
  onView={(customer) => {
    setSelectedCustomer(customer);
    setDetailDrawerOpen(true);
  }}
  onEdit={(customer) => {
    setEditingCustomer(customer);
    setDrawerOpen(true);
  }}
  onDelete={handleDeleteCustomer}
/>
</div>

<CustomerDrawer
  open={drawerOpen}
  onClose={() => {
    setDrawerOpen(false);
    setEditingCustomer(null);
  }}
  onCustomerAdded={loadCustomers}
  editingCustomer={editingCustomer}
/>

<CustomerDetailDrawer
  open={detailDrawerOpen}
  customer={selectedCustomer}
  onClose={() => {
    setDetailDrawerOpen(false);
    setSelectedCustomer(null);
  }}
  onPaymentReceived={async () => {
    await loadCustomers();
    await loadCollectedToday();
  }}
/>
    </div>
  );
}