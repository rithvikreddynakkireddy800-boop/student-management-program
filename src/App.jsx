 import React, { useState, useEffect } from 'react';
import './App.css';

// ============================================================================
// 1. LOGIN FORM COMPONENT (Internal)
// ============================================================================
function LoginForm({ onLoginSuccess }) {
  const [authForm, setAuthForm] = useState({ credentialUser: '', secretKey: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (authForm.credentialUser.trim() === 'admin' && authForm.secretKey === 'password') {
      setLoading(true);
      setTimeout(() => {
        onLoginSuccess({ username: 'Admin Corporate Node', role: 'System Architect' });
      }, 800);
    } else {
      setErrorMsg('Access Denied: Signature authentication hash structural mismatch.');
    }
  };

  return (
    <div className="auth-viewport">
      <div className="auth-card-frame animate-pop-in">
        <div className="auth-card-branding">
          <h2>SYS_AUTH_PORTAL</h2>
          <p>Provide secure credential configurations to handshake runtime tokens.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-system-form">
          <div className="input-field-wrapper">
            <label>Gateway Identity Key</label>
            <input 
              type="text" 
              placeholder="System Username (admin)" 
              value={authForm.credentialUser}
              onChange={e => setAuthForm({...authForm, credentialUser: e.target.value})}
              required
            />
          </div>
          <div className="input-field-wrapper">
            <label>Gateway Cryptographic Key</label>
            <input 
              type="password" 
              placeholder="System Security Token (password)" 
              value={authForm.secretKey}
              onChange={e => setAuthForm({...authForm, secretKey: e.target.value})}
              required
            />
          </div>
          {errorMsg && <div className="system-alert alert-error">{errorMsg}</div>}
          <button type="submit" className="primary-action-btn">
            {loading ? <div className="spinner"></div> : "Authorize Active Workspace Session"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 2. DASHBOARD STATS COMPONENT (Internal)
// ============================================================================
function DashboardStats({ students }) {
  const total = students.length;
  const metrics = {
    total,
    avg: total ? (students.reduce((acc, curr) => acc + curr.marks, 0) / total).toFixed(1) : '0.0',
    optimum: total ? students.filter(s => s.marks >= 75).length : 0
  };

  return (
    <div className="matrix-stats-row animate-fade-in">
      <div className="matrix-stat-node">
        <p className="node-label">INDEXED NODES</p>
        <h2 className="node-metric">{metrics.total} <span className="unit">records</span></h2>
      </div>
      <div className="matrix-stat-node">
        <p className="node-label">EFFICIENCY AVG</p>
        <h2 className="node-metric" style={{color: '#818cf8'}}>{metrics.avg}<span className="unit">%</span></h2>
      </div>
      <div className="matrix-stat-node">
        <p className="node-label">DISTINCTION THRESHOLD</p>
        <h2 className="node-metric" style={{color: '#34d399'}}>{metrics.optimum} <span className="unit">active</span></h2>
      </div>
    </div>
  );
}

// ============================================================================
// 3. STUDENT CARD COMPONENT (Internal)
// ============================================================================
function StudentCard({ student, onDelete }) {
  const performanceIndex = (marks) => {
    if (marks >= 85) return { tag: 'CRITICAL OVERPERFORM', hex: '#34d399', bg: 'rgba(52,211,153,0.06)' };
    if (marks >= 60) return { tag: 'NOMINAL PERFORMANCE', hex: '#60a5fa', bg: 'rgba(96,165,250,0.06)' };
    if (marks >= 40) return { tag: 'MARGINAL CRITERIA', hex: '#fbbf24', bg: 'rgba(251,191,36,0.06)' };
    return { tag: 'STABILIZATION FAILURE', hex: '#f87171', bg: 'rgba(248,113,113,0.06)' };
  };

  const status = performanceIndex(student.marks);

  return (
    <div className="enterprise-card animate-pop-in" style={{ '--accent-shadow': status.hex }}>
      <div className="card-top-identity">
        <div>
          <span className="card-index-key">{student.rollNo}</span>
          <h4 className="card-subject-title">{student.name}</h4>
          <span className="card-department-meta">{student.department}</span>
        </div>
        <div className="status-dot" style={{ backgroundColor: status.hex }}></div>
      </div>

      <div className="card-performance-metrics">
        <div className="metric-header-row">
          <span className="metric-tag-label" style={{ color: status.hex, backgroundColor: status.bg }}>{status.tag}</span>
          <span className="metric-score-value">{student.marks}%</span>
        </div>
        <div className="metric-progress-track">
          <div className="metric-progress-fill" style={{ width: `${student.marks}%`, backgroundColor: status.hex }}></div>
        </div>
      </div>

      <button className="card-purge-action" onClick={() => onDelete(student.id)}>
        Purge Node Record
      </button>
    </div>
  );
}

// ============================================================================
// 4. MAIN APPLICATION ARCHITECT
// ============================================================================
export default function App() {
  // Authentication session checking inside Local Storage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('sms_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Data State Initializer
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('sms_database');
    return savedStudents ? JSON.parse(savedStudents) : [
      { id: 1, rollNo: "CS-101", name: "Alexander Wright", marks: 92, department: "Computer Science" },
      { id: 2, rollNo: "EE-102", name: "Sarah Jenkins", marks: 58, department: "Electrical Eng." },
      { id: 3, rollNo: "ME-103", name: "Michael Chang", marks: 34, department: "Mechanical Eng." }
    ];
  });

  const [formData, setFormData] = useState({ rollNo: '', name: '', marks: '', department: 'Computer Science' });
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Synchronize database to user LocalStorage
  useEffect(() => {
    localStorage.setItem('sms_database', JSON.stringify(students));
  }, [students]);

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    const { rollNo, name, marks, department } = formData;

    if (!rollNo.trim() || !name.trim() || !marks.toString().trim()) {
      setFormError('⚠️ System Error: All parameter attributes are mandatory.');
      return;
    }
    if (isNaN(marks) || marks < 0 || marks > 100) {
      setFormError('⚠️ Validation Limit Exception: Marks must parse between 0 and 100.');
      return;
    }
    if (students.some(s => s.rollNo.toLowerCase() === rollNo.trim().toLowerCase())) {
      setFormError('⚠️ Primary Key Constraint violation: Duplicate Roll Number found.');
      return;
    }

    setIsSyncing(true);
    
    // Artificial latency for visual simulation of premium DB syncs
    setTimeout(() => {
      const newRecord = {
        id: Date.now(),
        rollNo: rollNo.trim().toUpperCase(),
        name: name.trim(),
        marks: parseInt(marks, 10),
        department
      };
      setStudents(prev => [newRecord, ...prev]);
      setFormData({ rollNo: '', name: '', marks: '', department: 'Computer Science' });
      setIsSyncing(false);
    }, 600);
  };

  const handleDelete = (id) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Guard routing fallback context
  if (!user) {
    return <LoginForm onLoginSuccess={(userData) => {
      localStorage.setItem('sms_session', JSON.stringify(userData));
      setUser(userData);
    }} />;
  }

  return (
    <div className="app-layout animate-fade-in">
      {/* Navigation Layer */}
      <nav className="glass-nav">
        <div className="nav-container">
          <div className="brand-zone">
            <div className="pulse-indicator"></div>
            <span className="brand-logo">CORE_MATRIX</span>
            <span className="system-badge">SMS v2.4</span>
          </div>
          <div className="user-profile-zone">
            <div className="user-avatar">{user.username[0].toUpperCase()}</div>
            <div className="user-meta">
              <h4>{user.username}</h4>
              <p>{user.role}</p>
            </div>
            <button className="logout-action-btn" onClick={() => {
              localStorage.removeItem('sms_session');
              setUser(null);
            }}>Disconnect</button>
          </div>
        </div>
      </nav>

      <main className="dashboard-view">
        <header className="view-header">
          <div>
            <h1>Data Administration Console</h1>
            <p>System operational matrix. Connected to secure storage pool endpoint node.</p>
          </div>
        </header>

        <DashboardStats students={students} />

        <div className="workspace-grid">
          {/* Form Processing System */}
          <section className="glass-panel components-form-panel">
            <div className="panel-header">
              <h3>Ingest Student Record</h3>
              <p>Initialize schema values to register records onto state stack layers.</p>
            </div>
            
            <form onSubmit={handleStudentSubmit} className="operational-form">
              <div className="form-group-row">
                <div className="input-field-wrapper">
                  <label>Roll Registry Key</label>
                  <input 
                    type="text" 
                    value={formData.rollNo} 
                    onChange={e => setFormData({...formData, rollNo: e.target.value})}
                    placeholder="e.g., CS-402"
                  />
                </div>
                <div className="input-field-wrapper">
                  <label>Academic Score (%)</label>
                  <input 
                    type="number" 
                    value={formData.marks} 
                    onChange={e => setFormData({...formData, marks: e.target.value})}
                    placeholder="0 - 100"
                  />
                </div>
              </div>

              <div className="input-field-wrapper">
                <label>Full Subject Identity Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Legal Name entry string"
                />
              </div>

              <div className="input-field-wrapper">
                <label>Department Vector Faculty</label>
                <select 
                  value={formData.department} 
                  onChange={e => setFormData({...formData, department: e.target.value})}
                  className="custom-select"
                >
                  <option value="Computer Science">Computer Science & AI</option>
                  <option value="Electrical Eng.">Electrical Engineering</option>
                  <option value="Mechanical Eng.">Mechanical Automation</option>
                  <option value="Data Analytics">Data Analytics Infrastructure</option>
                </select>
              </div>

              {formError && <div className="system-alert alert-error">{formError}</div>}

              <button type="submit" disabled={isSyncing} className="primary-action-btn">
                {isSyncing ? <div className="spinner"></div> : "Commit Record to Data Pool"}
              </button>
            </form>
          </section>

          {/* Directory Monitoring Panel */}
          <section className="directory-display-panel">
            <div className="directory-filter-bar">
              <div className="directory-title">
                <h3>System Directory</h3>
                <span className="record-counter">{filteredStudents.length} entries indexed</span>
              </div>
              <input 
                type="text" 
                className="matrix-search-input"
                placeholder="🔍 Query Name, Key Index, Department..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredStudents.length > 0 ? (
              <div className="data-cards-matrix">
                {filteredStudents.map(student => (
                  <StudentCard 
                    key={student.id} 
                    student={student} 
                    onDelete={handleDelete} 
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state-card animate-pop-in">
                <p>System Alert: Query index vector returned zero active pointer definitions.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}