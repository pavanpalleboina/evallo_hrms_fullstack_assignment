import { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchTeamsData = async ()=>{
      try{
        const res = await axios.get('http://localhost:4040/teams', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        setTeams(res.data)
        setError('')
      }catch(e){
          console.error('Error team names',e)
          setError('Failed to fetch teams. Please try again later.');
      }
    }
    fetchTeamsData();
  }, [])

  const onAddTeam =()=>{
        navigate('/teamForm',{replace:true})
  }

  const clickBackBtn =()=>{
    navigate('/dashboard' , {replace:true})
  }

  const handleDelete =async(id)=>{
    try{
      await axios.delete(`http://localhost:4040/teams/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
      setTeams(teams.filter(team=>team.id !== id));
    }catch(e){
      setError('Failed to delete team');
      console.error(err);
    }
  }
    
  return (
    <div className="userTable">
      <button className='button' onClick={onAddTeam}>ADD</button>
      <button className='button' onClick={clickBackBtn}>Back</button>
      <h2>Teams List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <table className="table table-bordered ">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(each => (
              <tr key={each.id}>
                <td>{each.name}</td>
                <td>{each.description}</td>
                <td>
                <button
                  className="edit-btn"
                  onClick={() => clickEditBtn(each)}
                  aria-label={`Edit ${each.name} ${each.description}`}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(each.id)}
                  aria-label={`Delete ${each.name} ${each.description}`}
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

export default Teams;
