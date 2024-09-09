import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AddContact.css';

const AddContact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phones, setPhones] = useState(['']);
  const navigate = useNavigate();

  const handlePhoneChange = (index, value) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  const addPhoneField = () => {
    setPhones([...phones, '']);
  };

  const validatePhones = (phones) => {
    // Regular expression to match exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    return phones.every(phone => phoneRegex.test(phone));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhones(phones)) {
      alert('Please enter valid phone numbers. Each phone number should be exactly 10 digits.');
      return;
    }

    const newContact = { name, email, phones };
    try {
      const response = await fetch('http://localhost:5000/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact),
      });

      if (response.ok) {
        setName('');
        setEmail('');
        setPhones(['']);
        navigate('/contacts');
      } else {
        alert('Failed to add contact.');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Failed to add contact. Please try again.');
    }
  };

  return (
    <div className="add-contact-container">
      <h2>Add Contact</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Phones:</label>
          {phones.map((phone, index) => (
            <div key={index} className="phone-field">
              <input
                type="text"
                value={phone}
                onChange={(e) => handlePhoneChange(index, e.target.value)}
                required
                pattern="\d{10}"
                title="Phone number must be exactly 10 digits"
              />
              {index === phones.length - 1 && (
                <button type="button" className="add-phone-btn" onClick={addPhoneField}>
                  +
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="submit" className="submit-btn">Add</button>
      </form>
    </div>
  );
};

export default AddContact;
