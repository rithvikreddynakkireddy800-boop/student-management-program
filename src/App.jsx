import React, { useState } from "react";
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [roll, setRoll] = useState("");
  const [name, setName] = useState("");
  const [marks, setMarks] = useState("");
  const [error, setError] = useState("");

  const addStudent = (e) => {
    e.preventDefault();

    // Validation
    if (roll === "" || name === "" || marks === "") {
      setError("All fields are required!");
      return;
    }

    const newStudent = {
      roll,
      name,
      marks,
    };

    setStudents([...students, newStudent]);

    // Clear inputs
    setRoll("");
    setName("");
    setMarks("");
    setError("");
  };

  const deleteStudent = (index) => {
    const updatedList = students.filter((_, i) => i !== index);
    setStudents(updatedList);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Student Management System</h2>

      <form onSubmit={addStudent}>
        <input
          type="text"
          placeholder="Roll Number"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          type="number"
          placeholder="Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
        />
        <br /><br />

        <button type="submit">Add Student</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Student Records</h3>

      {students.length === 0 ? (
        <p>No Records Found</p>
      ) : (
        <table border="1" style={{ margin: "auto", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Marks</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((stu, index) => (
              <tr key={index}>
                <td>{stu.roll}</td>
                <td>{stu.name}</td>
                <td>{stu.marks}</td>
                <td>
                  <button onClick={() => deleteStudent(index)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
