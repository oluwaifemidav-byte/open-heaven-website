document.addEventListener("DOMContentLoaded", () => {
  const config = window.CHURCH_CONFIG || {};
  const accounts = Array.isArray(config.givingAccounts) && config.givingAccounts.length
    ? config.givingAccounts
    : [config.givingAccount || {}].filter(Boolean);

  const accountList = document.getElementById("accountList");
  if (accountList) {
    accountList.innerHTML = accounts.map((account, index) => {
      const label = account.label || account.accountType || (index === 0 ? "Tithe and Offering" : "Project");
      return `
        <div class="account-group">
          ${accounts.length > 1 ? `<div class="account-title">${label}</div>` : ""}
          <div class="account-row"><span>Bank</span><strong>${account.bank || "Bank name"}</strong></div>
          <div class="account-row"><span>Account Name</span><strong>${account.accountName || "Church account name"}</strong></div>
          <div class="account-row"><span>Account Number</span><strong>${account.accountNumber || "Account number"}</strong></div>
          <div class="account-row"><span>Type</span><strong>${account.accountType || "Offering type"}</strong></div>
        </div>
      `;
    }).join("");
  }

  const setText = (id, value, fallback) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = value || fallback || "Update in church-config.js";
  };

  const singleAccount = config.givingAccount || accounts[0] || {};
  setText("bankName", singleAccount.bank, "Bank name");
  setText("accountName", singleAccount.accountName, "Church account name");
  setText("accountNumber", singleAccount.accountNumber, "Account number");
  setText("accountType", singleAccount.accountType, "Offering type");

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
