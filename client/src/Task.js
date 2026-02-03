import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from "./Form";

function TaskForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: ""
  });

  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/task");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.title) newErrors.title = "Fill this field";
    if (!formData.description) newErrors.description = "Fill this field";
    if (!formData.date) newErrors.date = "Fill this field";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/task", {
        title: formData.title,
        description: formData.description,
        taskDate: formData.date
      });

      alert("Task Saved Successfully");
      resetForm();
      fetchTasks();
    } catch (err) {
      alert("Server Error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.put(`http://localhost:5000/task/${selectedId}`, {
        title: formData.title,
        description: formData.description,
        taskDate: formData.date
      });

      alert("Task Updated Successfully");
      resetForm();
      fetchTasks();
    } catch (err) {
      alert("Update Failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure want to delete?")) return;

    try {
      await axios.delete(`http://localhost:5000/task/${selectedId}`);
      alert("Task Deleted Successfully");
      resetForm();
      fetchTasks();
    } catch (err) {
      alert("Delete Failed");
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      date: task.taskDate
    });
    setSelectedId(task.id);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", date: "" });
    setErrors({});
    setIsEditing(false);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Task Form
        </h2>

        <form className="space-y-4">

          <Form
            Label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}

          <Form
            Label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description}</p>
          )}

          <Form
            type="date"
            Label="Task Date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}


          <div className="flex gap-3 justify-center mt-4">
            {!isEditing ? (
              <Form
                btnText="Save"
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              />
            ) : (
              <Form
                btnText="Update"
                onClick={handleUpdate}
                className="bg-green-600 text-white px-6 py-2 rounded"
              />
            )}

            {isEditing && (
              <Form
                btnText="Delete"
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded"
              />
            )}

            <Form
              btnText="Reset"
              onClick={(e) => {
                e.preventDefault();
                resetForm();
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded"
            />
          </div>
        </form>

        <div className="mt-6">
          <h3 className="font-bold mb-2">Task List</h3>

          <div className="space-y-2">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => handleEdit(task)}
                className="w-full text-left p-2 border rounded hover:bg-gray-100"
              >
                <p className="font-semibold">{task.title}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default TaskForm;
