import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "./Form";

function DesignationForm() {
  const [formData, setFormData] = useState({ designationName: "", description: "" });
  const [errors, setErrors] = useState({});
  const [designations, setDesignations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  
  const fetchDesignations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/designations");
      setDesignations(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => { fetchDesignations(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.designationName) newErrors.designationName = "Fill this field";
    if (!formData.description) newErrors.description = "Fill this field";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/designations", {
        name: formData.designationName,
        description: formData.description
      });
      alert("Designation Saved Successfully");
      setFormData({ designationName: "", description: "" });
      fetchDesignations();
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.put(`http://localhost:5000/designations/${formData.id}`, {
        name: formData.designationName,
        description: formData.description
      });
      alert("Updated Successfully");
      setFormData({ designationName: "", description: "" });
      setIsEditing(false);
      fetchDesignations();
    } catch (err) {
      console.error(err);
      alert("Update Failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure want to delete?")) return;
    try {
      await axios.delete(`http://localhost:5000/designations/${formData.id}`);
      alert("Deleted Successfully");
      setFormData({ designationName: "", description: "" });
      setIsEditing(false);
      fetchDesignations();
    } catch (err) {
      console.error(err);
      alert("Delete Failed");
    }
  };

  

  const handleEdit = (designation) => {
    setFormData({
      id: designation.id,
      designationName: designation.name,
      description: designation.description
    });
    setIsEditing(true);
  };



  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
     
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Designation Form
        </h2>

        <form className="space-y-6">
          <div>
            <Form
              Label="Designation Name"
              name="designationName"
              value={formData.designationName}
              placeholder="Enter Designation Name"
              onChange={handleChange}
            />
            {errors.designationName && (
              <p className="text-red-500 text-xs mt-1">{errors.designationName}</p>
            )}
          </div>

          <div>
            <Form
              Label="Description"
              name="description"
              value={formData.description}
              placeholder="Enter Description"
              onChange={handleChange}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            {!isEditing ? (
              <Form
                btnText="Save"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium"
              />
            ) : (
              <Form
                btnText="Update"
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium"
              />
            )}

            <Form
              btnText="Delete"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-sm font-medium"
            />

            <Form
              btnText="Reset"
              onClick={(e) => {
                e.preventDefault();
                setFormData({ designationName: "", description: "" });
                setErrors({});
                setIsEditing(false);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md text-sm font-medium"
            />
          </div>
        </form>

        <div className="mt-6">
          <h3 className="font-bold mb-2">Designations List</h3>
          <div className="space-y-2">
            {designations.map((d) => (
              <button
                key={d.id}
                onClick={() => handleEdit(d)}
                className="w-full text-left p-2 border rounded hover:bg-gray-100"
              >
                {d.name} - {d.description}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignationForm;
