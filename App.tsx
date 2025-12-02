import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, writeBatch, doc, where, deleteDoc, limit } from 'firebase/firestore';
import { Search, CheckCircle, Scale, AlertCircle, UserPlus, ClipboardList, UploadCloud, Users, Calendar, Clock, UserCheck, UserX, LayoutDashboard, Trash2, AlertTriangle, Lock, Unlock, History, BarChart3, XCircle, Download, Filter, ChevronDown, ChevronUp, Copy, Check, CloudLightning } from 'lucide-react';

// --- CONFIGURATION ---

// 1. FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB2o-alpxS215ZOlhEtkiSlaNtrj5zcrCw",
  authDomain: "practice-attendance-5bb5f.firebaseapp.com",
  projectId: "practice-attendance-5bb5f",
  storageBucket: "practice-attendance-5bb5f.firebasestorage.app",
  messagingSenderId: "1018345303502",
  appId: "1:1018345303502:web:87bbf8e2cb05545a858f9f",
  measurementId: "G-HZW064BG49"
};

// 2. GOOGLE SHEETS INTEGRATION
// PASTE YOUR URL BELOW between the quotes!
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw6bCuDdbXVohBfD0cvP_xzfI8iz8r99N4b2kEIeL3tJUngVl5kpLb19_Dq_L5PPwJTCQ/exec"; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- PRELOADED DATA ---
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
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  
  // Admin State
  const [adminTab, setAdminTab] = useState('live'); // 'live', 'history', 'roster'
  const [newStudentName, setNewStudentName] = useState('');
  const [csvData, setCsvData] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [todaysAttendance, setTodaysAttendance] = useState<any[]>([]);
  const [historyRecords, setHistoryRecords] = useState<any[]>([]);
  const [historyStats, setHistoryStats] = useState<any[]>([]);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [copiedDate, setCopiedDate] = useState<string | null>(null);
  
  // Report Filters
  const [reportStartDate, setReportStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [reportEndDate, setReportEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportStudentFilter, setReportStudentFilter] = useState('');
  const [reportGradeFilter, setReportGradeFilter] = useState('');

  // Security State
  const [isCoachAuthenticated, setIsCoachAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

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

  // Fetch History
  const fetchHistory = async () => {
    try {
      const q = query(collection(db, "attendance"), orderBy("timestamp", "desc"), limit(2000));
      const querySnapshot = await getDocs(q);
      
      const records = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setHistoryRecords(records);

      const stats: {[key: string]: number} = {};
      records.forEach((data: any) => {
        const date = data.date;
        if(date) stats[date] = (stats[date] || 0) + 1;
      });

      const statsArray = Object.keys(stats).map(date => ({
        date,
        count: stats[date]
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setHistoryStats(statsArray);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  useEffect(() => {
    if (view === 'admin' && isCoachAuthenticated) {
      fetchTodaysAttendance();
      if (adminTab === 'history') fetchHistory();
    }
  }, [view, adminTab, isCoachAuthenticated]);

  useEffect(() => {
    if (view !== 'admin') {
      setIsCoachAuthenticated(false);
      setPasswordInput('');
    }
  }, [view]);

  // AUTO-RESET TIMER
  useEffect(() => {
    if (view === 'success') {
      const timer = setTimeout(() => {
        setView('checkin');
        setWeight('');
        setNotes('');
        setSearchTerm('');
        setSelectedStudent(null);
        setSyncStatus('idle');
      }, 2500); 
      return () => clearTimeout(timer);
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
    setSyncStatus('syncing');
    
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
      // 1. Save to Firebase
      await addDoc(collection(db, "attendance"), data);
      
      // 2. Send to Google Sheets (if URL provided)
      if (GOOGLE_SCRIPT_URL) {
        // We use no-cors to prevent CORS errors since we just want to fire and forget
        fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }).then(() => setSyncStatus('success'))
          .catch(() => setSyncStatus('error'));
      } else {
        setSyncStatus('success');
      }

      setView('success');
      setError('');
    } catch (err) {
      console.error(err);
      setError("Failed to check in. Please try again.");
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCheckIn = async (id: string, name: string) => {
    if(!confirm(`Remove ${name} from today's attendance?`)) return;
    try {
      await deleteDoc(doc(db, "attendance", id));
      fetchTodaysAttendance(); 
    } catch(e) {
      alert("Error deleting record.");
    }
  };

  const handleDeleteAllRoster = async () => {
    if (!confirm("⚠️ WARNING: This will DELETE EVERY STUDENT in the roster.\n\nYou will have to reload the team from the button above.\n\nAre you absolutely sure?")) return;
    setImportStatus('Deleting entire roster...');
    try {
        const q = query(collection(db, "roster"));
        const snapshot = await getDocs(q);
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

  const attemptLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.toLowerCase() === 'bluejays') {
      setIsCoachAuthenticated(true);
      setPasswordInput('');
    } else {
      alert('Incorrect Password');
    }
  };

  const handleCopyForSheets = (date: string) => {
    const records = historyRecords.filter(r => r.date === date).sort((a,b) => a.name.localeCompare(b.name));
    let text = "Name\tWeight\tTime\tNotes\n";
    records.forEach(r => {
      text += `${r.name}\t${r.weight}\t${r.time}\t${r.notes || ''}\n`;
    });
    navigator.clipboard.writeText(text).then(() => {
      setCopiedDate(date);
      setTimeout(() => setCopiedDate(null), 2000);
    });
  };

  const handleGenerateReport = async () => {
    try {
        let records = historyRecords;
        const start = new Date(reportStartDate).setHours(0,0,0,0);
        const end = new Date(reportEndDate).setHours(23,59,59,999);

        records = records.filter(r => {
            const rDate = new Date(r.timestamp).getTime();
            return rDate >= start && rDate <= end;
        });

        if (reportStudentFilter) {
            records = records.filter(r => r.name === reportStudentFilter);
        }

        if (reportGradeFilter) {
            records = records.filter(r => r.grade === reportGradeFilter);
        }

        if (records.length === 0) {
            alert("No records found matching these filters.");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Time,Name,Grade,Weight,Skin Check,Notes\n";

        records.forEach(row => {
            const skinCheck = row.skinCheckPass ? "Pass" : "Fail";
            const notes = row.notes ? `"${row.notes.replace(/"/g, '""')}"` : "";
            csvContent += `${row.date},${row.time},${row.name},${row.grade || ''},${row.weight},${skinCheck},${notes}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `attendance_report_${reportStartDate}_to_${reportEndDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (e) {
        console.error(e);
        alert("Error generating report");
    }
  };

  const handlePreloadedImport = async () => {
    setImportStatus('Checking for duplicates...');
    try {
        const currentRosterSnapshot = await getDocs(collection(db, "roster"));
        const existingNames = new Set();
        currentRosterSnapshot.docs.forEach(doc => {
            const data = doc.data();
            const key = `${data.First_Name}-${data.Last_Name}`.toLowerCase().trim();
            existingNames.add(key);
        });

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
            batch.set(docRef, { ...wrestler, Status: 'Active' });
        });
        await batch.commit();
        setImportStatus(`Success! Added ${newWrestlers.length} wrestlers.`);
        fetchRoster();
    } catch (e: any) {
        setImportStatus('Error uploading: ' + e.message);
    }
  };

  const handleDeduplicate = async () => {
    if (!confirm("This will scan based on FIRST NAME + LAST NAME + GRADE. If all 3 match, duplicates are deleted. Continue?")) return;
    setImportStatus('Scanning for duplicates...');
    try {
      const q = query(collection(db, "roster"));
      const snapshot = await getDocs(q);
      const seen = new Set();
      const duplicates: string[] = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const fName = (data.First_Name || data.firstname || data.firstName || '').toString().trim().toLowerCase();
        const lName = (data.Last_Name || data.lastname || data.lastName || '').toString().trim().toLowerCase();
        const grade = (data.Grade || data.grade || '').toString().trim();
        if (!fName && !lName) return;
        const key = `${fName}|${lName}|${grade}`;
        if (seen.has(key)) duplicates.push(doc.id);
        else seen.add(key);
      });

      if (duplicates.length === 0) {
        setImportStatus('No duplicates found.');
        return;
      }
      setImportStatus(`Found ${duplicates.length} duplicates. Deleting...`);
      const batchSize = 500;
      for (let i = 0; i < duplicates.length; i += batchSize) {
        const batch = writeBatch(db);
        const chunk = duplicates.slice(i, i + batchSize);
        chunk.forEach(id => batch.delete(doc(db, "roster", id)));
        await batch.commit();
      }
      setImportStatus(`Success! Cleaned up ${duplicates.length} duplicate entries.`);
      fetchRoster();
    } catch (e: any) {
      setImportStatus('Error cleaning up: ' + e.message);
    }
  };

  const handleBulkImport = async () => {
    if (!csvData) return;
    setImportStatus('Parsing...');
    const rows = csvData.trim().split('\n');
    if (rows.length < 2) {
      setImportStatus('Error: No data rows found.');
      return;
    }
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
        if (val && val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (header) obj[header] = val;
      });
      return obj;
    }).filter(w => w && w.Last_Name && w.First_Name); 

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

  // --- UI ---
  if (view === 'success') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-700 relative overflow-hidden">
          <div className="mx-auto bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Checked In!</h2>
          <p className="text-gray-400 mb-8">Go start your warmup.</p>
          
          {/* Cloud Sync Status Indicator */}
          {GOOGLE_SCRIPT_URL && (
             <div className={`absolute top-4 right-4 flex items-center gap-1 text-xs font-bold ${syncStatus === 'error' ? 'text-red-400' : 'text-blue-400'}`}>
               <CloudLightning className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-pulse' : ''}`} />
               {syncStatus === 'syncing' && 'Syncing...'}
               {syncStatus === 'success' && 'Sheet Updated'}
               {syncStatus === 'error' && 'Sheet Error'}
             </div>
          )}

          <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden mb-6">
             <div className="bg-blue-500 h-full w-full animate-[width_2.5s_linear_reverse_infinite] origin-left"></div>
          </div>
          <button onClick={() => setView('checkin')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all">
            Next Wrestler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans selection:bg-blue-500 selection:text-white">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <div className="p-6 pt-12 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Wrestling<span className="text-blue-500">Tracker</span></h1>
            <p className="text-gray-500 mt-2">Daily Practice Check-in</p>
          </div>
          {view === 'admin' && (
             <div className="text-right">
               <div className="text-xs font-mono text-gray-500">{new Date().toLocaleDateString()}</div>
               <div className="text-xs font-bold text-blue-400">Coach Mode</div>
             </div>
          )}
        </div>

        <div className="flex-1 bg-gray-800 rounded-t-3xl p-6 shadow-2xl border-t border-gray-700 overflow-hidden flex flex-col">
          
          {/* LOGIN SCREEN FOR COACH MODE */}
          {view === 'admin' && !isCoachAuthenticated && (
            <div className="flex flex-col h-full items-center justify-center animate-in fade-in">
                <div className="bg-gray-700 border border-gray-600 p-8 rounded-xl text-center w-full max-w-sm mx-auto shadow-xl">
                    <Lock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-white font-bold mb-2 text-xl">Coach Access</h3>
                    <p className="text-gray-400 text-sm mb-6">Enter team password to view dashboard.</p>
                    <form onSubmit={attemptLogin}>
                        <input 
                        type="password" 
                        autoFocus
                        className="bg-gray-800 border border-gray-500 text-white px-4 py-3 rounded-lg w-full mb-4 text-center text-lg tracking-widest placeholder-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors">
                        Unlock Dashboard
                        </button>
                    </form>
                    <button onClick={() => setView('checkin')} className="mt-6 text-gray-500 text-sm hover:text-white">
                        Cancel / Back to Check-in
                    </button>
                </div>
            </div>
          )}

          {/* CHECK-IN VIEW */}
          {view === 'checkin' && (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-2">Find Your Name</label>
              <div className="relative">
                <Search className="absolute left-4 top-4 text-gray-500 w-5 h-5" />
                <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Start typing..." className="w-full bg-gray-700 border border-gray-600 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-lg" />
              </div>
              {searchTerm && !selectedStudent && (
                <div className="absolute z-10 w-full bg-gray-700 border border-gray-600 mt-2 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                  {filteredRoster.length > 0 ? (
                    filteredRoster.map(student => (
                      <div key={student.id} onClick={() => selectStudent(student)} className="p-4 hover:bg-blue-600/20 cursor-pointer border-b border-gray-600/50 last:border-0 flex justify-between items-center group">
                        <div className="flex-1">
                          <span className="font-medium group-hover:text-blue-400 transition-colors block text-lg">{student.name}</span>
                          <div className="flex gap-2 text-xs text-gray-400 mt-1">
                            {student.grade && <span>Gr: {student.grade}</span>}
                          </div>
                          {student.needsDocs === 'Yes' && (<span className="text-red-400 text-xs font-bold flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> Missing Docs</span>)}
                        </div>
                      </div>
                    ))
                  ) : <div className="p-4 text-gray-500 text-center">No wrestler found</div>}
                </div>
              )}
              {selectedStudent && (<div className="mt-2 text-blue-400 text-sm flex items-center gap-2 bg-blue-500/10 p-2 rounded-lg inline-flex"><CheckCircle className="w-4 h-4" /> Selected: {selectedStudent.name}</div>)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Current Weight (lbs)</label>
              <div className="relative">
                <Scale className="absolute left-4 top-4 text-gray-500 w-5 h-5" />
                <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0.0" className="w-full bg-gray-700 border border-gray-600 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-xl font-mono" />
              </div>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Skin Check Clear?</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setSkinCheck(true)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${skinCheck ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-gray-700 text-gray-500'}`}>Yes</button>
                  <button type="button" onClick={() => setSkinCheck(false)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${!skinCheck ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gray-700 text-gray-500'}`}>No</button>
                </div>
              </div>
            </div>
            {error && (<div className="bg-red-500/10 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm"><AlertCircle className="w-4 h-4" /> {error}</div>)}
            <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all ${loading ? 'bg-gray-600 text-gray-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20 hover:-translate-y-1'}`}>{loading ? 'Logging...' : 'Check In'}</button>
            </form>
          )}

          {view === 'admin' && isCoachAuthenticated && (
            <div className="flex flex-col h-full animate-in fade-in">
              <div className="flex gap-2 mb-4 border-b border-gray-700 pb-2">
                <button onClick={() => setAdminTab('live')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'live' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>Live Practice</button>
                <button onClick={() => setAdminTab('history')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>History</button>
                <button onClick={() => setAdminTab('roster')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${adminTab === 'roster' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>Roster Tools</button>
              </div>

              {adminTab === 'live' && (
                <div className="space-y-4 overflow-y-auto pb-20">
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
                  <div className="bg-gray-700 rounded-xl border border-gray-600 overflow-hidden">
                     <div className="p-3 bg-gray-800/50 border-b border-gray-600 font-bold text-gray-300 flex items-center gap-2"><UserCheck className="w-4 h-4 text-green-400" /> Checked In</div>
                     <div className="divide-y divide-gray-600/50">
                       {todaysAttendance.length === 0 && <div className="p-4 text-gray-500 text-sm text-center">No check-ins yet today.</div>}
                       {todaysAttendance.map(record => (
                         <div key={record.id} className="p-3 flex justify-between items-center hover:bg-gray-600/30">
                           <div>
                             <div className="font-bold text-gray-200">{record.name}</div>
                             <div className="text-xs text-gray-500 flex items-center gap-2"><Clock className="w-3 h-3" /> {record.time || '00:00'}</div>
                           </div>
                           <div className="text-right flex items-center gap-3">
                             <div>
                               <div className="font-mono text-blue-400 font-bold">{record.weight} lbs</div>
                               {!record.skinCheckPass && (<div className="text-xs text-red-400 font-bold flex items-center justify-end gap-1"><AlertCircle className="w-3 h-3" /> Skin Issue</div>)}
                             </div>
                             <button onClick={() => handleDeleteCheckIn(record.id, record.name)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-gray-700 rounded-full transition-colors"><XCircle className="w-5 h-5" /></button>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>
                  <div className="bg-gray-700 rounded-xl border border-gray-600 overflow-hidden">
                     <div className="p-3 bg-gray-800/50 border-b border-gray-600 font-bold text-gray-300 flex items-center gap-2"><UserX className="w-4 h-4 text-red-400" /> Absent</div>
                     <div className="divide-y divide-gray-600/50 max-h-60 overflow-y-auto">
                        {getAbsentStudents().map(s => (
                          <div key={s.id} className="p-3 text-sm text-gray-400 flex justify-between"><span>{s.name}</span><span className="text-gray-500 text-xs">{s.grade ? `Gr ${s.grade}` : ''}</span></div>
                        ))}
                     </div>
                  </div>
                </div>
              )}

              {adminTab === 'history' && (
                <div className="space-y-4 overflow-y-auto pb-20">
                   {/* REPORT BUILDER */}
                   <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                        <h4 className="text-blue-300 font-bold">Report Builder</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Start Date</label>
                          <input type="date" className="w-full bg-gray-800 border border-gray-600 text-white text-xs rounded p-2" value={reportStartDate} onChange={e => setReportStartDate(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">End Date</label>
                          <input type="date" className="w-full bg-gray-800 border border-gray-600 text-white text-xs rounded p-2" value={reportEndDate} onChange={e => setReportEndDate(e.target.value)} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Filter by Athlete</label>
                          <select className="w-full bg-gray-800 border border-gray-600 text-white text-xs rounded p-2" value={reportStudentFilter} onChange={e => setReportStudentFilter(e.target.value)}>
                            <option value="">All Athletes</option>
                            {roster.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Filter by Grade/Group</label>
                          <select className="w-full bg-gray-800 border border-gray-600 text-white text-xs rounded p-2" value={reportGradeFilter} onChange={e => setReportGradeFilter(e.target.value)}>
                            <option value="">All Grades</option>
                            {[...new Set(roster.map(s => s.grade).filter(Boolean))].sort().map(g => (
                              <option key={g} value={g}>Grade {g}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button onClick={handleGenerateReport} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-3 rounded flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" /> Download Report (CSV)
                      </button>
                   </div>

                   {/* RECENT HISTORY LIST */}
                   <div className="bg-gray-700 rounded-xl border border-gray-600 overflow-hidden">
                     <div className="p-3 bg-gray-800/50 border-b border-gray-600 font-bold text-gray-300 text-xs uppercase tracking-wider">Recent Activity</div>
                     <div className="divide-y divide-gray-600/50">
                        {historyStats.length === 0 && <div className="p-6 text-center text-gray-500">No past history found.</div>}
                        {historyStats.map((stat, idx) => (
                          <div key={idx} className="flex flex-col border-b border-gray-700/50 last:border-0">
                            {/* Header Row */}
                            <button 
                              onClick={() => setExpandedDate(expandedDate === stat.date ? null : stat.date)}
                              className="p-4 flex justify-between items-center hover:bg-gray-600/30 w-full"
                            >
                               <div className="flex items-center gap-3">
                                 <Calendar className="w-5 h-5 text-gray-500" />
                                 <span className="font-bold text-gray-200">{stat.date}</span>
                               </div>
                               <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-lg border border-gray-600">
                                    <Users className="w-4 h-4 text-blue-400" />
                                    <span className="font-bold text-white">{stat.count}</span>
                                  </div>
                                  {expandedDate === stat.date ? <ChevronUp className="w-4 h-4 text-gray-500"/> : <ChevronDown className="w-4 h-4 text-gray-500"/>}
                               </div>
                            </button>

                            {/* Detail Dropdown */}
                            {expandedDate === stat.date && (
                              <div className="bg-gray-900/50 p-4 border-t border-gray-700 animate-in slide-in-from-top-2">
                                <div className="flex justify-between items-center mb-3">
                                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Attendees</h5>
                                  <button 
                                    onClick={() => handleCopyForSheets(stat.date)}
                                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${copiedDate === stat.date ? 'text-green-400 bg-green-900/20' : 'text-blue-400 hover:bg-blue-900/20'}`}
                                  >
                                    {copiedDate === stat.date ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>}
                                    {copiedDate === stat.date ? 'Copied!' : 'Copy for Sheets'}
                                  </button>
                                </div>
                                <div className="space-y-2">
                                  {historyRecords
                                    .filter(r => r.date === stat.date)
                                    .sort((a,b) => a.name.localeCompare(b.name))
                                    .map(student => (
                                      <div key={student.id} className="flex justify-between text-sm text-gray-300 border-b border-gray-800 pb-1 last:border-0">
                                        <span>{student.name}</span>
                                        <div className="flex gap-4 font-mono text-gray-500">
                                          <span>{student.weight} lbs</span>
                                          <span>{student.time}</span>
                                        </div>
                                      </div>
                                    ))
                                  }
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                     </div>
                   </div>
                </div>
              )}

              {adminTab === 'roster' && (
                <div className="space-y-6 overflow-y-auto pb-20">
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                      <div className="bg-red-900/10 border border-red-900/50 p-4 rounded-lg mb-6">
                        <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Danger Zone</h4>
                        <p className="text-xs text-gray-400 mb-3">Need to start over? This deletes EVERYONE from the roster.</p>
                        <button onClick={handleDeleteAllRoster} className="w-full bg-red-900/50 hover:bg-red-900/80 text-white border border-red-800 text-sm py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2"><Trash2 className="w-4 h-4"/> Delete Entire Roster</button>
                      </div>
                      <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg mb-6">
                        <h4 className="text-blue-300 font-bold mb-2 flex items-center gap-2"><Users className="w-4 h-4"/> 2024-25 Team Roster</h4>
                        <p className="text-xs text-gray-400 mb-3">Safe Load: Checks for duplicates before adding.</p>
                        <button onClick={handlePreloadedImport} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/50"><UploadCloud className="w-4 h-4" /> Load Full Team Roster</button>
                      </div>
                      <div className="bg-orange-900/10 border border-orange-900/50 p-4 rounded-lg mb-6">
                        <h4 className="text-orange-400 font-bold mb-2 flex items-center gap-2"><Trash2 className="w-4 h-4"/> Maintenance</h4>
                        <p className="text-xs text-gray-400 mb-3">Duplicate entries? Click below to keep one of each student and delete the extras.</p>
                        <button onClick={handleDeduplicate} className="w-full bg-orange-900/30 hover:bg-orange-900/50 text-orange-300 border border-orange-800 text-sm py-2 rounded-lg font-bold transition-all">Fix Duplicate Roster Entries</button>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 mb-6">
                        <p className="text-xs text-gray-500 mb-2 font-bold uppercase">Manual Import (Optional)</p>
                        <textarea className="w-full bg-gray-800 border border-gray-600 text-xs text-gray-300 p-2 rounded h-24 font-mono" placeholder={`Email,Last_Name,First_Name,Grade,Status\njdoe@school.edu,Doe,John,10,Active`} value={csvData} onChange={(e) => setCsvData(e.target.value)} />
                        <button onClick={handleBulkImport} className="mt-2 w-full bg-gray-600 hover:bg-gray-500 text-white text-sm py-2 rounded flex items-center justify-center gap-2"><UploadCloud className="w-4 h-4" /> Process Import</button>
                        {importStatus && (<div className="mt-2 text-xs text-blue-400 font-mono">{importStatus}</div>)}
                      </div>
                      <div className="mt-6">
                        <h4 className="text-gray-500 text-xs font-bold uppercase mb-2">Quick Add Single</h4>
                        <div className="flex gap-2">
                          <input type="text" placeholder="Lastname, Firstname" className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm w-full text-white" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} />
                          <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg" onClick={async () => { if(newStudentName) { try { const parts = newStudentName.split(','); const lastName = parts[0].trim(); const firstName = parts[1] ? parts[1].trim() : ''; await addDoc(collection(db, "roster"), { Last_Name: lastName, First_Name: firstName, Status: 'Active' }); setNewStudentName(''); fetchRoster(); alert('Added!'); } catch (e: any) { alert('Error adding student: ' + e.message); } } }}><UserPlus className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                </div>
              )}
            </div>
          )}

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
