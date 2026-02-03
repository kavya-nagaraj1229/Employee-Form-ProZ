import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "./Form";
import Designation from "./Designation";
import Task from "./Task";
import Status from "./Status";

function App() {
  const stateCityMap = {
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    Kerala: ["Kochi", "Trivandrum", "Kozhikode"],
    Karnataka: ["Bangalore", "Mysore", "Mangalore"],
  };

  const initialForm = {
    empId: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    mobile: "",
    state: "",
    city: "",
    address: "",
    designation: "",
    empType: "",
    doj: "",
    skills: [],
    aadhar: "",
    pan: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === "admin" && loginData.password === "admin") {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      setLoginError("");
      fetchEmployees();
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/employees");
      const data = res.data.map((emp) => ({
        ...emp,
        skills: emp.skills ? JSON.parse(emp.skills) : [],
      }));
      setEmployees(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching employees");
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchEmployees();
  }, [isLoggedIn]);

  const validateAll = () => {
    const newErrors = {};
    if (!formData.empId) {
  newErrors.empId = "Employee ID is required";
} else if (!/^[0-9]+$/.test(formData.empId)) {
  newErrors.empId = "Employee ID must contain only numbers";
}

    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.designation) newErrors.designation = "Designation is required";
    if (!formData.skills || formData.skills.length === 0) newErrors.skills = "Select at least one skill";
    if (!formData.pan) newErrors.pan = "PAN is required";
    if (!formData.aadhar) newErrors.aadhar = "Aadhar is required";
    if (!formData.address) newErrors.address = "Address is required";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) newErrors.email = "Invalid email format";

    const mobilePattern = /^[0-9]{10}$/;
    if (formData.mobile && !mobilePattern.test(formData.mobile)) newErrors.mobile = "Mobile must be 10 digits";

    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
    if (formData.pan && !panPattern.test(formData.pan)) newErrors.pan = "Invalid PAN format";

    const aadharPattern = /^[0-9]{12}$/;
    if (formData.aadhar && !aadharPattern.test(formData.aadhar)) newErrors.aadhar = "Aadhar must be 12 digits";

    if (formData.dob && new Date(formData.dob) > new Date()) newErrors.dob = "DOB cannot be in the future";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillsChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    try {
      await axios.post("http://localhost:5000/employees", formData);
      fetchEmployees();
      resetForm();
      alert("Employee added successfully");
    } catch (err) {
      console.error(err);
      alert("Error adding employee");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    try {
      await axios.put(`http://localhost:5000/employees/${formData.empId}`, formData);
      fetchEmployees();
      setIsEditing(false);
      resetForm();
      alert("Employee updated successfully");
    } catch (err) {
      console.error(err);
      alert("Error updating employee");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`http://localhost:5000/employees/${formData.empId}`);
      fetchEmployees();
      setIsEditing(false);
      resetForm();
      alert("Employee deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Error deleting employee");
    }
  };

  const handleEdit = (emp) => {
    setFormData({
      ...emp,
      skills: typeof emp.skills === "string" ? JSON.parse(emp.skills) : emp.skills,
    });
    setIsEditing(true);
    setErrors({});
  };

  const resetForm = () => {
    setFormData(initialForm);
    setErrors({});
    setIsEditing(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded shadow-md w-96 flex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={loginData.username}
            onChange={handleLoginChange}
            className="border p-2 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
            className="border p-2 rounded"
          />
          {loginError && <span className="text-red-500">{loginError}</span>}
          <button className="bg-blue-600 text-white p-2 rounded">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-6xl space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Employee Dashboard</h2>
          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
            Logout
          </button>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg text-blue-600 mb-4">Employee Form</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Form Label="ID" name="empId" value={formData.empId} onChange={handleChange} error={errors.empId} />
              <Form Label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form Label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
              <Form type="date" Label="DOB" name="dob" value={formData.dob} onChange={handleChange} error={errors.dob} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form Label="Email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
              <Form Label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} error={errors.mobile} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form
                type="select"
                Label="State"
                name="state"
                value={formData.state}
                options={["Tamil Nadu", "Kerala", "Karnataka"]}
                onChange={handleChange}
                error={errors.state}
              />
              <Form
                type="select"
                Label="City"
                name="city"
                value={formData.city}
                options={stateCityMap[formData.state] || []}
                onChange={handleChange}
                error={errors.city}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form
                type="select"
                Label="Designation"
                name="designation"
                value={formData.designation}
                options={["Developer","Tester","Manager"]}
                onChange={handleChange}
                error={errors.designation}
              />
              <Form
                type="multiselect"
                Label="Skills"
                name="skills"
                value={formData.skills}
                options={["HTML","CSS","JS","React"]}
                onChange={handleSkillsChange}
                error={errors.skills}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form Label="PAN" name="pan" value={formData.pan} onChange={handleChange} error={errors.pan}/>
              <Form Label="Aadhar" name="aadhar" value={formData.aadhar} onChange={handleChange} error={errors.aadhar}/>
            </div>
            <Form Label="Address" name="address" value={formData.address} onChange={handleChange} error={errors.address}/>
            
            <div className="flex gap-2 mt-2">
              {!isEditing ? (
                <Form btnText="Submit" onClick={handleClick} className="bg-blue-600 text-white px-4 py-2 rounded"/>
              ) : (
                <Form btnText="Update" onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded"/>
              )}
              <Form btnText="Delete" onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded"/>
              <Form btnText="Reset" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded"/>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded shadow mt-4">
          <h3 className="font-bold text-blue-600 mb-2">Employees List</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {employees.map((emp, idx) => (
              <button key={idx} onClick={() => handleEdit(emp)} className="w-full text-left p-2 border rounded hover:bg-gray-100">
                {emp.empId} - {emp.firstName} {emp.lastName}
              </button>
            ))}
          </div>
        </div>
        <Designation />
        <Task />
        <Status />
      </div>
    </div>
  );
}

export default App;
