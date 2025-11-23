import { useState, useEffect } from 'react';
import axios from 'axios';
import './AssignEmployeeToTeam.css'

function AssignEmployeeToTeam() {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await axios.get('http://localhost:4040/employees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const teamRes = await axios.get('http://localhost:4040/teams', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(empRes.data);
        setTeams(teamRes.data);
        setSuccess('Employee to team assign successfully!');
      } catch (error) {
        setMessage('Failed to load employees or teams');
      }
    };
    fetchData();
  }, [token]);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!selectedEmployee || !selectedTeam) {
      setMessage('Please select both an employee and a team.');
      return;
    }
    try {
      await axios.post('http://localhost:4040/employeeteams', {
        employee_id: selectedEmployee,
        team_id: selectedTeam
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Employee assigned to team successfully!');
      setSelectedEmployee('');
      setSelectedTeam('');
    } catch (error) {
      setMessage('Failed to assign employee to team: ' + error.message);
    }
  };

  return (
    <div className='form-container'>
      <form className='form' onSubmit={handleSubmit}>
        <h3 className='title'>Assign Employee to Team</h3>
        {error && <p style={{ color:'red' }}>{error}</p>}
        {success && <p style={{ color:'green' }}>{success}</p>}
        <select
          className='input-field'
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
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
          onChange={(e) => setSelectedTeam(e.target.value)}
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

export default AssignEmployeeToTeam;
