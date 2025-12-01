import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, writeBatch, doc } from 'firebase/firestore';
import { Search, CheckCircle, Scale, AlertCircle, UserPlus, ClipboardList, UploadCloud } from 'lucide-react';

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyB2o-alpxS215ZOlhEtkiSlaNtrj5zcrCw",
  authDomain: "practice-attendance-5bb5f.firebaseapp.com",
  projectId: "practice-attendance-5bb5f",
  storageBucket: "practice-attendance-5bb5f.firebasestorage.app",
  messagingSenderId: "1018345303502",
  appId: "1:1018345303502:web:87bbf8e2cb05545a858f9f",
  measurementId: "G-HZW064BG49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const App = () => {
  const [view, setView] = useState('checkin'); // 'checkin', 'admin', 'success'
  const [roster, setRoster] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skinCheck, setSkinCheck] = useState(true);
  
  // Admin State
  const [newStudentName, setNewStudentName] = useState('');
  const [csvData, setCsvData] = useState('');
  const [importStatus, setImportStatus] = useState('');

  // Load Roster Function
  const fetchRoster = async () => {
    try {
      const q = query(collection(db, "roster"), orderBy("Last_Name"));
      const querySnapshot = await getDocs(q);
      
      const loadedRoster = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const fName = data.First_Name || '';
        const lName = data.Last_Name || '';
        
        return {
          id: doc.id,
          // Construct Display Name: "Doe, John"
          name: lName && fName ? `${lName}, ${fName}` : (lName || fName || 'Unknown'),
          // Store other fields for reference
          grade: data.Grade || '',
          email: data.Email || '',
          status: data.Status || '',
          needsDocs: data['Need documents completed'] || '',
          ...data
        };
      });
      
      setRoster(loadedRoster.filter(p => p.name !== 'Unknown'));
    } catch (err) {
      console.error("Error fetching roster:", err);
      setError("Could not load roster. Check internet connection.");
    }
  };

  // Initial Load
  useEffect(() => {
    fetchRoster();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedStudent(null); 
  };

  const selectStudent = (student: any) => {
    setSelectedStudent(student);
    setSearchTerm(student.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !weight) {
      setError("Please select your name and enter your weight.");
      return;
    }

    setLoading(true);
    
    // Data to save to "attendance" collection
    const data = {
      studentId: selectedStudent.id,
      name: selectedStudent.name,
      grade: selectedStudent.grade, // Capture grade in attendance record
      weight: parseFloat(weight),
      skinCheckPass: skinCheck,
      notes: notes,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    try {
      await addDoc(collection(db, "attendance"), data);
      setView('success');
      // Reset form
      setWeight('');
      setNotes('');
      setSearchTerm('');
      setSelectedStudent(null);
      setError('');
    } catch (err) {
      console.error(err);
      setError("Failed to check in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- CSV PARSER & UPLOADER ---
  const handleBulkImport = async () => {
    if (!csvData) return;
    setImportStatus('Parsing...');
    
    // Simple CSV parser
    const rows = csvData.trim().split('\n');
    
    // 1. Get Headers
    // We split by tab (\t) OR comma (,) to handle copy-paste from Excel/Sheets better
    const separator = rows[0].includes('\t') ? '\t' : ',';
    
    const headers = rows[0].split(separator).map(h => h.trim().replace(/^"|"$/g, ''));
    
    console.log("Detected headers:", headers);

    // Check for critical headers (Case sensitive matching to your sheet)
    if (!headers.includes('Last_Name') || !headers.includes('First_Name')) {
      setImportStatus('Error: Missing "Last_Name" or "First_Name" columns.');
      return;
    }

    const newWrestlers = rows.slice(1).map(row => {
      // Handle empty rows
      if (!row.trim()) return null;

      const values = row.split(separator);
      const obj: any = {};
      
      headers.forEach((header, index) => {
        let val = values[index]?.trim();
        // Remove quotes if present
        if (val && val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
        }
        obj[header] = val;
      });
      return obj;
    }).filter(w => w && w.Last_Name && w.First_Name); 

    setImportStatus(`Uploading ${newWrestlers.length} wrestlers...`);

    // Batch Upload
    try {
        const batch = writeBatch(db);
        newWrestlers.forEach(wrestler => {
            const docRef = doc(collection(db, "roster"));
            // We save the entire object, which includes Email, DOB, Notes, etc.
            batch.set(docRef, wrestler);
        });
        await batch.commit();
        setImportStatus('Success! Database updated.');
        setCsvData('');
        fetchRoster(); // Refresh list
    } catch (e: any) {
        setImportStatus('Error uploading: ' + e.message);
    }
  };

  const filteredRoster = roster.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- RENDER SUCCESS SCREEN ---
  if (view === 'success') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-700">
          <div className="mx-auto bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Checked In!</h2>
          <p className="text-slate-400 mb-8">Go start your warmup.</p>
          <button 
            onClick={() => setView('checkin')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all"
          >
            Next Wrestler
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER CHECK-IN FORM ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500 selection:text-white">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="p-6 pt-12">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Wrestling<span className="text-blue-500">Tracker</span>
          </h1>
          <p className="text-slate-500 mt-2">Daily Practice Check-in</p>
        </div>

        {/* Main Card */}
        <div className="flex-1 bg-slate-900 rounded-t-3xl p-6 shadow-2xl border-t border-slate-800">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-400 mb-2">Find Your Name</label>
              <div className="relative">
                <Search className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Start typing..."
                  className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-lg"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {searchTerm && !selectedStudent && (
                <div className="absolute z-10 w-full bg-slate-800 border border-slate-700 mt-2 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                  {filteredRoster.length > 0 ? (
                    filteredRoster.map(student => (
                      <div
                        key={student.id}
                        onClick={() => selectStudent(student)}
                        className="p-4 hover:bg-blue-600/20 cursor-pointer border-b border-slate-700/50 last:border-0 flex justify-between items-center group"
                      >
                        <div className="flex-1">
                          <span className="font-medium group-hover:text-blue-400 transition-colors block text-lg">{student.name}</span>
                          <div className="flex gap-2 text-xs text-slate-500 mt-1">
                            {student.grade && <span>Gr: {student.grade}</span>}
                            {student.email && <span>• {student.email.split('@')[0]}</span>}
                          </div>
                          {/* Alert for missing docs */}
                          {student.needsDocs === 'Yes' && (
                             <span className="text-red-400 text-xs font-bold flex items-center gap-1 mt-1">
                               <AlertCircle className="w-3 h-3"/> Missing Docs
                             </span>
                          )}
                        </div>
                        
                        {/* Status Badge */}
                        <div className="text-right">
                          {student.Status === 'Active' ? (
                             <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded border border-green-800">Active</span>
                          ) : (
                             <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
                               {student.Status || '---'}
                             </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-slate-500 text-center">
                      {roster.length === 0 ? "Loading Roster..." : "No wrestler found"}
                    </div>
                  )}
                </div>
              )}
              
              {selectedStudent && (
                 <div className="mt-2 text-blue-400 text-sm flex items-center gap-2 bg-blue-500/10 p-2 rounded-lg inline-flex">
                   <CheckCircle className="w-4 h-4" />
                   Selected: {selectedStudent.name}
                 </div>
              )}
            </div>

            {/* Weight Input */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Current Weight (lbs)</label>
              <div className="relative">
                <Scale className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-xl font-mono"
                />
              </div>
            </div>

            {/* Skin Check Toggle */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Skin Check Clear?</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSkinCheck(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${skinCheck ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-slate-800 text-slate-500'}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkinCheck(false)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${!skinCheck ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-slate-800 text-slate-500'}`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all ${
                loading 
                ? 'bg-slate-700 text-slate-400 cursor-wait' 
                : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20 hover:-translate-y-1'
              }`}
            >
              {loading ? 'Logging...' : 'Check In'}
            </button>

          </form>

          {/* Footer / Admin Link */}
          <div className="mt-8 text-center">
             <button onClick={() => setView(view === 'admin' ? 'checkin' : 'admin')} className="text-slate-700 text-xs hover:text-slate-500">
               {view === 'admin' ? 'Back to Check-in' : 'Coach Admin Area'}
             </button>
          </div>
          
          {/* ADMIN AREA: BULK UPLOAD */}
          {view === 'admin' && (
            <div className="mt-6 border-t border-slate-800 pt-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500"/> Roster Management
              </h3>
              
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-xs text-slate-400 mb-2">
                  1. Copy your spreadsheet.<br/>
                  2. Required headers: <code>Last_Name, First_Name</code><br/>
                  3. We also support: <code>Email, Grade, Status, Notes, Need documents completed</code>
                </p>
                <textarea 
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-300 p-2 rounded h-24 font-mono"
                  placeholder={`Email,Last_Name,First_Name,Grade,Status\njdoe@school.edu,Doe,John,10,Active`}
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                />
                <button 
                  onClick={handleBulkImport}
                  className="mt-2 w-full bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 rounded flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" /> Process Import
                </button>
                {importStatus && (
                  <div className="mt-2 text-xs text-blue-400 font-mono">
                    {importStatus}
                  </div>
                )}
              </div>

              {/* Manual Add Single */}
              <div className="mt-6">
                <h4 className="text-slate-500 text-xs font-bold uppercase mb-2">Quick Add Single</h4>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Lastname, Firstname"
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm w-full text-white"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                  />
                  <button 
                    className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg"
                    onClick={async () => {
                       if(newStudentName) {
                         try {
                           const parts = newStudentName.split(',');
                           const lastName = parts[0].trim();
                           const firstName = parts[1] ? parts[1].trim() : '';

                           await addDoc(collection(db, "roster"), { 
                               Last_Name: lastName,
                               First_Name: firstName,
                               Status: 'Active'
                           });
                           
                           setNewStudentName('');
                           fetchRoster();
                           alert('Added!');
                         } catch (e: any) {
                           alert('Error adding student: ' + e.message);
                         }
                       }
                    }}
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default App;
