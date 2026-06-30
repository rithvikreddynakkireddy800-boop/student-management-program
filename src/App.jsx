import React, { useState, useMemo } from 'react';
import './App.css';

function App() {
  // State variables
  const [students, setStudents] = useState([
    { id: 1, rollNo: "101", name: "Aarav Sharma", marks: 92 },
    { id: 2, rollNo: "102", name: "Ananya Iyer", marks: 78 }
  ]);
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [marks, setMarks] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Form Submission Handler
  const handleAddStudent = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!rollNo.trim() || !name.trim() || !marks.trim()) {
      setError('⚠️ All fields are required!');
      return;
    }
    if (isNaN(marks) || marks < 0 || marks > 100) {
      setError('⚠️ Marks must be a number between 0 and 100.');
      return;
    }
    if (students.some(student => student.rollNo === rollNo.trim())) {
      setError('⚠️ This Roll Number already exists.');
      return;
    }

    // Add new student object
    const newStudent = {
      id: Date.now(),
      rollNo: rollNo.trim(),
      name: name.trim(),
      marks: parseFloat(marks)
    };

    setStudents([newStudent, ...students]);
    
    // Clear Form Fields
    setRollNo('');
    setName('');
    setMarks('');
  };

  // Delete Handler
  const handleDelete = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  // Live Derived Statistics using useMemo for performance
  const stats = useMemo(() => {
    if (students.length === 0) return { total: 0, avg: 0, top: 'N/A' };
    const total = students.length;
    const avg = (students.reduce((sum, s) => sum + s.marks, 0) / total).toFixed(1);
    const topScorer = students.reduce((max, s) => (s.marks > max.marks ? s : max), students[0]);
    return { total, avg, top: topScorer.name };
  }, [students]);

  // Filtered student list based on search query
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm)
  );

  return (
    <div className="app-container">
      {/* Background Decorative Elements */}
      <div className="bg-circle circle-1"></div>
      <div className="bg-circle circle-2"></div>

      <header className="glass-header animate-fade-in">
        <h1>🎓 Student Management Dashboard</h1>
        <p className="subtitle">Streamlined tracking with a modern touch</p>
      </header>

      {/* Statistics Section */}
      <section className="stats-container animate-fade-in">
        <div className="stat-card glass">
          <h3>Total Students</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card glass">
          <h3>Average Marks</h3>
          <p className="stat-value">{stats.avg}%</p>
        </div>
        <div className="stat-card glass">
          <h3>Top Performer</h3>
          <p className="stat-value name">{stats.top}</p>
        </div>
      </section>

      <main className="main-content">
        {/* Left Side: Form Panel */}
        <section className="form-panel glass animate-slide-in">
          <h2>Add New Student</h2>
          <form onSubmit={handleAddStudent} noValidate>
            <div className="input-group">
              <label>Roll Number</label>
              <input 
                type="text" 
                placeholder="e.g., 101" 
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="e.g., John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Marks (%)</label>
              <input 
                type="number" 
                placeholder="e.g., 85" 
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn-submit">Enroll Student</button>
          </form>
        </section>

        {/* Right Side: Records Section */}
        <section className="records-panel">
          <div className="records-header glass">
            <h2>Student Roster</h2>
            <input 
              type="text" 
              placeholder="🔍 Search by name or roll no..." 
              className="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="cards-grid">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div key={student.id} className="student-card glass card-animate-entry">
                  <div className="card-badge">#{student.rollNo}</div>
                  <div className="card-body">
                    <h3>{student.name}</h3>
                    <div className="progress-bar-container">
                      <div className="progress-label">
                        <span>Score:</span>
                        <strong>{student.marks}%</strong>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${student.marks}%`,
                            backgroundColor: student.marks >= 75 ? '#10b981' : student.marks >= 40 ? '#f59e0b' : '#ef4444'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <button className="btn-delete" onClick={() => handleDelete(student.id)}>
                    Remove Record
                  </button>
                </div>
              ))
            ) : (
              <div className="no-records glass animate-fade-in">
                <p>No matching student records found.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;