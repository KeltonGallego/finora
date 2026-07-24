import { useEffect, useMemo, useState } from "react";

import {
  LayoutDashboard,
  CreditCard,
  Target,
  BarChart3,
  Settings as SettingsIcon,
  Search,
  Bell,
  Plus,
  ArrowDownRight,
  Car,
  ShoppingBag,
  Home,
  Utensils,
  Trash2,
  Pencil,
  X,
  Moon,
  Sun,
  Database,
  RotateCcw,
  Wallet,
  TrendingUp,
  PiggyBank,
  CircleDollarSign,
  Menu,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

import "./index.css";

/* =========================================================
   CONSTANTS
========================================================= */

const STORAGE_KEYS = {
  transactions: "finora_transactions",
  budgets: "finora_budgets",
  currency: "finora_currency",
  darkMode: "finora_dark_mode",
};

const CATEGORIES = [
  "Housing",
  "Transportation",
  "Shopping",
  "Food & Dining",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

const CURRENCIES = [
  {
    code: "USD",
    symbol: "$",
    label: "USD ($)",
    locale: "en-US",
  },
  {
    code: "EUR",
    symbol: "€",
    label: "EUR (€)",
    locale: "es-ES",
  },
  {
    code: "GBP",
    symbol: "£",
    label: "GBP (£)",
    locale: "en-GB",
  },
  {
    code: "JPY",
    symbol: "¥",
    label: "JPY (¥)",
    locale: "ja-JP",
  },
];

const DEMO_TRANSACTIONS = [
  {
    id: 1,
    title: "Monthly Salary",
    amount: 4250,
    type: "income",
    category: "Other",
    date: "2026-07-23",
  },
  {
    id: 2,
    title: "Uber Ride",
    amount: 24.5,
    type: "expense",
    category: "Transportation",
    date: "2026-07-22",
  },
  {
    id: 3,
    title: "New Clothes",
    amount: 120,
    type: "expense",
    category: "Shopping",
    date: "2026-07-21",
  },
  {
    id: 4,
    title: "Rent Payment",
    amount: 1200,
    type: "expense",
    category: "Housing",
    date: "2026-07-20",
  },
  {
    id: 5,
    title: "Restaurant Dinner",
    amount: 86.4,
    type: "expense",
    category: "Food & Dining",
    date: "2026-07-19",
  },
];

const DEMO_BUDGETS = [
  {
    id: 1,
    category: "Food & Dining",
    limit: 500,
  },
  {
    id: 2,
    category: "Transportation",
    limit: 300,
  },
  {
    id: 3,
    category: "Shopping",
    limit: 400,
  },
  {
    id: 4,
    category: "Housing",
    limit: 1200,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getStoredData(key, fallback) {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return fallback;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.warn(
      `Unable to read localStorage key: ${key}`,
      error
    );

    return fallback;
  }
}

function normalizeTransactions(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((transaction) => transaction && typeof transaction === "object")
    .map((transaction, index) => ({
      id: transaction.id || Date.now() + index,
      title: String(transaction.title || "Untitled transaction"),
      amount: Number(transaction.amount) || 0,
      type:
        transaction.type === "income"
          ? "income"
          : "expense",
      category: CATEGORIES.includes(transaction.category)
        ? transaction.category
        : "Other",
      date: transaction.date || "",
    }));
}

function normalizeBudgets(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((budget) => budget && typeof budget === "object")
    .map((budget, index) => ({
      id: budget.id || Date.now() + index,
      category: CATEGORIES.includes(budget.category)
        ? budget.category
        : "Other",
      limit: Number(budget.limit) || 0,
    }))
    .filter((budget) => budget.limit > 0);
}

function formatDate(date, locale = "en-US") {
  if (!date) {
    return "No date";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCategoryIcon(category) {
  switch (category) {
    case "Transportation":
      return Car;

    case "Shopping":
      return ShoppingBag;

    case "Housing":
      return Home;

    case "Food & Dining":
      return Utensils;

    default:
      return Wallet;
  }
}

function formatMoney(
  amount,
  currencyData,
  compact = false
) {
  const numericAmount = Number(amount) || 0;

  return new Intl.NumberFormat(
    currencyData.locale,
    {
      style: "currency",
      currency: currencyData.code,
      minimumFractionDigits: compact ? 0 : 2,
      maximumFractionDigits: compact ? 0 : 2,
    }
  ).format(numericAmount);
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [activePage, setActivePage] =
    useState("dashboard");

  const [transactions, setTransactions] =
    useState(() =>
      normalizeTransactions(
        getStoredData(
          STORAGE_KEYS.transactions,
          DEMO_TRANSACTIONS
        )
      )
    );

  const [budgets, setBudgets] =
    useState(() =>
      normalizeBudgets(
        getStoredData(
          STORAGE_KEYS.budgets,
          DEMO_BUDGETS
        )
      )
    );

  const [currency, setCurrency] =
    useState(() =>
      getStoredData(
        STORAGE_KEYS.currency,
        "USD"
      )
    );

  const [darkMode, setDarkMode] =
    useState(() =>
      getStoredData(
        STORAGE_KEYS.darkMode,
        true
      )
    );

  const [showTransactionModal, setShowTransactionModal] =
    useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [transactionTypeFilter, setTransactionTypeFilter] =
    useState("all");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [showGlobalSearch, setShowGlobalSearch] =
    useState(false);

  const currencyData =
    CURRENCIES.find(
      (item) => item.code === currency
    ) || CURRENCIES[0];

  /* =========================================================
     PERSISTENCE
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.transactions,
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.budgets,
      JSON.stringify(budgets)
    );
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.currency,
      JSON.stringify(currency)
    );
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.darkMode,
      JSON.stringify(darkMode)
    );

    document.documentElement.classList.toggle(
      "dark-mode",
      darkMode
    );

    document.documentElement.classList.toggle(
      "light-mode",
      !darkMode
    );

    document.body.classList.toggle(
      "dark-mode",
      darkMode
    );

    document.body.classList.toggle(
      "light-mode",
      !darkMode
    );
  }, [darkMode]);

  /* =========================================================
     MODAL KEYBOARD CONTROL
  ========================================================= */

  useEffect(() => {
    function handleEscape(event) {
      if (event.key !== "Escape") {
        return;
      }

      if (showTransactionModal) {
        closeTransactionModal();
      }

      if (showGlobalSearch) {
        setShowGlobalSearch(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    showTransactionModal,
    showGlobalSearch,
  ]);

  useEffect(() => {
    if (
      showTransactionModal ||
      showGlobalSearch ||
      isMobileMenuOpen
    ) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove(
        "no-scroll"
      );
    };
  }, [
    showTransactionModal,
    showGlobalSearch,
    isMobileMenuOpen,
  ]);

  /* =========================================================
     FINANCIAL CALCULATIONS
  ========================================================= */

  const totalIncome = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            transaction.type === "income"
        )
        .reduce(
          (total, transaction) =>
            total +
            Number(transaction.amount || 0),
          0
        ),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            transaction.type === "expense"
        )
        .reduce(
          (total, transaction) =>
            total +
            Number(transaction.amount || 0),
          0
        ),
    [transactions]
  );

  const netBalance =
    totalIncome - totalExpenses;

  const savingsRate =
    totalIncome > 0
      ? Math.round(
          (netBalance / totalIncome) * 100
        )
      : 0;

  const categorySpending = useMemo(() => {
    const result = {};

    transactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .forEach((transaction) => {
        const category =
          transaction.category || "Other";

        if (!result[category]) {
          result[category] = 0;
        }

        result[category] += Number(
          transaction.amount || 0
        );
      });

    return result;
  }, [transactions]);

  const topCategory = useMemo(() => {
    const entries = Object.entries(
      categorySpending
    );

    if (!entries.length) {
      return "No data";
    }

    return [...entries].sort(
      (a, b) => b[1] - a[1]
    )[0][0];
  }, [categorySpending]);

  /* =========================================================
     TRANSACTIONS
  ========================================================= */

  const filteredTransactions = useMemo(() => {
    const search = String(
      searchTerm || ""
    )
      .trim()
      .toLowerCase();

    return transactions.filter(
      (transaction) => {
        const title = String(
          transaction.title || ""
        ).toLowerCase();

        const category = String(
          transaction.category || ""
        ).toLowerCase();

        const matchesSearch =
          !search ||
          title.includes(search) ||
          category.includes(search);

        const matchesType =
          transactionTypeFilter === "all" ||
          transaction.type ===
            transactionTypeFilter;

        const matchesCategory =
          categoryFilter === "all" ||
          transaction.category ===
            categoryFilter;

        return (
          matchesSearch &&
          matchesType &&
          matchesCategory
        );
      }
    );
  }, [
    transactions,
    searchTerm,
    transactionTypeFilter,
    categoryFilter,
  ]);

  function openAddTransaction() {
    setEditingTransaction(null);
    setShowTransactionModal(true);
  }

  function openEditTransaction(transaction) {
    setEditingTransaction(transaction);
    setShowTransactionModal(true);
  }

  function closeTransactionModal() {
    setShowTransactionModal(false);
    setEditingTransaction(null);
  }

  function saveTransaction(transactionData) {
    if (editingTransaction) {
      setTransactions((current) =>
        current.map((transaction) =>
          transaction.id ===
          editingTransaction.id
            ? {
                ...transactionData,
                id: editingTransaction.id,
              }
            : transaction
        )
      );
    } else {
      setTransactions((current) => [
        {
          ...transactionData,
          id: crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now(),
        },
        ...current,
      ]);
    }

    closeTransactionModal();
  }

  function deleteTransaction(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    setTransactions((current) =>
      current.filter(
        (transaction) =>
          transaction.id !== id
      )
    );
  }

  /* =========================================================
     BUDGETS
  ========================================================= */

  function addBudget(category, limit) {
    const numericLimit = Number(limit);

    if (
      !category ||
      !numericLimit ||
      numericLimit <= 0
    ) {
      return;
    }

    const existingBudget = budgets.find(
      (budget) =>
        budget.category === category
    );

    if (existingBudget) {
      setBudgets((current) =>
        current.map((budget) =>
          budget.category === category
            ? {
                ...budget,
                limit: numericLimit,
              }
            : budget
        )
      );

      return;
    }

    setBudgets((current) => [
      ...current,
      {
        id: crypto.randomUUID
          ? crypto.randomUUID()
          : Date.now(),
        category,
        limit: numericLimit,
      },
    ]);
  }

  function deleteBudget(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmed) {
      return;
    }

    setBudgets((current) =>
      current.filter(
        (budget) => budget.id !== id
      )
    );
  }

  function getBudgetSpent(category) {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.category === category
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.amount || 0),
        0
      );
  }

  /* =========================================================
     DATA MANAGEMENT
  ========================================================= */

  function restoreDemoData() {
    const confirmed = window.confirm(
      "This will replace your current data with demo data. Continue?"
    );

    if (!confirmed) {
      return;
    }

    setTransactions(
      normalizeTransactions(
        DEMO_TRANSACTIONS
      )
    );

    setBudgets(
      normalizeBudgets(
        DEMO_BUDGETS
      )
    );
  }

  function deleteAllData() {
    const confirmed = window.confirm(
      "This will permanently delete all your financial data. Continue?"
    );

    if (!confirmed) {
      return;
    }

    setTransactions([]);
    setBudgets([]);
  }

  function handleNavigation(page) {
    setActivePage(page);
    setIsMobileMenuOpen(false);
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className={`app-shell ${
        darkMode
          ? "dark-mode"
          : "light-mode"
      }`}
    >
      <Sidebar
        activePage={activePage}
        setActivePage={handleNavigation}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={
          setIsMobileMenuOpen
        }
      />

      <main className="main-content">
        <TopBar
          onAddTransaction={
            openAddTransaction
          }
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenSearch={() =>
            setShowGlobalSearch(true)
          }
          onOpenMenu={() =>
            setIsMobileMenuOpen(true)
          }
        />

        {activePage === "dashboard" && (
          <Dashboard
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            netBalance={netBalance}
            savingsRate={savingsRate}
            transactions={transactions}
            currencyData={currencyData}
            onAddTransaction={
              openAddTransaction
            }
            onNavigate={
              handleNavigation
            }
          />
        )}

        {activePage === "transactions" && (
          <TransactionsPage
            transactions={
              filteredTransactions
            }
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            transactionTypeFilter={
              transactionTypeFilter
            }
            setTransactionTypeFilter={
              setTransactionTypeFilter
            }
            categoryFilter={
              categoryFilter
            }
            setCategoryFilter={
              setCategoryFilter
            }
            currencyData={currencyData}
            onAddTransaction={
              openAddTransaction
            }
            onEditTransaction={
              openEditTransaction
            }
            onDeleteTransaction={
              deleteTransaction
            }
          />
        )}

        {activePage === "budgets" && (
          <BudgetsPage
            budgets={budgets}
            addBudget={addBudget}
            deleteBudget={deleteBudget}
            getBudgetSpent={
              getBudgetSpent
            }
            currencyData={currencyData}
          />
        )}

        {activePage === "analytics" && (
          <AnalyticsPage
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            savingsRate={savingsRate}
            topCategory={topCategory}
            categorySpending={
              categorySpending
            }
            currencyData={currencyData}
            netBalance={netBalance}
          />
        )}

        {activePage === "settings" && (
          <SettingsPage
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            currency={currency}
            setCurrency={setCurrency}
            restoreDemoData={
              restoreDemoData
            }
            deleteAllData={
              deleteAllData
            }
          />
        )}
      </main>

      {showTransactionModal && (
        <TransactionModal
          transaction={
            editingTransaction
          }
          onClose={
            closeTransactionModal
          }
          onSave={saveTransaction}
        />
      )}

      {showGlobalSearch && (
        <GlobalSearchModal
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onClose={() =>
            setShowGlobalSearch(false)
          }
          onNavigate={
            handleNavigation
          }
        />
      )}
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  activePage,
  setActivePage,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: CreditCard,
    },
    {
      id: "budgets",
      label: "Budgets",
      icon: Target,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },
  ];

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() =>
            setIsMobileMenuOpen(false)
          }
        />
      )}

      <aside
        className={`sidebar ${
          isMobileMenuOpen
            ? "mobile-open"
            : ""
        }`}
      >
        <div className="sidebar-mobile-header">
          <div className="brand">
            <div className="brand-icon">
              $
            </div>

            <span>Finora</span>
          </div>

          <button
            className="icon-button"
            onClick={() =>
              setIsMobileMenuOpen(false)
            }
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="brand desktop-brand">
          <div className="brand-icon">
            $
          </div>

          <span>Finora</span>
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav
          className="sidebar-nav"
          aria-label="Main navigation"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`nav-item ${
                  activePage === item.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActivePage(item.id)
                }
              >
                <Icon size={20} />

                <span>
                  {item.label}
                </span>

                {activePage ===
                  item.id && (
                  <ChevronRight
                    className="nav-chevron"
                    size={16}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-section-title account-title">
          ACCOUNT
        </div>

        <button
          className={`nav-item ${
            activePage === "settings"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActivePage("settings")
          }
        >
          <SettingsIcon size={20} />

          <span>Settings</span>

          {activePage === "settings" && (
            <ChevronRight
              className="nav-chevron"
              size={16}
            />
          )}
        </button>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            BG
          </div>

          <div>
            <strong>
              Bruno Gallego
            </strong>

            <span>
              Personal Account
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

