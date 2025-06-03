import React, { useEffect, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import { BsLayoutSidebarInsetReverse } from "react-icons/bs";
import { Link } from 'react-router-dom';

import { useContext } from 'react';

function Lading() {

  const {user} = useContext(UserContext);
  const [press, setPress] = useState(false);
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  const [sidebar,setsidebar] = useState(false);
  

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    priority: '',
  });

  const handlePress = () => {
    if(!user){
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
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Task Data:', formData);
    setFormData({ name: '', description: '', date: '', priority: '' });
    setPress(false);
  };


  useEffect(()=>{
    if(!user){
      setPress(false);
    }
  },[user]);

  const handlesidebar = () =>{


    setsidebar(!sidebar);

  }


  return (
    <div className="h-[95vh] w-full flex items-center justify-between relative  border-8 border-red-700 overflow-y-hidden ">


<div className="header w-full h-[10%] bg-purple-900 flex justify-end items-center px-4 text-white">
    <BsLayoutSidebarInsetReverse size={40} className="cursor-pointer" onClick={handlesidebar} />
  </div>
<div
  className={`fixed top-0 left-0 h-[100vh] w-[22%] z-10 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
    sidebar ? 'translate-x-0' : '-translate-x-full'
  }`}
>
  <div className="header w-full h-[10%] bg-purple-900 flex justify-end items-center px-4 text-white">
    <BsLayoutSidebarInsetReverse size={40} className="cursor-pointer" onClick={handlesidebar} />
  </div>
  <div className="main h-[80%] bg-purple-950 py-[50px]">
    <div className="text-xl hover:bg-purple-900 p-6 text-center text-white">
      <Link to="/">Adding a Task</Link>
    </div>
    <div className="text-xl hover:bg-purple-900 p-6 text-center text-white">
      <Link to="/tasklist">Task list</Link>
    </div>
    <div className="text-xl hover:bg-purple-900 p-6 text-center text-white">
      <Link to="/taskupdation">Update a Task</Link>
    </div>
    <div className="text-xl hover:bg-purple-900 p-6 text-center text-white">
      <Link to="/taskdeletion">Delete a Task</Link>
    </div>
    <div className="text-xl hover:bg-purple-900 p-6 text-center text-white">
      <Link to="/taskrecomendation">Check Recommendation</Link>
    </div>
  </div>
</div>



      <div className="rounded shadow-md w-[100%] border-3 border-blue-500 h-[95vh] flex justify-center items-center">
        {press ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name of Task"
              required
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description..."
              className="border px-3 py-2 rounded"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded"
            />
            <input
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              placeholder="Priority"
              className="border px-3 py-2 rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Submit Task
            </button>
          </form>
        ) : (
          <button
            onClick={handlePress}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add a New Task
          </button>
        )}

        {showLoginMsg && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
            Please login first to add a new task.
            <button
              onClick={() => setShowLoginMsg(false)}
              className="ml-4 bg-red-700 text-white px-2 py-1 rounded"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Lading;
