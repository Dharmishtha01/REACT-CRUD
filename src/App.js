import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('items');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [form, setForm] = useState({
    name: '',
    contact: '',
    email: '',
    password: '',
    age: ''
  });

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ''
    });

  };

  const validate = () => {
    let tempErrors = {};
    if (!form.name.trim()) tempErrors.name = "Name is required."

    if (!form.contact.trim()) tempErrors.contact = "Contact number is required"
    else if (!/^\d{10}$/.test(form.contact)) tempErrors.contact = "Allowes 10 digits and number's only"

    if (!form.email.trim()) tempErrors.email = "Email is required."
    else if (!/\S+@\S+\.\S+/.test(form.email)) tempErrors.email = "Email is invalid."
    else if (items.some(item => item.email === form.email && item.email !== items[editId]?.email)) tempErrors.email = "Email is already used."


    if (!form.age.trim()) tempErrors.age = "Age is required.";
    else if (isNaN(form.age) || form.age < 18 || form.age > 120) tempErrors.age = "Age must be a number between 18 and 120.";

    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!form.password) tempErrors.password = "password is required."
    else if (!strongPasswordPattern.test(form.password)) {
      tempErrors.password = "password should be 8 character ,include uppercase, lowercase, number & special character.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (editId !== null) {
        const updatedItems = items.map((item, index) =>
          index === editId ? form : item
        );
        setItems(updatedItems);
        setEditId(null);
      } else {
        setItems([...items, form]);
      }
      handleReset()
      displaySuccessMessage();
    }
  };

  const handleEdit = (index) => {
    setEditId(index);
    setForm(items[index]);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    }
  };

  const handleDeleteAll = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete all items?")) {
      setItems([]);
      localStorage.removeItem('items');
    }
  };

  const displaySuccessMessage = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleReset = () => {
    setForm({ name: '', contact: '', email: '', age: '', password: '' });
    setErrors({});
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contact.includes(searchTerm) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.age.toString().includes(searchTerm)
  );

  return (
    <div className="App">
      {showSuccessMessage && <div className="success-message">Item saved successfully!</div>}
      <div className="header">
        <h1>REACT CRUD APP</h1>
        <input
          type="text"
          placeholder="Search here..."
          value={searchTerm}
          onChange={handleSearch}
          className="search"
        />
      </div>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={form.contact}
          onChange={handleChange}
        />
        {errors.contact && <p className="error">{errors.contact}</p>}
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}
        <input
          type="text"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />
        {errors.age && <p className="error">{errors.age}</p>}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}
        <div>
          <button type="submit" className={editId !== null ? 'update' : ''}>
            {editId !== null ? 'Update' : 'Add'}
          </button>
          <button type="button" onClick={handleReset} className="reset">
            Reset Fields
          </button>
          <button onClick={handleDeleteAll} className="delete">Delete All Data</button>
        </div>
      </form>
      <table>
        <thead>
          <tr>
            <th>Index No</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan="6" className={searchTerm ? 'noSearchResultsMsg' : 'noItemsMsg'}>
                {searchTerm ? 'No search Found' : 'No Items to Display!! please Add first'}
              </td>
            </tr>
          ) : (
            filteredItems.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.contact}</td>
                <td>{item.email}</td>
                <td>{item.age}</td>
                <td>
                  <button onClick={() => handleEdit(index)} className="edit">Edit</button>
                  <button onClick={() => handleDelete(index)} className="delete" >Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
