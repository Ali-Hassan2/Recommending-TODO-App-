import Navbar from '../../Components/Navbar';
import { useEffect, useState } from 'react';
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = { TASK: 'task' };

const TaskCard = ({ task, side }) => {
  const [, drag] = useDrag(() => ({
    type: ItemType.TASK,
    item: { task },
  }));

  return (


    <div
      ref={drag}
      className={` ${side ? "w-[200px]" : "w-full"}bg-gray-900 text-white p-4 rounded-xl shadow border border-gray-800 cursor-move`}>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <p><span className="text-gray-400 font-semibold">Name:</span> {task.title}</p>
        <p><span className="text-gray-400 font-semibold">Due:</span> {new Date(task.date).toLocaleDateString()}</p>
        <p><span className="text-gray-400 font-semibold">Priority:</span> {task.priority}</p>
      </div>
      <div className="mt-2">
        <p><span className="text-gray-400 font-semibold">Description:</span> {task.description}</p>
      </div>
    </div>
  );
};

const DoneBox = ({ doneList, onDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemType.TASK,
    drop: (item) => onDrop(item.task),
  }));

  return (
    <div
      ref={drop}
      className="w-full md:w-[300px] bg-green-900 text-white p-4 rounded-xl shadow-xl border border-green-700 min-h-[200px]"
    >
      <h3 className="text-lg font-semibold mb-3">Done ({doneList.length})</h3>
      {doneList.map((task) => (
        <div key={task.Id} className="text-sm bg-green-800 p-2 mb-2 rounded">
          {task.title}
        </div>
      ))}
    </div>
  );
};

function Tasklist() {
  const [sidebar, setSidebar] = useState(false);
  const [userid, setuserid] = useState(0);
  const [list, setlist] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoding = jwtDecode(token);
        setuserid(decoding.id);
      } catch {
        seterror("Invalid token");
      }
    } else {
      seterror("The user is not authenticated");
    }
  }, []);

  useEffect(() => {
    if (!userid) return;

    const controller = new AbortController();

    const gettask = async () => {
      try {
        setloading(true);
        seterror('');
        const response = await fetch(`http://localhost:4001/todo/gettask/${userid}`, {
          signal: controller.signal,
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Error while fetching tasks.");
        }

        const { success, data } = result;

        if (!success || !Array.isArray(data) || !data.length) {
          seterror("No tasks found.");
          setlist([]);
        } else {
          setlist(data);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          seterror(`Oops! ${error.message}`);
        }
      } finally {
        setloading(false);
      }
    };

    gettask();
    return () => controller.abort();
  }, [userid]);

  const toggleSidebar = () => {
    setSidebar(prev => !prev);
  };

  const handleDrop = (task) => {
    setDoneList((prev) => [...prev, task]);
    setlist((prev) => prev.filter((t) => t.Id !== task.Id));
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white overflow-x-hidden">
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
        {!sidebar && (
          <BsLayoutSidebarInsetReverse
            size={30}
            className="hover:text-gray-400 cursor-pointer"
            onClick={toggleSidebar}
          />
        )}
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="px-6 pt-24 pb-10 flex flex-col md:flex-row gap-6">
          <div
            className={`transition-all duration-300 ${sidebar ? 'ml-[280px]' : 'ml-0'
              } flex-1`}>

            {loading ? (
              <p className="text-gray-300 text-xl">Loading tasks...</p>
            ) : error ? (
              <p className="text-red-400 text-xl">{error}</p>
            ) : (
              <div className="flex flex-col space-y-4 rounded-xl">
                {list.map((task) => (
                  <TaskCard key={task.Id} task={task} side={sidebar} />
                ))}
              </div>
            )}
          </div>

          {/* Done List */}
          <DoneBox doneList={doneList} onDrop={handleDrop} />
        </div>
      </DndProvider>
    </div>
  );
}

export default Tasklist;
