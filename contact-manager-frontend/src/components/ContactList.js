import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './styles/ContactList.css';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/contacts')
      .then(response => setContacts(response.data))
      .catch(error => console.error(error));
  }, []);

  const deleteContact = (id) => {
    axios.delete(`http://localhost:5000/contacts/${id}`)
      .then(() => setContacts(contacts.filter(contact => contact._id !== id)))
      .catch(error => console.error(error));
  };

  return (
    <div className="contact-list">
      <h2>Contact List</h2>
      <Link to="/add" className="add-contact">Add Contact</Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Numbers</th>
            <th className="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact._id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>
                {Array.isArray(contact.phones) && contact.phones.length > 0 ? (
                  contact.phones.length === 1 ? (
                    contact.phones[0]
                  ) : (
                    <ul>
                      {contact.phones.map((phone, index) => (
                        <li key={index}>{phone}</li>
                      ))}
                    </ul>
                  )
                ) : (
                  'No phone numbers available'
                )}
              </td>
              <td className="actions-column">
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="action-icon"
                  onClick={() => deleteContact(contact._id)}
                />
                <Link to={`/edit/${contact._id}`}>
                  <FontAwesomeIcon icon={faEdit} className="action-icon edit" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;
