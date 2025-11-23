import { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeToTeamList.css';
import { useNavigate } from 'react-router-dom';

function EmployeeToTeamList() {
  const [assignments, setAssignments] = useState([]);
  const [employeesMap, setEmployeesMap] = useState({});
  const [teamsMap, setTeamsMap] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get('http://localhost:4040/employeeteams', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssignments(res.data);
        setError('');
      } catch (e) {
        setError('Failed to fetch assignments.');
      }
    };
    fetchAssignments();
  }, [token]);

  // Fetch employees and teams to build maps (id -> name)
  useEffect(() => {
    const fetchEmployeesAndTeams = async () => {
      try {
        const [empRes, teamRes] = await Promise.all([
          axios.get('http://localhost:4040/employees', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:4040/teams', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const employeesMap = empRes.data.reduce((acc, emp) => {
          acc[emp.id] = emp.name;
          return acc;
        }, {});
        const teamsMap = teamRes.data.reduce((acc, team) => {
          acc[team.id] = team.name;
          return acc;
        }, {});
        setEmployeesMap(employeesMap);
        setTeamsMap(teamsMap);
      } catch (e) {
        setError('Failed to load employee or team names.');
      }
    };
    fetchEmployeesAndTeams();
  }, [token]);

  const onAddAssignment = () => {
    navigate('/assignEmployeeToTeam', { replace: true });
  };

  const clickBackBtn = () => {
    navigate('/dashboard', { replace: true });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4040/employeeteams/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(assignments.filter(assign => assign.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete assignment');
    }
  };

  return (
    <div className="userTable">
      <div className="buttons-top">
        <button className="button" onClick={onAddAssignment}>ADD</button>
        <button className="button" onClick={clickBackBtn}>Back</button>
      </div>
      <h2>Employee-Team Assignments</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Team</th>
            <th>Created At</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No assignments found.</td>
            </tr>
          ) : (
            assignments.map(assign => (
              <tr key={assign.id}>
                <td>{employeesMap[assign.employee_id] || assign.employee_id}</td>
                <td>{teamsMap[assign.team_id] || assign.team_id}</td>
                <td>{new Date(assign.created_at).toLocaleString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(assign.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeToTeamList;
