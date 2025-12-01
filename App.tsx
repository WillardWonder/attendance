import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, writeBatch, doc, where, deleteDoc } from 'firebase/firestore';
import { Search, CheckCircle, Scale, AlertCircle, UserPlus, ClipboardList, UploadCloud, Users, Calendar, Clock, UserCheck, UserX, LayoutDashboard, Trash2, AlertTriangle } from 'lucide-react';

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

// --- PRELOADED DATA FROM YOUR SPREADSHEET ---
const PRELOADED_ROSTER = [
  { First_Name: 'Lakeyn', Last_Name: 'Adams', Grade: '10', Email: 'lakeyn.adams@mapsedu.org' },
  { First_Name: 'Kullin', Last_Name: 'Amundson', Grade: '10', Email: 'kullin.amundson@mapsedu.org' },
  { First_Name: 'James', Last_Name: 'Barker', Grade: '10', Email: 'James.barker@mapsedu.org' },
  { First_Name: 'Wyatt', Last_Name: 'Boyd', Grade: '10', Email: 'wyatt.boyd@mapsedu.org' },
  { First_Name: 'Zander', Last_Name: 'Brown-Grenwalt', Grade: '12', Email: 'Alexander.browngrenw@mapsedu.org' },
  { First_Name: 'Xander', Last_Name: 'Carey', Grade: '11', Email: 'xander.carey@mapsedu.org' },
  { First_Name: 'Jude', Last_Name: 'Charbarneau', Grade: '10', Email: 'jude.charbarneau@mapsedu.org' },
  { First_Name: 'Noah', Last_Name: 'Clifford', Grade: '11', Email: 'noah.clifford@mapsedu.org' },
  { First_Name: 'Ryan', Last_Name: 'Coates', Grade: '12', Email: 'ryan.coates@mapsedu.org' },
  { First_Name: 'Wil', Last_Name: 'Detert', Grade: '9', Email: 'wil.detert@mapsedu.org' },
  { First_Name: 'Marvin', Last_Name: 'Downs', Grade: '11', Email: 'marvin.downs@mapsedu.org' },
  { First_Name: 'Tegan', Last_Name: 'Drake', Grade: '12', Email: 'tegan.drake@mapsedu.org' },
  { First_Name: 'Ben', Last_Name: 'Gruett', Grade: '12', Email: 'benjamin.gruett@mapsedu.org' },
  { First_Name: 'Josh', Last_Name: 'Gustum', Grade: '12', Email: 'joshgustum07@gmail.com' },
  { First_Name: 'Collin', Last_Name: 'Hodgins', Grade: '11', Email: 'collin.hodgins@mapsedu.org' },
  { First_Name: 'Bennett', Last_Name: 'Jacobson', Grade: '10', Email: 'bennett.jacobson@mapsedu.org' },
  { First_Name: 'Trenton', Last_Name: 'Klimek', Grade: '11', Email: 'Trenton.klimek@mapsedu.org' },
  { First_Name: 'Noah', Last_Name: 'Klug', Grade: '12', Email: 'noah.klug@mapsedu.org' },
  { First_Name: 'Otto', Last_Name: 'Lee', Grade: '10', Email: 'osjlee@mapsedu.org' },
  { First_Name: 'Eli', Last_Name: 'Lofink', Grade: '10', Email: 'eli.lofink@mapsedu.org' },
  { First_Name: 'William', Last_Name: 'Miemietz', Grade: '11', Email: 'william.miemietz@mapsedu.org' },
  { First_Name: 'Landon', Last_Name: 'Neumann', Grade: '12', Email: 'landon.neumann@mapsedu.org' },
  { First_Name: 'Abram', Last_Name: 'Norton', Grade: '11', Email: 'abram.norton@mapsedu.org' },
  { First_Name: 'Koi', Last_Name: 'Olson', Grade: '9', Email: 'koi.olson@mapsedu.org' },
  { First_Name: 'Hunter', Last_Name: 'Opper', Grade: '12', Email: 'Hunter.opper@mapsedu.org' },
  { First_Name: 'Cartter', Last_Name: 'Schade', Grade: '11', Email: 'cartter.schade@mapsedu.org' },
  { First_Name: 'Mason', Last_Name: 'Schenk', Grade: '11', Email: 'mason.schenk@mapsedu.org' },
  { First_Name: 'Dustin', Last_Name: 'Schmirler', Grade: '12', Email: 'dustin.schmirler@mapsedu.org' },
  { First_Name: 'Preston', Last_Name: 'Schuelke', Grade: '12', Email: 'preston.schuelke@mapsedu.org' },
  { First_Name: 'Easton', Last_Name: 'Simon', Grade: '10', Email: 'easton.simon@mapsedu.org' },
  { First_Name: 'Remington', Last_Name: 'Skic', Grade: '11', Email: 'remington.skic@mapsedu.org' },
  { First_Name: 'Marcus', Last_Name: 'Slagoski', Grade: '11', Email: 'Marcus.slagoski@mapsedu.org' },
  { First_Name: 'Brett', Last_Name: 'Suchocki', Grade: '12', Email: 'brett.suchocki@gmail.com' },
  { First_Name: 'Broc', Last_Name: 'Suchocki', Grade: '10', Email: 'Broc.suchocki@gmail.com' },
  { First_Name: 'Aaron', Last_Name: 'Watson-Dye', Grade: '12', Email: 'aaron.watsondye@mapsedu.org' },
  { First_Name: 'Evan', Last_Name: 'Winters', Grade: '10', Email: 'evan.winters@mapsedu.org' },
  { First_Name: 'Liam', Last_Name: 'Huggins', Grade: '10', Email: 'liam.huggins@mapsedu.org' },
  { First_Name: 'Alexander', Last_Name: 'Bushar', Grade: '10', Email: 'alexander.bushar@mapsedu.org' },
  { First_Name: 'Ty', Last_Name: 'Schuett', Grade: '11', Email: 'ty.schuett@mapsedu.org' }
];

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
  const [adminTab, setAdminTab] = useState('live'); // 'live', 'roster'
  const [newStudentName, setNewStudentName] = useState('');
  const [csvData, setCsvData] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [todaysAttendance, setTodaysAttendance] = useState<any[]>([]);

  // Load Roster Function
  const fetchRoster = async () => {
    try {
      const q = query(collection(db, "roster"), orderBy("Last_Name"));
      const querySnapshot = await getDocs(q);
      
      const loadedRoster = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const fName = data.First_Name || data.firstname || data.firstName || '';
        const lName = data.Last_Name || data.lastname || data.lastName || '';
        
        return {
          id: doc.id,
          name: lName && fName ? `${lName}, ${fName}` : (lName || fName || 'Unknown'),
          grade: data.Grade || data.grade || '',
          email: data.Email || data.email || '',
          status: data.Status || data.status || '',
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

  // Fetch Today's Attendance
  const fetchTodaysAttendance = async () => {
    try {
      const today = new Date().toLocaleDateString();
      const q = query(collection(db, "attendance"), where("date", "==", today));
      const querySnapshot = await getDocs(q);
      const attendance = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodaysAttendance(attendance);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchRoster();
  }, []);

  // Fetch attendance when switching to admin view
  useEffect(() => {
    if (view === 'admin') {
      fetchTodaysAttendance();
    }
  }, [view]);

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
    const data = {
      studentId: selectedStudent.id,
      name: selectedStudent.name,
      grade: selectedStudent.grade,
      weight: parseFloat(weight),
      skinCheckPass: skinCheck,
      notes: notes,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      await addDoc(collection(db, "attendance"), data);
      setView('success');
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

  // --- DANGER: DELETE ALL ROSTER ---
  const handleDeleteAllRoster = async () => {
    if (!confirm("⚠️ WARNING: This will DELETE EVERY STUDENT in the roster.\n\nYou will have to reload the team from the button above.\n\nAre you absolutely sure?")) return;
    
    setImportStatus('Deleting entire roster...');
    try {
        const q = query(collection(db, "roster"));
        const snapshot = await getDocs(q);
        
        // Batch delete in chunks of 500
        const batchSize = 500;
        const docs = snapshot.docs;
        
        for (let i = 0; i < docs.length; i += batchSize) {
            const batch = writeBatch(db);
            const chunk = docs.slice(i, i + batchSize);
            chunk.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
        }
        
        setImportStatus('Roster wiped clean.');
        fetchRoster();
    } catch (e: any) {
        setImportStatus('Error deleting: ' + e.message);
    }
  };

  // --- PRELOADED DATA UPLOADER (WITH DUPE PROTECTION) ---
  const handlePreloadedImport = async () => {
    setImportStatus('Checking for duplicates...');
    try {
        // 1. Get current roster to prevent duplicates
        const currentRosterSnapshot = await getDocs(collection(db, "roster"));
        const existingNames = new Set();
        currentRosterSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const key = `${data.First_Name}-${data.Last_Name}`.toLowerCase().trim();
            existingNames.add(key);
        });

        // 2. Filter new list
        const newWrestlers = PRELOADED_ROSTER.filter(w => {
            const key = `${w.First_Name}-${w.Last_Name}`.toLowerCase().trim();
            return !existingNames.has(key);
        });

        if (newWrestlers.length === 0) {
            setImportStatus('All wrestlers are already in the database. No changes made.');
            return;
        }

        if(!confirm(`Found ${newWrestlers.length} missing wrestlers. Add them now? (Skipped ${PRELOADED_ROSTER.length - newWrestlers.length} duplicates)`)) return;

        setImportStatus(`Adding ${newWrestlers.length} new wrestlers...`);
        
        const batch = writeBatch(db);
        newWrestlers.forEach(wrestler => {
            const docRef = doc(collection(db, "roster"));
            batch.set(docRef, {
                ...wrestler,
                Status: 'Active'
            });
        });
        await batch.commit();
        setImportStatus(`Success! Added ${newWrestlers.length} wrestlers.`);
        fetchRoster();
    } catch (e: any) {
        setImportStatus('Error uploading: ' + e.message);
    }
  };

  // --- CSV PARSER & UPLOADER (WITH DUPE PROTECTION) ---
  const handleBulkImport = async () => {
    if (!csvData) return;
    setImportStatus('Parsing...');
    
    const rows = csvData.trim().split('\n');
    if (rows.length < 2) {
      setImportStatus('Error: No data rows found.');
      return;
    }
    
    // ... Header Parsing Logic ...
    const firstRow = rows[0];
    const separator = firstRow.includes('\t') ? '\t' : ',';
    
    const normalizeHeader = (h: string) => {
        const clean = h.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        if (['lastname', 'last_name', 'last'].includes(clean)) return 'Last_Name';
        if (['firstname', 'first_name', 'first'].includes(clean)) return 'First_Name';
        if (['email', 'emailaddress'].includes(clean)) return 'Email';
        if (['grade', 'year'].includes(clean)) return 'Grade';
        if (['status', 'activitystatus'].includes(clean)) return 'Status';
        return h.trim().replace(/^"|"$/g, ''); 
    };

    const originalHeaders = firstRow.split(separator).map(h => h.trim());
    const headers = originalHeaders.map(normalizeHeader);
    
    if (!headers.includes('Last_Name') || !headers.includes('First_Name')) {
      setImportStatus(`Error: Missing Name columns.`);
      return;
    }

    const csvWrestlers = rows.slice(1).map(row => {
      if (!row.trim()) return null;
      const values = row.split(separator);
      const obj: any = {};
      headers.forEach((header, index) => {
        let val = values[index]?.trim();
        if (val && val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
        }
        if (header) {
            obj[header] = val;
        }
      });
      return obj;
    }).filter(w => w && w.Last_Name && w.First_Name); 

    // --- DUPLICATE CHECK ---
    setImportStatus('Checking for duplicates...');
    try {
        const currentRosterSnapshot = await getDocs(collection(db, "roster"));
        const existingNames = new Set();
        currentRosterSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const fName = (data.First_Name || data.firstname || '').toString().toLowerCase().trim();
            const lName = (data.Last_Name || data.lastname || '').toString().toLowerCase().trim();
            existingNames.add(`${fName}-${lName}`);
        });

        const newWrestlers = csvWrestlers.filter(w => {
            const fName = (w.First_Name || '').toString().toLowerCase().trim();
            const lName = (w.Last_Name || '').toString().toLowerCase().trim();
            return !existingNames.has(`${fName}-${lName}`);
        });

        if (newWrestlers.length === 0) {
            setImportStatus('All names in CSV already exist. No changes made.');
            return;
        }

        setImportStatus(`Uploading ${newWrestlers.length} new wrestlers...`);

        const batch = writeBatch(db);
        newWrestlers.forEach(wrestler => {
            const docRef = doc(collection(db, "roster"));
            batch.set(docRef, wrestler);
        });
        await batch.commit();
        setImportStatus(`Success! Added ${newWrestlers.length} new wrestlers.`);
        setCsvData('');
        fetchRoster();
    } catch (e: any) {
        setImportStatus('Error uploading: ' + e.message);
    }
  };

  const filteredRoster = roster.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAbsentStudents = () => {
    const presentIds = new Set(todaysAttendance.map(a => a.studentId));
    return roster.filter(student => !presentIds.has(student.id));
  };

  // --- UI RENDER ---
  if (view === 'success') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-700">
          <div className="mx-auto bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Checked In!</h2>
          <p className="text-gray-400 mb-8">Go start your warmup.</p>
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans selection:bg-blue-500 selection:text-white">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="p-6 pt-12 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Wrestling<span className="text-blue-500">Tracker</span>
            </h1>
            <p className="text-gray-500 mt-2">Daily Practice Check-in</p>
          </div>
          {view === 'admin' && (
             <div className="text-right">
               <div className="text-xs font-mono text-gray-500">{new Date().toLocaleDateString()}</div>
               <div className="text-xs font-bold text-blue-400">Coach Mode</div>
             </div>
          )}
        </div>

        {/* Main Card */}
        <div className="flex-1 bg-gray-800 rounded-t-3xl p-6 shadow-2xl border-t border-gray-700 overflow-hidden flex flex-col">
          
          {view === 'checkin' && (
            <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-2">Find Your Name</label>
              <div className="relative">
                <Search className="absolute left-4 top-4 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Start typing..."
                  className="w-full bg-gray-700 border border-gray-600 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-lg"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {searchTerm && !selectedStudent && (
                <div className="absolute z-10 w-full bg-gray-700 border border-gray-600 mt-2 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                  {filteredRoster.length > 0 ? (
                    filteredRoster.map(student => (
                      <div
                        key={student.id}
                        onClick={() => selectStudent(student)}
                        className="p-4 hover:bg-blue-600/20 cursor-pointer border-b border-gray-600/50 last:border-0 flex justify-between items-center group"
                      >
                        <div className="flex-1">
                          <span className="font-medium group-hover:text-blue-400 transition-colors block text-lg">{student.name}</span>
                          <div className="flex gap-2 text-xs text-gray-400 mt-1">
                            {student.grade && <span>Gr: {student.grade}</span>}
                          </div>
                          {student.needsDocs === 'Yes' && (
                             <span className="text-red-400 text-xs font-bold flex items-center gap-1 mt-1">
                               <AlertCircle className="w-3 h-3"/> Missing Docs
                             </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-gray-500 text-center">
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
              <label className="block text-sm font-medium text-gray-400 mb-2">Current Weight (lbs)</label>
              <div className="relative">
                <Scale className="absolute left-4 top-4 text-gray-500 w-5 h-5" />
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-gray-700 border border-gray-600 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-xl font-mono"
                />
              </div>
            </div>

            {/* Skin Check Toggle */}
            <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Skin Check Clear?</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSkinCheck(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${skinCheck ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-gray-700 text-gray-500'}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkinCheck(false)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${!skinCheck ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gray-700 text-gray-500'}`}
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
                ? 'bg-gray-600 text-gray-400 cursor-wait' 
                : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20 hover:-translate-y-1'
              }`}
            >
              {loading ? 'Logging...' : 'Check In'}
            </button>
            </form>
          )}

          {/* --- ADMIN DASHBOARD --- */}
          {view === 'admin' && (
            <div className="flex flex-col h-full animate-in fade-in">
              
              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-gray-700 pb-2">
                <button 
                  onClick={() => setAdminTab('live')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${adminTab === 'live' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                >
                  Live Practice
                </button>
                <button 
                  onClick={() => setAdminTab('roster')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${adminTab === 'roster' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                >
                  Roster Tools
                </button>
              </div>

              {/* LIVE TAB */}
              {adminTab === 'live' && (
                <div className="space-y-4 overflow-y-auto pb-20">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-4 rounded-xl border border-gray-600">
                      <div className="text-gray-400 text-xs uppercase font-bold mb-1">Present</div>
                      <div className="text-3xl font-bold text-green-400">{todaysAttendance.length}</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-xl border border-gray-600">
                      <div className="text-gray-400 text-xs uppercase font-bold mb-1">Absent</div>
                      <div className="text-3xl font-bold text-red-400">{getAbsentStudents().length}</div>
                    </div>
                  </div>

                  {/* List Container */}
                  <div className="bg-gray-700 rounded-xl border border-gray-600 overflow-hidden">
                     <div className="p-3 bg-gray-800/50 border-b border-gray-600 font-bold text-gray-300 flex items-center gap-2">
                       <UserCheck className="w-4 h-4 text-green-400" /> Checked In
                     </div>
                     <div className="divide-y divide-gray-600/50">
                       {todaysAttendance.length === 0 && <div className="p-4 text-gray-500 text-sm text-center">No check-ins yet today.</div>}
                       {todaysAttendance.map(record => (
                         <div key={record.id} className="p-3 flex justify-between items-center hover:bg-gray-600/30">
                           <div>
                             <div className="font-bold text-gray-200">{record.name}</div>
                             <div className="text-xs text-gray-500 flex items-center gap-2">
                               <Clock className="w-3 h-3" /> {record.time || '00:00'}
                             </div>
                           </div>
                           <div className="text-right">
                             <div className="font-mono text-blue-400 font-bold">{record.weight} lbs</div>
                             {!record.skinCheckPass && (
                               <div className="text-xs text-red-400 font-bold flex items-center justify-end gap-1">
                                 <AlertCircle className="w-3 h-3" /> Skin Issue
                               </div>
                             )}
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>

                  <div className="bg-gray-700 rounded-xl border border-gray-600 overflow-hidden">
                     <div className="p-3 bg-gray-800/50 border-b border-gray-600 font-bold text-gray-300 flex items-center gap-2">
                       <UserX className="w-4 h-4 text-red-400" /> Absent
                     </div>
                     <div className="divide-y divide-gray-600/50 max-h-60 overflow-y-auto">
                        {getAbsentStudents().map(s => (
                          <div key={s.id} className="p-3 text-sm text-gray-400 flex justify-between">
                            <span>{s.name}</span>
                            <span className="text-gray-500 text-xs">{s.grade ? `Gr ${s.grade}` : ''}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              )}

              {/* ROSTER TAB */}
              {adminTab === 'roster' && (
                <div className="space-y-6 overflow-y-auto pb-20">
                  
                  {/* DANGER ZONE - CLEAR DB */}
                  <div className="bg-red-900/10 border border-red-900/50 p-4 rounded-lg">
                     <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Danger Zone</h4>
                     <p className="text-xs text-gray-400 mb-3">
                        Need to start over? This deletes EVERYONE from the roster.
                     </p>
                     <button
                        onClick={handleDeleteAllRoster}
                        className="w-full bg-red-900/50 hover:bg-red-900/80 text-white border border-red-800 text-sm py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                     >
                        <Trash2 className="w-4 h-4"/> Delete Entire Roster
                     </button>
                  </div>

                  {/* PRELOADED BUTTON */}
                  <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg">
                    <h4 className="text-blue-300 font-bold mb-2 flex items-center gap-2"><Users className="w-4 h-4"/> 2024-25 Team Roster</h4>
                    <p className="text-xs text-gray-400 mb-3">
                        Safe Load: Checks for duplicates before adding.
                    </p>
                    <button 
                      onClick={handlePreloadedImport}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/50"
                    >
                      <UploadCloud className="w-4 h-4" /> Load Full Team Roster
                    </button>
                  </div>

                  {/* Manual CSV Import */}
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <p className="text-xs text-gray-500 mb-2 font-bold uppercase">Manual Import (Optional)</p>
                    <textarea 
                      className="w-full bg-gray-800 border border-gray-600 text-xs text-gray-300 p-2 rounded h-24 font-mono"
                      placeholder={`Email,Last_Name,First_Name,Grade,Status\njdoe@school.edu,Doe,John,10,Active`}
                      value={csvData}
                      onChange={(e) => setCsvData(e.target.value)}
                    />
                    <button 
                      onClick={handleBulkImport}
                      className="mt-2 w-full bg-gray-600 hover:bg-gray-500 text-white text-sm py-2 rounded flex items-center justify-center gap-2"
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
                    <h4 className="text-gray-500 text-xs font-bold uppercase mb-2">Quick Add Single</h4>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Lastname, Firstname"
                        className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm w-full text-white"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                      />
                      <button 
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg"
                        onClick={async () => {
                          if(newStudentName) {
                            try {
                              const parts = newStudentName.split(',');
                              const lastName = parts[0].trim();
                              const firstName = parts[1] ? parts[1].trim() : '';
                              await addDoc(collection(db, "roster"), { Last_Name: lastName, First_Name: firstName, Status: 'Active' });
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
          )}

          {/* Footer / Admin Toggle */}
          <div className="mt-auto pt-4 text-center border-t border-gray-700">
             <button onClick={() => setView(view === 'admin' ? 'checkin' : 'admin')} className="text-gray-600 hover:text-blue-400 text-xs flex items-center justify-center gap-2 mx-auto uppercase font-bold tracking-wider">
               <LayoutDashboard className="w-3 h-3" />
               {view === 'admin' ? 'Back to Student Check-in' : 'Coach Dashboard'}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
