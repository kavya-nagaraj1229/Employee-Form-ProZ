import React, { useState } from "react";
import Form from "./Form";
import axios from "axios";


function StatusForm() {
  const [formData, setFormData] = useState({
    statusName: "",
    description: "",
    status: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.statusName) newErrors.statusName = "Fill this field";
    if (!formData.description) newErrors.description = "Fill this field";
    if (!formData.status) newErrors.status = "Select status";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (validate()) {
    try {
      await axios.post("http://localhost:5000/status", {
        name: formData.statusName,
        description: formData.description,
        status: formData.status 
      });

      alert("Status Saved Successfully");

      setFormData({ statusName: "", description: "", status: "" });

    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  }
};



  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Status Form
        </h2>

        <form className="space-y-6">
          <div>
            <Form
              Label="Status Name"
              name="statusName"
              value={formData.statusName}
              placeholder="Enter Status Name"
              onChange={handleChange}
            />
            {errors.statusName && (
              <p className="text-red-500 text-xs mt-1">{errors.statusName}</p>
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
          <div>
            <Form
              type="select"
              Label="Status"
              name="status"
              value={formData.status}
              options={["Active", "Inactive"]}
              onChange={handleChange}
            />
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status}</p>
            )}
          </div>
          <div className="flex gap-4 justify-center">
            <Form
              btnText="Save"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium"
            />
            <Form
              btnText="Reset"
              onClick={(e) => {
                e.preventDefault();
                setFormData({ statusName: "", description: "", status: "" });
                setErrors({});
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md text-sm font-medium"
            />
          </div>

        </form>
      </div>
    </div>
  );
}

export default StatusForm;
