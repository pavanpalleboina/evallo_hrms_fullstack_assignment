import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeForm.css';

function EmployeeForm() {
  const navigate = useNavigate();
  const [organisation_id, setOrganisationId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(0)

  useEffect(()=>{
    const getFetchData = async()=>{
     try{
      const res = await axios.get('http://localhost:4040/organizations', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
      setOrganizations(res.data)
     }catch(e){
      console.error('Error to fetch the employees data', e);
      setOrganizations([])
     }
  
    }
    getFetchData()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
        await axios.post('http://localhost:4040/employees', {
          organization_id: selectedOrganizationId,
          name,
          email,
        })
        setSuccess('Employee added successfully!');
      
      setTimeout(() => {
        navigate('/employees');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const onChangeOrganisation = (e) => {
    const id = parseInt(e.target.value)
    setSelectedOrganizationId(id)
  }

  return (
    <div className='form-container'>
      <form className='form' onSubmit={onSubmit}>
        <h3 className='title'>Add Employee!</h3>
        {error && <p style={{ color:'red' }}>{error}</p>}
        {success && <p style={{ color:'green' }}>{success}</p>}
        <select value={selectedOrganizationId} onChange={onChangeOrganisation}>
          {organizations.map((each,index) => (
            <option key={index} value={each.id} >{each.name}</option>
          ))}
        </select>
        <input
          required
          className='input-field'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          required
          className='input-field'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className='button' type='submit'>
          ADD
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
