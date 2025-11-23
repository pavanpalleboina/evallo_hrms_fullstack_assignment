import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './AssignEmployeeToTeamForm.css';

function AssignEmployeeToTeamForm() {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, teamRes] = await Promise.all([
          axios.get('http://localhost:4040/employees', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:4040/teams', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setEmployees(empRes.data);
        setTeams(teamRes.data);
      } catch {
        setError('Failed to load employees or teams');
      }
    };
    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!selectedEmployee || !selectedTeam) {
      setError('Please select both an employee and a team.');
      return;
    }
    try {
      await axios.post('http://localhost:4040/employeeteams', {
        employee_id: selectedEmployee,
        team_id: selectedTeam,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Employee assigned to team successfully!');
      setSelectedEmployee('');
      setSelectedTeam('');
      setTimeout(() => {
        navigate("/employeeToTeamList");
      }, 1000);
    } catch (error) {
      setError('Failed to assign employee to team: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className='form-container'>
      <form className='form' onSubmit={handleSubmit}>
        <h3 className='title'>Assign Employee to Team</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        
        <select
          className='input-field'
          value={selectedEmployee}
          onChange={e => setSelectedEmployee(e.target.value)}
          required
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name} - {emp.email}</option>
          ))}
        </select>

        <select
          className='input-field'
          value={selectedTeam}
          onChange={e => setSelectedTeam(e.target.value)}
          required
          style={{ marginTop: 10 }}
        >
          <option value="">Select Team</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>

        <button type="submit" className='button'>Assign</button>
      </form>
    </div>
  );
}

export default AssignEmployeeToTeamForm;
