import '../styles/components/ExpensesView.css'

function ExpensesView({ expenses, splitSummary }) {
  return (
    <div className="expenses-view">

      {/* Expenses List */}
      <div className="expenses-list">
        {expenses.length === 0 ? (
          <div className="empty-section">No expenses added yet.</div>
        ) : (
          expenses.map(expense => (
            <div className="expense-item" key={expense.id}>
              <div className="expense-left">
                <div className="expense-title">{expense.title}</div>
                <div className="expense-paid-by">
                  Paid by {expense.paidBy.firstName} {expense.paidBy.lastName}
                </div>
              </div>
              <div className="expense-amount">
                ₹{expense.amount.toLocaleString('en-IN')}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Split Summary */}
      {splitSummary && expenses.length > 0 && (
        <div className="split-summary">
          <div className="split-summary-title">Settlement Summary</div>

          <div className="split-stats">
            <div className="split-stat">
              <div className="split-stat-label">Total Spent</div>
              <div className="split-stat-value">
                ₹{splitSummary.totalExpenses.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="split-stat">
              <div className="split-stat-label">Per Person</div>
              <div className="split-stat-value">
                ₹{splitSummary.sharePerPerson.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {splitSummary.settlements.length === 0 ? (
            <div className="all-settled">
              ✅ All expenses are settled!
            </div>
          ) : (
            <div className="settlements">
              {splitSummary.settlements.map((s, index) => (
                <div className="settlement-item" key={index}>
                  <span className="settlement-from">{s.from}</span>
                  <span className="settlement-arrow">owes</span>
                  <span className="settlement-to">{s.to}</span>
                  <span className="settlement-amount">₹{s.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default ExpensesView