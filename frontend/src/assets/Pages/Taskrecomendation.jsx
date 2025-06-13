import Navbar from '../../Components/Navbar';
import { useEffect, useState } from 'react';
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function Tasklist() {
  const [sidebar, setSidebar] = useState(false);
  const [userid, setUserid] = useState(0);
  const [error, setError] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoding = jwtDecode(token);
        setUserid(decoding.id);
      } catch {
        setError("Invalid token");
      }
    } else {
      setError("The user is not authenticated");
    }
  }, []);

  const toggleSidebar = () => {
    setSidebar(prev => !prev);
  };

  const handleRecommendClick = async () => {
    if (!userid) return;
    setLoading(true);
    setError(null);

    try {
      const baseURL = `http://localhost:4001/todo/recomendation/${userid}`;
      const response = await fetch(baseURL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const error_data = await response.json();
        throw new Error(error_data.message || "There is an error.");
      }

      const responseData = await response.json();
      const tasks = responseData.data || [];

      await new Promise(res => setTimeout(res, 3000));

      if (!Array.isArray(tasks) || tasks.length === 0) {
        setList([]);
        setError("No recommended tasks found.");
        return;
      }

      const filteredTasks = tasks.filter((task) => task.priority >= 1 && task.priority <= 5);

      if (filteredTasks.length === 0) {
        setList([]);
        setError("No tasks with priority 1 to 5 found.");
        return;
      }

      const sortedTasks = filteredTasks.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return new Date(a.date) - new Date(b.date);
      });

      setList(sortedTasks.slice(0, 1));
      setError(null);
    } catch (error) {
      setError(`Oops, there is an error: ${error.message || error}`);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebarButton = (
    <BsLayoutSidebarInsetReverse
      size={30}
      className="hover:text-gray-400 cursor-pointer"
      onClick={toggleSidebar}
    />
  );

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white overflow-x-hidden relative">
      <Navbar />

      <div className={`fixed left-0 top-[7vh] h-[93vh] bg-gray-900 shadow-xl z-20 transition-all duration-300 ${sidebar ? 'w-[280px]' : 'w-0 overflow-hidden'}`}>
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Dashboard</h2>
          <button onClick={() => setSidebar(false)} className="text-white text-2xl">&times;</button>
        </div>
        <nav className="flex flex-col p-5 gap-4 text-gray-300">
          <Link to="/" className="hover:bg-gray-800 p-2 rounded">Add a Task</Link>
          <Link to="/tasklist" className="hover:bg-gray-800 p-2 rounded">Task List</Link>
          <Link to="/taskupdation" className="hover:bg-gray-800 p-2 rounded">Update Task</Link>
          <Link to="/taskdel" className="hover:bg-gray-800 p-2 rounded">Delete Task</Link>
          <Link to="/taskrecomend" className="hover:bg-gray-800 p-2 rounded">Recommendation</Link>
        </nav>
      </div>

      <div className="absolute top-20 left-8 z-30">
        {!sidebar && toggleSidebarButton}
      </div>

      <div className="flex flex-col items-center justify-center h-[80vh] px-4 max-w-xl mx-auto">
        {loading && (
          <div className="w-full bg-gray-300 h-2 rounded overflow-hidden mb-6">
            <div
              className="bg-blue-400 h-2 rounded animate-loading"
              style={{ width: '100%' }}
            ></div>
          </div>
        )}

        <button
          onClick={handleRecommendClick}
          disabled={loading}
          className={`bg-amber-500 text-black px-6 py-3 rounded-lg font-bold text-lg hover:bg-amber-600 transition-all duration-200 ${
            loading ? 'cursor-not-allowed opacity-60' : ''
          }`}
        >
          Recommend
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {list.length > 0 && (
          <div className="mt-8 w-full bg-blue-900 bg-opacity-50 rounded p-4 text-white shadow-lg animate-glow">
            <h3 className="text-xl font-semibold mb-2">Urgent Task Recommendation</h3>
            <p><strong>Title:</strong> {list[0].title}</p>
            <p><strong>Description:</strong> {list[0].description}</p>
            <p><strong>Priority:</strong> {list[0].priority}</p>
            <p><strong>Deadline:</strong> {new Date(list[0].date).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes loading-bar {
            from { width: 0%; }
            to { width: 100%; }
          }
          .animate-loading {
            animation: loading-bar 3s linear forwards;
          }
          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 8px 2px rgba(147,197,253,0.8);
            }
            50% {
              box-shadow: 0 0 20px 5px rgba(147,197,253,1);
            }
          }
          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}

export default Tasklist;
