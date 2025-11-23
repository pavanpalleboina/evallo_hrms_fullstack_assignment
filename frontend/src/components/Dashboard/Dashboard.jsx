import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate, NavLink } from "react-router-dom";

function Dashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4040/organizations",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrganizations(res.data);
      } catch (err) {
        console.error(err);
        setOrganizations([]);
      }
    };

    fetchOrganization();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4040/employees",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEmployees(res.data); 
      } catch (err) {
        console.error(err);
        setEmployees([]); 
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4040/teams",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTeams(res.data); 
      } catch (err) {
        console.error(err);
       setTeams([]); 
      }
    };

    fetchTeams();
  }, []);

  const onClickLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const clickjoinBtn =()=>{
    navigate("/assignEmployeeToTeamForm", {replace:true})
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Dashboard</h1>
        <div>
            <button className="logout" onClick={onClickLogout}>Logout</button>
        </div>
      </div>
      <div className="cards-container">
        <NavLink to="/organizations" className="card">
          <h2 className="card-number">{organizations?.length}</h2>
          <p className="card-label">Organizations</p>
        </NavLink>
        &nbsp;
        <NavLink to="/employees" className="card">
          <h2 className="card-number">{employees?.length}</h2>
          <p className="card-label">Employees</p>
        </NavLink>
        &nbsp;
        <NavLink to="/teams" className="card">
          <h2 className="card-number">{teams?.length}</h2>
          <p className="card-label">Teams</p>
        </NavLink>
      </div>
      <div>
      </div>
      <button onClick={clickjoinBtn}>Join Teams</button>
    </div>
  );
}

export default Dashboard;
