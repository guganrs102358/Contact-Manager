import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/EditContact.css';

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phones, setPhones] = useState(['']);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(`http://localhost:5000/contacts/${id}`);
        const contact = await response.json();
        setName(contact.name);
        setEmail(contact.email);
        setPhones(contact.phones || ['']); // Handle case where phones might be undefined
      } catch (error) {
        console.error('Error fetching contact:', error);
      }
    };

    fetchContact();
  }, [id]);

  const handlePhoneChange = (index, value) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  const addPhoneField = () => {
    setPhones([...phones, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedContact = { name, email, phones };
    try {
      const response = await fetch(`http://localhost:5000/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContact),
      });

      if (response.ok) {
        navigate('/contacts');
      } else {
        alert('Failed to update contact.');
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact. Please try again.');
    }
  };

  return (
    <div className="edit-contact-container">
      <h2>Edit Contact</h2>
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
        <button type="submit" className="submit-btn">Update</button>
      </form>
    </div>
  );
};

export default EditContact;