/* =========================================================
   TOP BAR
========================================================= */

function TopBar({
  onAddTransaction,
  darkMode,
  setDarkMode,
  onOpenSearch,
  onOpenMenu,
}) {
  return (
    <header className="topbar">
      <button
        className="mobile-menu-button icon-button"
        onClick={onOpenMenu}
        aria-label="Open menu"
      >
        <Menu size={21} />
      </button>

      <div className="topbar-actions">
        <button
          className="icon-button"
          onClick={onOpenSearch}
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        <button
          className="icon-button notification-button"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="notification-dot" />
        </button>

        <button
          className="icon-button theme-button"
          onClick={() =>
            setDarkMode(!darkMode)
          }
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        <button
          className="primary-button"
          onClick={onAddTransaction}
        >
          <Plus size={20} />

          <span>
            Add Transaction
          </span>
        </button>
      </div>
    </header>
  );
}

/* =========================================================
   PAGE HEADER
========================================================= */

function PageHeader({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="page-header">
      <span className="page-eyebrow">
        {eyebrow}
      </span>

      <h1>{title}</h1>

      <p>{description}</p>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  totalIncome,
  totalExpenses,
  netBalance,
  savingsRate,
  transactions,
  currencyData,
  onAddTransaction,
  onNavigate,
}) {
  return (
    <>
      <PageHeader
        eyebrow="OVERVIEW"
        title="Dashboard"
        description="Your financial overview at a glance."
      />

      <section className="stats-grid">
        <StatCard
          label="Total Income"
          value={formatMoney(
            totalIncome,
            currencyData
          )}
          icon={TrendingUp}
          variant="positive"
        />

        <StatCard
          label="Total Expenses"
          value={formatMoney(
            totalExpenses,
            currencyData
          )}
          icon={ArrowDownRight}
          variant="negative"
        />

        <StatCard
          label="Net Balance"
          value={formatMoney(
            netBalance,
            currencyData
          )}
          icon={Wallet}
          variant={
            netBalance >= 0
              ? "positive"
              : "negative"
          }
        />

        <StatCard
          label="Savings Rate"
          value={`${savingsRate}%`}
          icon={PiggyBank}
          variant="neutral"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>
                Recent Transactions
              </h2>

              <p>
                Your latest financial activity.
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={onAddTransaction}
            >
              <Plus size={17} />

              <span>Add</span>
            </button>
          </div>

          <TransactionList
            transactions={transactions.slice(
              0,
              5
            )}
            currencyData={currencyData}
          />

          {transactions.length > 5 && (
            <button
              className="view-all-button"
              onClick={() =>
                onNavigate(
                  "transactions"
                )
              }
            >
              View all transactions
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        <div className="panel balance-panel">
          <div className="panel-header">
            <div>
              <h2>
                Financial Summary
              </h2>

              <p>
                Your current financial position.
              </p>
            </div>

            <CircleDollarSign size={24} />
          </div>

          <div className="summary-list">
            <SummaryRow
              label="Income"
              value={formatMoney(
                totalIncome,
                currencyData
              )}
              positive
            />

            <SummaryRow
              label="Expenses"
              value={formatMoney(
                totalExpenses,
                currencyData
              )}
              negative
            />

            <div className="summary-divider" />

            <SummaryRow
              label="Net Balance"
              value={formatMoney(
                netBalance,
                currencyData
              )}
              positive={netBalance >= 0}
              negative={netBalance < 0}
            />
          </div>
        </div>
      </section>
    </>
  );
}

/* =========================================================
   TRANSACTIONS PAGE
========================================================= */

function TransactionsPage({
  transactions,
  searchTerm,
  setSearchTerm,
  transactionTypeFilter,
  setTransactionTypeFilter,
  categoryFilter,
  setCategoryFilter,
  currencyData,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) {
  return (
    <>
      <PageHeader
        eyebrow="TRANSACTIONS"
        title="Transactions"
        description="Manage and review your financial information."
      />

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>
              All Transactions
            </h2>

            <p>
              Manage and review all your financial activity.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={onAddTransaction}
          >
            <Plus size={18} />

            <span>
              Add Transaction
            </span>
          </button>
        </div>

        <div className="filters-bar">
          <div className="search-input-wrapper">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              aria-label="Search transactions"
            />

            {searchTerm && (
              <button
                className="clear-search-button"
                onClick={() =>
                  setSearchTerm("")
                }
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <select
            value={transactionTypeFilter}
            onChange={(event) =>
              setTransactionTypeFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All types
            </option>

            <option value="income">
              Income
            </option>

            <option value="expense">
              Expenses
            </option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All categories
            </option>

            {CATEGORIES.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>
        </div>

        <div className="results-count">
          Showing{" "}
          <strong>
            {transactions.length}
          </strong>{" "}
          transaction
          {transactions.length !== 1
            ? "s"
            : ""}
        </div>

        <TransactionList
          transactions={transactions}
          currencyData={currencyData}
          editable
          onEdit={onEditTransaction}
          onDelete={onDeleteTransaction}
        />
      </section>
    </>
  );
}

/* =========================================================
   TRANSACTION LIST
========================================================= */

function TransactionList({
  transactions,
  currencyData,
  editable = false,
  onEdit,
  onDelete,
}) {
  if (!transactions.length) {
    return (
      <div className="empty-state">
        <Wallet size={38} />

        <h3>
          No transactions found
        </h3>

        <p>
          Your financial activity will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      {transactions.map(
        (transaction) => {
          const Icon =
            getCategoryIcon(
              transaction.category
            );

          const isIncome =
            transaction.type ===
            "income";

          const title =
            transaction.title ||
            "Untitled transaction";

          const category =
            transaction.category ||
            "Other";

          return (
            <div
              className="transaction-row"
              key={transaction.id}
            >
              <div className="transaction-icon">
                <Icon size={19} />
              </div>

              <div className="transaction-info">
                <strong>
                  {title}
                </strong>

                <span>
                  {category} ·{" "}
                  {formatDate(
                    transaction.date,
                    currencyData.locale
                  )}
                </span>
              </div>

              <div
                className={`transaction-amount ${
                  isIncome
                    ? "income"
                    : "expense"
                }`}
              >
                {isIncome
                  ? "+"
                  : "-"}
                {formatMoney(
                  transaction.amount,
                  currencyData
                )}
              </div>

              {editable && (
                <div className="transaction-actions">
                  <button
                    className="small-icon-button edit-button"
                    onClick={() =>
                      onEdit(
                        transaction
                      )
                    }
                    title="Edit transaction"
                    aria-label="Edit transaction"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="small-icon-button delete-button"
                    onClick={() =>
                      onDelete(
                        transaction.id
                      )
                    }
                    title="Delete transaction"
                    aria-label="Delete transaction"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          );
        }
      )}
    </div>
  );
}

/* =========================================================
   BUDGETS
========================================================= */

function BudgetsPage({
  budgets,
  addBudget,
  deleteBudget,
  getBudgetSpent,
  currencyData,
}) {
  const [category, setCategory] =
    useState("Food & Dining");

  const [limit, setLimit] =
    useState("");

  function handleAddBudget(event) {
    event.preventDefault();

    if (
      !limit ||
      Number(limit) <= 0
    ) {
      return;
    }

    addBudget(category, limit);

    setLimit("");
  }

  const totalBudget =
    budgets.reduce(
      (total, budget) =>
        total +
        Number(
          budget.limit || 0
        ),
      0
    );

  const totalSpent =
    budgets.reduce(
      (total, budget) =>
        total +
        getBudgetSpent(
          budget.category
        ),
      0
    );

  return (
    <>
      <PageHeader
        eyebrow="BUDGETS"
        title="Budgets"
        description="Plan and control your monthly spending."
      />

      <section className="budget-create-panel panel">
        <div className="section-heading">
          <div className="section-icon">
            <Target size={22} />
          </div>

          <div>
            <h2>
              Create Budget
            </h2>

            <p>
              Set a spending limit for a category.
            </p>
          </div>
        </div>

        <form
          className="budget-form"
          onSubmit={handleAddBudget}
        >
          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
          >
            {CATEGORIES.filter(
              (item) =>
                item !== "Other"
            ).map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <div className="money-input">
            <span>
              {currencyData.symbol}
            </span>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Monthly limit"
              value={limit}
              onChange={(event) =>
                setLimit(
                  event.target.value
                )
              }
            />
          </div>

          <button
            className="primary-button"
            type="submit"
          >
            <Plus size={18} />

            <span>
              Add Budget
            </span>
          </button>
        </form>
      </section>

      <section className="budget-summary-grid">
        <StatCard
          label="Active Budgets"
          value={budgets.length}
          icon={Target}
          variant="neutral"
        />

        <StatCard
          label="Total Budget"
          value={formatMoney(
            totalBudget,
            currencyData
          )}
          icon={Wallet}
          variant="neutral"
        />

        <StatCard
          label="Total Spent"
          value={formatMoney(
            totalSpent,
            currencyData
          )}
          icon={ArrowDownRight}
          variant="negative"
        />
      </section>

      <section className="budget-list">
        {budgets.length ? (
          budgets.map((budget) => {
            const spent =
              getBudgetSpent(
                budget.category
              );

            const limitValue =
              Number(
                budget.limit || 0
              );

            const percentage =
              limitValue > 0
                ? Math.min(
                    (spent /
                      limitValue) *
                      100,
                    100
                  )
                : 0;

            const exceeded =
              spent > limitValue;

            return (
              <div
                className="budget-card panel"
                key={budget.id}
              >
                <div className="budget-card-top">
                  <div className="budget-title">
                    <div className="section-icon">
                      <Target size={20} />
                    </div>

                    <div>
                      <h3>
                        {budget.category}
                      </h3>

                      <span>
                        Monthly budget
                      </span>
                    </div>
                  </div>

                  <button
                    className="small-icon-button delete-button"
                    onClick={() =>
                      deleteBudget(
                        budget.id
                      )
                    }
                    aria-label="Delete budget"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="budget-values">
                  <strong>
                    {formatMoney(
                      spent,
                      currencyData
                    )}
                  </strong>

                  <span>
                    of{" "}
                    {formatMoney(
                      limitValue,
                      currencyData
                    )}
                  </span>
                </div>

                <div className="progress-bar">
                  <div
                    className={`progress-fill ${
                      exceeded
                        ? "danger"
                        : ""
                    }`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <div className="budget-footer">
                  <span>
                    {Math.round(
                      percentage
                    )}
                    % used
                  </span>

                  <strong
                    className={
                      exceeded
                        ? "danger-text"
                        : "success-text"
                    }
                  >
                    {exceeded
                      ? "Over budget"
                      : "On track"}
                  </strong>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state panel">
            <Target size={38} />

            <h3>
              No budgets yet
            </h3>

            <p>
              Create your first budget to start controlling your spending.
            </p>
          </div>
        )}
      </section>
    </>
  );
}

/* =========================================================
   ANALYTICS
========================================================= */

function AnalyticsPage({
  totalIncome,
  totalExpenses,
  savingsRate,
  topCategory,
  categorySpending,
  currencyData,
  netBalance,
}) {
  const categoryEntries =
    Object.entries(
      categorySpending
    ).sort(
      (a, b) => b[1] - a[1]
    );

  return (
    <>
      <PageHeader
        eyebrow="ANALYTICS"
        title="Analytics"
        description="Understand your financial habits and spending patterns."
      />

      <section className="stats-grid">
        <StatCard
          label="Total Income"
          value={formatMoney(
            totalIncome,
            currencyData
          )}
          icon={TrendingUp}
          variant="positive"
        />

        <StatCard
          label="Total Expenses"
          value={formatMoney(
            totalExpenses,
            currencyData
          )}
          icon={ArrowDownRight}
          variant="negative"
        />

        <StatCard
          label="Savings Rate"
          value={`${savingsRate}%`}
          icon={PiggyBank}
          variant="neutral"
        />

        <StatCard
          label="Top Category"
          value={topCategory}
          icon={BarChart3}
          variant="neutral"
        />
      </section>

      <section className="analytics-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>
                Spending by Category
              </h2>

              <p>
                See where your money is going.
              </p>
            </div>

            <BarChart3 size={22} />
          </div>

          <div className="category-list">
            {categoryEntries.length ? (
              categoryEntries.map(
                ([category, amount]) => {
                  const percentage =
                    totalExpenses > 0
                      ? (amount /
                          totalExpenses) *
                        100
                      : 0;

                  return (
                    <div
                      className="category-item"
                      key={category}
                    >
                      <div className="category-item-header">
                        <strong>
                          {category}
                        </strong>

                        <span>
                          {formatMoney(
                            amount,
                            currencyData
                          )}
                        </span>
                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <small>
                        {Math.round(
                          percentage
                        )}
                        % of expenses
                      </small>
                    </div>
                  );
                }
              )
            ) : (
              <div className="empty-state">
                No expense data available.
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>
                Financial Summary
              </h2>

              <p>
                Your current financial position.
              </p>
            </div>

            <Wallet size={22} />
          </div>

          <div className="summary-list large-summary">
            <SummaryRow
              label="Income"
              value={formatMoney(
                totalIncome,
                currencyData
              )}
              positive
            />

            <SummaryRow
              label="Expenses"
              value={formatMoney(
                totalExpenses,
                currencyData
              )}
              negative
            />

            <div className="summary-divider" />

            <SummaryRow
              label="Net Balance"
              value={formatMoney(
                netBalance,
                currencyData
              )}
              positive={
                netBalance >= 0
              }
              negative={
                netBalance < 0
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage({
  darkMode,
  setDarkMode,
  currency,
  setCurrency,
  restoreDemoData,
  deleteAllData,
}) {
  return (
    <>
      <PageHeader
        eyebrow="SETTINGS"
        title="Settings"
        description="Customize your Finora experience."
      />

      <div className="settings-layout">
        <SettingsCard
          icon={
            darkMode
              ? Moon
              : Sun
          }
          title="Appearance"
          description="Customize how Finora looks."
        >
          <div className="setting-row">
            <div>
              <strong>
                Dark Mode
              </strong>

              <span>
                Use a darker color scheme.
              </span>
            </div>

            <button
              className={`toggle ${
                darkMode
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              aria-label="Toggle dark mode"
              aria-pressed={
                darkMode
              }
            >
              <span />
            </button>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={
            CircleDollarSign
          }
          title="Currency"
          description="Choose your preferred currency."
        >
          <div className="setting-row">
            <div>
              <strong>
                Display Currency
              </strong>

              <span>
                Used throughout your dashboard.
              </span>
            </div>

            <select
              className="settings-select"
              value={currency}
              onChange={(event) =>
                setCurrency(
                  event.target.value
                )
              }
            >
              {CURRENCIES.map(
                (item) => (
                  <option
                    key={item.code}
                    value={item.code}
                  >
                    {item.label}
                  </option>
                )
              )}
            </select>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={Database}
          title="Data Management"
          description="Manage your stored financial data."
        >
          <div className="settings-actions">
            <button
              className="secondary-button"
              onClick={
                restoreDemoData
              }
            >
              <RotateCcw size={17} />

              <span>
                Restore Demo Data
              </span>
            </button>

            <button
              className="danger-button"
              onClick={
                deleteAllData
              }
            >
              <Trash2 size={17} />

              <span>
                Delete All Data
              </span>
            </button>
          </div>
        </SettingsCard>

        <div className="privacy-card">
          <Database size={22} />

          <div>
            <h3>
              Your data stays on your device
            </h3>

            <p>
              Finora stores your financial information locally using your browser's local storage.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   SETTINGS CARD
========================================================= */

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="settings-card panel">
      <div className="settings-card-header">
        <div className="section-icon">
          <Icon size={22} />
        </div>

        <div>
          <h2>
            {title}
          </h2>

          <p>
            {description}
          </p>
        </div>
      </div>

      <div className="settings-card-content">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   TRANSACTION MODAL
========================================================= */

function TransactionModal({
  transaction,
  onClose,
  onSave,
}) {
  const [title, setTitle] =
    useState(
      transaction?.title || ""
    );

  const [amount, setAmount] =
    useState(
      transaction?.amount || ""
    );

  const [type, setType] =
    useState(
      transaction?.type ||
        "expense"
    );

  const [category, setCategory] =
    useState(
      transaction?.category ||
        "Food & Dining"
    );

  const [date, setDate] =
    useState(
      transaction?.date ||
        new Date()
          .toISOString()
          .split("T")[0]
    );

  const [error, setError] =
    useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle =
      title.trim();

    const numericAmount =
      Number(amount);

    if (!trimmedTitle) {
      setError(
        "Please enter a transaction name."
      );

      return;
    }

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      setError(
        "Please enter a valid amount."
      );

      return;
    }

    if (!date) {
      setError(
        "Please select a date."
      );

      return;
    }

    setError("");

    onSave({
      title: trimmedTitle,
      amount: numericAmount,
      type,
      category,
      date,
    });
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-modal-title"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <div>
            <span className="page-eyebrow">
              {transaction
                ? "EDIT"
                : "NEW"}
            </span>

            <h2 id="transaction-modal-title">
              {transaction
                ? "Edit Transaction"
                : "Add Transaction"}
            </h2>
          </div>

          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            className="form-error"
            role="alert"
          >
            <AlertTriangle
              size={17}
            />

            <span>
              {error}
            </span>
          </div>
        )}

        <form
          className="transaction-form"
          onSubmit={handleSubmit}
        >
          <label>
            Transaction name

            <input
              type="text"
              placeholder="e.g. Monthly Salary"
              value={title}
              onChange={(event) => {
                setTitle(
                  event.target.value
                );

                setError("");
              }}
              autoFocus
            />
          </label>

          <div className="form-grid">
            <label>
              Amount

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(event) => {
                  setAmount(
                    event.target.value
                  );

                  setError("");
                }}
              />
            </label>

            <label>
              Type

              <select
                value={type}
                onChange={(event) =>
                  setType(
                    event.target.value
                  )
                }
              >
                <option value="expense">
                  Expense
                </option>

                <option value="income">
                  Income
                </option>
              </select>
            </label>
          </div>

          <div className="form-grid">
            <label>
              Category

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
              >
                {CATEGORIES.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Date

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(
                    event.target.value
                  )
                }
              />
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              {transaction
                ? "Save Changes"
                : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   GLOBAL SEARCH
========================================================= */

function GlobalSearchModal({
  searchTerm,
  setSearchTerm,
  onClose,
  onNavigate,
}) {
  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="global-search-modal">
        <div className="modal-header">
          <div>
            <span className="page-eyebrow">
              SEARCH
            </span>

            <h2>
              Search Finora
            </h2>
          </div>

          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        <div className="search-input-wrapper large-search">
          <Search size={20} />

          <input
            autoFocus
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />
        </div>

        <button
          className="search-result-link"
          onClick={() => {
            onNavigate(
              "transactions"
            );

            onClose();
          }}
        >
          <CreditCard size={18} />

          <span>
            Search Transactions
          </span>

          <ChevronRight
            size={17}
          />
        </button>

        <button
          className="search-result-link"
          onClick={() => {
            onNavigate(
              "analytics"
            );

            onClose();
          }}
        >
          <BarChart3 size={18} />

          <span>
            View Analytics
          </span>

          <ChevronRight
            size={17}
          />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function StatCard({
  label,
  value,
  icon: Icon,
  variant = "neutral",
}) {
  return (
    <div
      className={`stat-card ${variant}`}
    >
      <div className="stat-card-top">
        <span>
          {label}
        </span>

        <div className="stat-icon">
          <Icon size={20} />
        </div>
      </div>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  positive,
  negative,
}) {
  return (
    <div className="summary-row">
      <span>
        {label}
      </span>

      <strong
        className={
          positive
            ? "success-text"
            : negative
            ? "danger-text"
            : ""
        }
      >
        {value}
      </strong>
    </div>
  );
}