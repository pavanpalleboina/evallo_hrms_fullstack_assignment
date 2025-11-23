import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeamForm.css";

function TeamForm() {
  const [organisationId, setOrganisationId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(0);

  useEffect(() => {
    const getFetchData = async () => {
      try {
        const res = await axios.get("http://localhost:4040/organizations", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrganizations(res.data);
      } catch (e) {
        console.error("Error to fetch the employees data", e);
        setOrganizations([]);
      }
    };
    getFetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:4040/teams",
        {
          organization_id: selectedOrganizationId,
          name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccess("Team added successfully!");
      console.log(res);
      setTimeout(() => {
        navigate("/teams");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const onChangeOrganisation = (e) => {
    const id = parseInt(e.target.value);
    setSelectedOrganizationId(id);
  };

  useEffect(() => {
    setSelectedOrganizationId(organizations[0]?.id)
  }, [organizations])

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h3 className="title">Add Team</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <select
          className="input-field"
          value={selectedOrganizationId}
          onChange={onChangeOrganisation}
        >
          {organizations.map((each, index) => (
            <option key={index} value={each.id}>
              {each.name}
            </option>
          ))}
        </select>
        <input
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          required
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="button">
          ADD
        </button>
      </form>
    </div>
  );
}

export default TeamForm;
