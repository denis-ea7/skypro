import React, { useState, useEffect } from 'react';
import './App.css';

const CATEGORIES = [
  { id: 'food', name: 'Еда', icon: '🛒' },
  { id: 'transport', name: 'Транспорт', icon: '🚗' },
  { id: 'housing', name: 'Жилье', icon: '🏠' },
  { id: 'entertainment', name: 'Развлечения', icon: '🎉' },
  { id: 'education', name: 'Образование', icon: '🎓' },
  { id: 'other', name: 'Другое', icon: '📎' }
];

const INITIAL_EXPENSES = [
  { id: 1, description: 'Пятерочка', category: 'food', date: '03.07.2024', amount: 3500 },
  { id: 2, description: 'Яндекс Такси', category: 'transport', date: '03.07.2024', amount: 730 },
  { id: 3, description: 'Аптека Вита', category: 'other', date: '03.07.2024', amount: 1200 },
  { id: 4, description: 'Бургер Кинг', category: 'food', date: '03.07.2024', amount: 950 },
  { id: 5, description: 'Деливери', category: 'food', date: '02.07.2024', amount: 1320 },
  { id: 6, description: 'Кофейня №1', category: 'food', date: '02.07.2024', amount: 400 },
  { id: 7, description: 'Бильярд', category: 'entertainment', date: '29.06.2024', amount: 600 },
  { id: 8, description: 'Перекресток', category: 'food', date: '29.06.2024', amount: 2360 },
  { id: 9, description: 'Лукойл', category: 'transport', date: '29.06.2024', amount: 1000 },
  { id: 10, description: 'Летуаль', category: 'other', date: '29.06.2024', amount: 4300 },
  { id: 11, description: 'Яндекс Такси', category: 'transport', date: '28.06.2024', amount: 320 },
  { id: 12, description: 'Перекресток', category: 'food', date: '28.06.2024', amount: 1360 },
  { id: 13, description: 'Деливери', category: 'food', date: '28.06.2024', amount: 2320 },
  { id: 14, description: 'Вкусвилл', category: 'food', date: '27.06.2024', amount: 1220 },
  { id: 15, description: 'Кофейня №1', category: 'food', date: '27.06.2024', amount: 920 },
  { id: 16, description: 'Вкусвилл', category: 'food', date: '26.06.2024', amount: 840 },
  { id: 17, description: 'Кофейня №1', category: 'food', date: '26.06.2024', amount: 920 }
];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [formData, setFormData] = useState({
    description: '',
    category: 'food',
    date: '',
    amount: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    } else {
      setExpenses(INITIAL_EXPENSES);
      localStorage.setItem('expenses', JSON.stringify(INITIAL_EXPENSES));
    }
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('.');
    return new Date(year, month - 1, day);
  };

  const formatDate = (dateStr) => {
    return dateStr;
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filteredCategory === 'all') return true;
    return expense.category === filteredCategory;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.date || !formData.amount) return;

    const newExpense = {
      id: Date.now(),
      description: formData.description,
      category: formData.category,
      date: formData.date,
      amount: parseInt(formData.amount)
    };

    setExpenses([newExpense, ...expenses]);
    setFormData({
      description: '',
      category: 'food',
      date: '',
      amount: ''
    });
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const getCategoryName = (categoryId) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getCategoryIcon = (categoryId) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.icon : '';
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽';
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">Skypro.Wallet</div>
          <nav className="nav">
            <a href="#expenses" className="nav-link active">Мои расходы</a>
            <a href="#analysis" className="nav-link">Анализ расходов</a>
            <button className="logout-btn">Выйти</button>
          </nav>
        </div>
      </header>

      <div className="container">
        <div className="main-card">
          <h1 className="page-title">Мои расходы</h1>
          
          <div className="content-wrapper">
            <div>
              <h2 className="section-title">Таблица расходов</h2>
              
              <div className="filters">
                <div className="filter-group">
                  <label className="filter-label">Фильтровать по категории</label>
                  <select
                    className="filter-select"
                    value={filteredCategory}
                    onChange={(e) => setFilteredCategory(e.target.value)}
                  >
                    <option value="all">Все категории</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sort-group">
                  <span className="sort-label">Сортировать по дате:</span>
                  <button
                    className={`sort-option ${sortOrder === 'desc' ? '' : 'inactive'}`}
                    onClick={() => setSortOrder('desc')}
                  >
                    новым
                  </button>
                  <button
                    className={`sort-option ${sortOrder === 'asc' ? '' : 'inactive'}`}
                    onClick={() => setSortOrder('asc')}
                  >
                    старым
                  </button>
                </div>
              </div>

              {sortedExpenses.length === 0 ? (
                <div className="empty-state">Нет расходов</div>
              ) : (
                <table className="expenses-table">
                  <thead>
                    <tr>
                      <th>Описание</th>
                      <th>Категория</th>
                      <th>Дата</th>
                      <th>Сумма</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedExpenses.map(expense => (
                      <tr key={expense.id}>
                        <td>{expense.description}</td>
                        <td>
                          <span>{getCategoryIcon(expense.category)} </span>
                          {getCategoryName(expense.category)}
                        </td>
                        <td>{formatDate(expense.date)}</td>
                        <td>{formatAmount(expense.amount)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn"
                              onClick={() => handleDelete(expense.id)}
                              aria-label="Удалить"
                            >
                              <svg fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div>
              <h2 className="section-title">Новый расход</h2>
              
              <form onSubmit={handleAddExpense}>
                <div className="form-group">
                  <label className="form-label">Описание</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Введите описание"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Категория</label>
                  <div className="category-selector">
                    {CATEGORIES.map(category => (
                      <button
                        key={category.id}
                        type="button"
                        className={`category-btn ${formData.category === category.id ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, category: category.id })}
                      >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Дата</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Введите дату (ДД.ММ.ГГГГ)"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Сумма</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Введите сумму"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Добавить новый расход
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
