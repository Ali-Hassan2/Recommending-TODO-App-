import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export function Lading() {
  const { user } = useContext(UserContext);
  const [press, setPress] = useState(false);
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [success,setsuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    priority: 3,
  });

  const handlePress = () => {
    const token = localStorage.getItem('token');

    if(token){
      const decoded = jwtDecode(token);
      console.log("The user id is: ",decoded.id)
     }
    if (!user) {
      setPress(false);
      setShowLoginMsg(true);
      return;
    }
    setPress(true);
    setShowLoginMsg(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'priority' ? Number(value) : value,
    }));
  };

  const controller = new AbortController();
  const signal = controller.signal;



  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Task Data:', formData);
    setFormData({ name: '', description: '', date: '', priority: '' });
    console.log("The task name is: ",formData.name)
    console.log("The task due_date is: ",formData.date)
    console.log("The task description is: ",formData.description)
    console.log("The task priority is: ",formData.priority)



    const baseURL  = `http://localhost:4001/todo/addingtask`;

    try {

      const token = localStorage.getItem('token');
      console.log('Token value is:', token);
      if (!token) {
        alert('Please login to add a task');
        return;
      }
      
      const response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
        signal,
      });

      if(!response.ok){
        const error_Data = await response.json();
        throw new Error(error_Data.message || "There is an error while posting data");
      }

      const data = await response.json();
      if(data.success){
        setsuccess(true);
        alert('data added bro.')
      }

      setFormData({name:'',date:'',description:'',priority:''});
      
    } catch (error) {
      if(error.name !== 'AbortError'){
        console.log("There is an error while making the fetch call",error);
      }
    }



    setPress(false);
  };


  useEffect(() => {
    if (!user) setPress(false);
  }, [user]);

  return (
    <div className="h-[93vh] w-full bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white flex items-start overflow-hidden">
      <div className={`fixed  left-0 h-[93vh] bg-gray-900 shadow-xl z-20 transition-all duration-300 ${sidebar ? 'w-[280px]' : 'w-0 overflow-hidden'}`}>
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-xl font-semibold tracking-wide">Dashboard</h2>
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

      <div className="absolute  left-8 z-30">
        {!sidebar && (
          <BsLayoutSidebarInsetReverse
            size={30}
            className="text-white hover:text-gray-400 cursor-pointer"
            onClick={() => setSidebar(true)}
          />
        )}
      </div>

      <div className="flex-1 flex justify-center items-center  h-[93vh] flex-col">
        {press ? (
          <form onSubmit={handleSubmit} className="bg-gray-800 p-10 rounded-lg shadow-lg w-[700px]">
            <h2 className="text-2xl mb-6 font-semibold text-center">Add New Task</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Task Name"
              required
              className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 placeholder-gray-400"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 text-white"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description..."
              required
              className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 placeholder-gray-400 h-32"
            ></textarea>
            <label className="block mb-2 text-gray-300">Priority: {formData.priority || 3}</label>
            <input
              type="range"
              name="priority"
              min="1"
              max="5"
              step="1"
              value={formData.priority || 3}
              onChange={handleChange}
              className="w-full mb-4"
            />
            <button
            onClick={handleSubmit}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-semibold"
            >
              Submit Task
            </button>
          </form>
        ) : (
          <button
            onClick={handlePress}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-lg shadow-lg"
          >
            + Add New Task
          </button>
        )}
        
        {showLoginMsg && (
          <div className="mt-4 p-4 bg-red-500 text-white rounded shadow-lg ">
            Please login first to add a new task.
            <button
              onClick={() => setShowLoginMsg(false)}
              className="ml-4 underline cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default Lading