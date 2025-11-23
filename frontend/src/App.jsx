import {Routes,Route,Navigate} from 'react-router-dom'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Dashboard from './components/Dashboard/Dashboard'
import OrganizationForm from './components/OrganizationForm/OrganizationForm'
import EmployeeForm from './components/EmployeeForm/EmployeeForm'
import TeamForm from './components/TeamForm/TeamForm'
import Organizations from './components/Organizations/Organizations'
import Employees from './components/Employees/Employees'
import Teams  from './components/Teams/Teams'
import AssignEmployeeToTeam from './components/AssignEmployeeToTeam/AssignEmployeeToTeam'

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/organizationForm' element={<OrganizationForm/>}/>
      <Route path='/employeeform' element={<EmployeeForm/>}/>
      <Route path='/TeamForm' element={<TeamForm/>}/>
      <Route path='/teams' element={<Teams/>}/>
      <Route path='/employees' element={<Employees/>}/>
      <Route path='/organizations' element={<Organizations/>}/>
      <Route path='/assignEmployeeToTeam' element={<AssignEmployeeToTeam/>}/>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>

  )
}

export default App
