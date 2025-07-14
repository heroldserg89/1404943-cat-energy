class FinanceApp {
    constructor() {
        this.transactions = this.loadTransactions();
        this.currentFilter = 'all';
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.updateBalance();
        this.renderTransactions();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        // Filter change
        document.getElementById('filterType').addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.renderTransactions();
        });

        // Type change to update categories
        document.getElementById('type').addEventListener('change', (e) => {
            this.updateCategories(e.target.value);
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    updateCategories(type) {
        const categorySelect = document.getElementById('category');
        const options = categorySelect.querySelectorAll('option');
        
        options.forEach(option => {
            if (option.value === '') return;
            
            const optgroup = option.parentElement;
            if (type === 'income' && optgroup.label === 'Доходы') {
                option.style.display = 'block';
            } else if (type === 'expense' && optgroup.label === 'Расходы') {
                option.style.display = 'block';
            } else if (option.value !== '') {
                option.style.display = 'none';
            }
        });
        
        categorySelect.value = '';
    }

    addTransaction() {
        const form = document.getElementById('transactionForm');
        const formData = new FormData(form);
        
        const transaction = {
            id: Date.now().toString(),
            description: formData.get('description') || document.getElementById('description').value,
            amount: parseFloat(document.getElementById('amount').value),
            category: document.getElementById('category').value,
            type: document.getElementById('type').value,
            date: document.getElementById('date').value,
            timestamp: new Date().toISOString()
        };

        // Validation
        if (!this.validateTransaction(transaction)) {
            return;
        }

        this.transactions.unshift(transaction);
        this.saveTransactions();
        this.updateBalance();
        this.renderTransactions();
        this.resetForm();
        this.showNotification('Транзакция успешно добавлена!', 'success');
    }

    validateTransaction(transaction) {
        if (!transaction.description.trim()) {
            this.showNotification('Введите описание транзакции', 'error');
            return false;
        }
        if (!transaction.amount || transaction.amount <= 0) {
            this.showNotification('Введите корректную сумму', 'error');
            return false;
        }
        if (!transaction.category) {
            this.showNotification('Выберите категорию', 'error');
            return false;
        }
        if (!transaction.type) {
            this.showNotification('Выберите тип транзакции', 'error');
            return false;
        }
        if (!transaction.date) {
            this.showNotification('Выберите дату', 'error');
            return false;
        }
        return true;
    }

    deleteTransaction(id) {
        if (confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            this.updateBalance();
            this.renderTransactions();
            this.showNotification('Транзакция удалена', 'success');
        }
    }

    updateBalance() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const total = income - expense;

        document.getElementById('totalIncome').textContent = this.formatCurrency(income);
        document.getElementById('totalExpense').textContent = this.formatCurrency(expense);
        document.getElementById('totalBalance').textContent = this.formatCurrency(total);

        // Update balance colors
        const totalElement = document.getElementById('totalBalance');
        totalElement.style.color = total >= 0 ? '#10b981' : '#ef4444';
    }

    renderTransactions() {
        const container = document.getElementById('transactionsList');
        let filteredTransactions = this.transactions;

        // Apply filter
        if (this.currentFilter !== 'all') {
            filteredTransactions = this.transactions.filter(t => t.type === this.currentFilter);
        }

        if (filteredTransactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>${this.currentFilter === 'all' ? 'Пока нет транзакций' : 'Нет транзакций выбранного типа'}</p>
                    <p class="empty-state__subtitle">Добавьте первую транзакцию выше</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredTransactions.map(transaction => 
            this.createTransactionHTML(transaction)
        ).join('');

        // Add fade-in animation
        container.classList.add('fade-in');
        setTimeout(() => container.classList.remove('fade-in'), 500);
    }

    createTransactionHTML(transaction) {
        const isIncome = transaction.type === 'income';
        const icon = this.getCategoryIcon(transaction.category);
        const categoryName = this.getCategoryName(transaction.category);
        const formattedDate = this.formatDate(transaction.date);
        
        return `
            <div class="transaction transaction--${transaction.type}">
                <div class="transaction__left">
                    <div class="transaction__icon transaction__icon--${transaction.type}">
                        <i class="fas fa-${icon}"></i>
                    </div>
                    <div class="transaction__details">
                        <h3>${transaction.description}</h3>
                        <div class="transaction__meta">
                            <span class="transaction__category">${categoryName}</span>
                            <span class="transaction__date">${formattedDate}</span>
                        </div>
                    </div>
                </div>
                <div class="transaction__right">
                    <div class="transaction__amount transaction__amount--${transaction.type}">
                        ${isIncome ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                    </div>
                    <button class="btn btn--danger" onclick="app.deleteTransaction('${transaction.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    getCategoryIcon(category) {
        const icons = {
            // Income
            'salary': 'briefcase',
            'freelance': 'laptop-code',
            'investment': 'chart-line',
            'gift': 'gift',
            'other-income': 'plus-circle',
            
            // Expense
            'food': 'utensils',
            'transport': 'car',
            'entertainment': 'gamepad',
            'bills': 'file-invoice-dollar',
            'shopping': 'shopping-cart',
            'health': 'heartbeat',
            'education': 'graduation-cap',
            'other-expense': 'minus-circle'
        };
        return icons[category] || 'circle';
    }

    getCategoryName(category) {
        const names = {
            // Income
            'salary': 'Зарплата',
            'freelance': 'Фриланс',
            'investment': 'Инвестиции',
            'gift': 'Подарок',
            'other-income': 'Другое',
            
            // Expense
            'food': 'Еда',
            'transport': 'Транспорт',
            'entertainment': 'Развлечения',
            'bills': 'Коммунальные услуги',
            'shopping': 'Покупки',
            'health': 'Здоровье',
            'education': 'Образование',
            'other-expense': 'Другое'
        };
        return names[category] || category;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(date);
    }

    resetForm() {
        document.getElementById('transactionForm').reset();
        this.setDefaultDate();
        document.getElementById('category').value = '';
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        notification.querySelector('.notification__content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    saveTransactions() {
        localStorage.setItem('financeApp_transactions', JSON.stringify(this.transactions));
    }

    loadTransactions() {
        const saved = localStorage.getItem('financeApp_transactions');
        return saved ? JSON.parse(saved) : [];
    }

    // Export data
    exportData() {
        const data = {
            transactions: this.transactions,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Данные экспортированы', 'success');
    }

    // Import data
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.transactions && Array.isArray(data.transactions)) {
                    this.transactions = data.transactions;
                    this.saveTransactions();
                    this.updateBalance();
                    this.renderTransactions();
                    this.showNotification('Данные импортированы', 'success');
                } else {
                    this.showNotification('Неверный формат файла', 'error');
                }
            } catch (error) {
                this.showNotification('Ошибка при импорте данных', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Clear all data
    clearAllData() {
        if (confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
            this.transactions = [];
            this.saveTransactions();
            this.updateBalance();
            this.renderTransactions();
            this.showNotification('Все данные удалены', 'success');
        }
    }
}

// Initialize app
const app = new FinanceApp();

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const form = document.getElementById('transactionForm');
        if (document.activeElement && form.contains(document.activeElement)) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    }
});

// Add data management functions to window for console access
window.financeApp = {
    export: () => app.exportData(),
    clear: () => app.clearAllData(),
    getStats: () => {
        const income = app.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = app.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const total = income - expense;
        const transactionCount = app.transactions.length;
        
        console.log(`
Статистика финансов:
━━━━━━━━━━━━━━━━━━━━
💰 Общий баланс: ${app.formatCurrency(total)}
📈 Доходы: ${app.formatCurrency(income)}
📉 Расходы: ${app.formatCurrency(expense)}
📊 Транзакций: ${transactionCount}
━━━━━━━━━━━━━━━━━━━━
        `);
        
        return { income, expense, total, transactionCount };
    }
};