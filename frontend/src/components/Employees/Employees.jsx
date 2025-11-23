import { useState, useEffect } from 'react';
import axios from 'axios';
import './Employees.css';
import { useNavigate } from 'react-router-dom';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate()

  
  useEffect(()=>{
    const getFetchData = async()=>{
     try{
      const res = await axios.get('http://localhost:4040/employees', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
      setEmployees(res.data)
      setError('')

     }catch(e){
      console.error('Error to fetch the employees data', e);
      setError('Failed to fetch teams. Please try again later.')

     }
  
    }
    getFetchData()
  }, [])

  const onAddEmployee =()=>{
    navigate('/employeeform', {replace:true})
  }

  const ClickBackBtn=()=>{
    navigate('/dashboard', {replace:true})
  }

  const handleDelete=async(id)=>{
    try {
      await axios.delete(`http://localhost:4040/employees/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err) {
      setError('Failed to delete employee');
      console.error(err);
    }
  }
  return (
    <div className="userTable">
      <button className='button' onClick={onAddEmployee}>ADD</button>
      <button className='button' onClick={ClickBackBtn}>Back</button>
      <h2>Employees List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <table className="table table-bordered ">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created_at</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.created_at}</td>
                <td>
                <button
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(emp.id)} 
                >
                  Delete
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}

export default Employees;
