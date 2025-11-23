import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrganizationForm.css';

function OrganizationForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const onAddDetails = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:4040/organizations', {name,}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
      setSuccess('Organization added successfully!');
      setTimeout(() => {
        navigate("/organizations");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className='form-container'>
      <form className='form' onSubmit={onAddDetails}>
        <h3 className='title'>Update Organization!</h3>
        {error && <p style={{color:'red'}}>{error}</p>}
        {success && <p style={{color:'green'}}>{success}</p>}
        <input
          required
          className='input-field'
          placeholder='Organization Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <button className='button' type='submit' >
            ADD
          </button>
        </div>
      </form>
    </div>
  );
}

export default OrganizationForm;
