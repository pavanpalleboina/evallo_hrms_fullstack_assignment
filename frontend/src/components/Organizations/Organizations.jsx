import { useState, useEffect } from 'react';
import axios from 'axios';
import './Organizations.css';
import { useNavigate } from 'react-router-dom';


function Organizations() {
  const [organization, setOrganization] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate()

  useEffect(()=>{
    const getFetchData = async()=>{
     try{
      const res = await axios.get('http://localhost:4040/organizations', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
      setOrganization(res.data)
      setError('')

     }catch(e){
      console.error('Error to fetch the employees data', e);
      setError('Failed to fetch teams. Please try again later.')

     }
  
    }
    getFetchData()
  }, [])

  const onAddOrganization =()=>{
    navigate('/organizationForm', {replace:true})
  }

  const clickBackBtn =()=>{
    navigate('/dashboard', {replace:true})
  }

  const handleDelete=async(id)=>{
    try {
      await axios.delete(`http://localhost:4040/organizations/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
      setOrganization(organization.filter(each => each.id !== id));
    } catch (err) {
      setError('Failed to delete employee');
      console.error(err);
    }
  }
  return (
    <div className="userTable">
      <div>
        <div className='header'>
            <button className='button' onClick={onAddOrganization}>ADD</button>
             <button className='button' onClick={clickBackBtn}>Back</button>
        </div>
        <h2>Organizations List</h2>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <table className="table table-bordered ">
          <thead>
            <tr>
              <th>Name</th>
              <th>Created_at</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {organization.map(each => (
              <tr key={each.id}>
                <td>{each.name}</td>
                <td>{each.created_at}</td>
                <td>
                <button
                  className="edit-btn"
                  onClick={() => clickEditBtn()}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(each.id)}
                  aria-label={`Delete ${each.id} `}
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

export default Organizations;
