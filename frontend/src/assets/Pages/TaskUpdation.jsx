import {useState,useEffect} from 'react'
import Navbar from '../../Components/Navbar'
import { jwtDecode } from 'jwt-decode';
import {Link} from 'react-router-dom';
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs';
import { div } from 'framer-motion/client';


const TaskUpdation = () => {


   const [sidebar, setSidebar] = useState(false);
   const [userid, setuserid] = useState(0);
   const [list, setlist] = useState([]);
   const [loading, setloading] = useState(false);
   const [error, seterror] = useState('');

   const [title,settitle] = useState('');
   const [description,setdescription] = useState('');
   const [date,setdate] = useState('');
   const [priority,setpriority] = useState(0);
   const [click,setclick] = useState(false);
   const [taskid,settaskid] = useState(0);


   const handleclick = () => {

    setclick(!click);
   }



 
   useEffect(() => {
     const token = localStorage.getItem('token');
     if (token) {
       try {
         const decoding = jwtDecode(token);
         console.log("The user id is: ", decoding.id);
         setuserid(decoding.id);
       } catch (error) {
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
 
         const url = `http://localhost:4001/todo/gettask/${userid}`;
         const response = await fetch(url, { signal: controller.signal });
         const result = await response.json();
         console.log("The result is: ",result)
 
         if (!response.ok) {
           throw new Error(result.message || "Error while fetching tasks.");
         }
 
         const { success, data } = result;
 
         if (!success || !Array.isArray(data) || !data.length) {
           seterror("No tasks found.");
           setlist([]);
         } else {
           setlist(data);
           seterror('');
         }
       } catch (error) {
         if (error.name !== 'AbortError') {
           seterror(`Oops! ${error.message}` || "Error while fetching tasks.");
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

   const getdata = (task)=>{
    console.log("The task of the list is:",task);

    settitle(task.title);
    setdescription(task.description);
    setdate(task.date);
    setpriority(task.priority);
    settaskid(task.Id)
    
   }




   const updatetask = async () => {
    const controller = new AbortController();
    const signal = controller.signal;
  
    try {
      const payload = {
        title,
        date,
        description,
        priority,
        userid
      };

      console.log("The task iddddddddd is: ",taskid)
  
      const baseURL = `http://localhost:4001/todo/updatetask/${taskid}`;
  
      const response = await fetch(baseURL, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Error while updating the task");
      }
  
      if (result.success) {
        console.log("The data is updated successfully");
        seterror('');
      } else {
        seterror("There is nothing to update");
      }
  
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Serious error:", error);
        seterror(`Oops, error occurred: ${error.message}`);
      }
    }
  };
  

   function checkvalues (){

    console.log("title",title);
    console.log("The description is:",description);
    console.log("Date:",date);
    console.log("The priority:",priority)
    console.log("The task iddddddddd is: ",taskid)
   }

   checkvalues()
   
 


  return (

    <div>
<div className={`w-full ${click ? "h-fit" : "h-screen"} bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white`}>
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

      <div className="px-6 pt-24 pb-10">
        {loading ? (
          <p className="text-gray-300 text-xl">Loading tasks...</p>
        ) : error ? (
          <p className="text-red-400 text-xl">{error}</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
              {list.map((task, index) => (
                <div
                  key={task._id || index}
                  className="bg-gray-900 text-white p-6 rounded-xl shadow  hover:border-1 border-amber-500 cursor-pointer" onClick={()=> getdata(task)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                    <p><span className="text-gray-400 font-semibold">Name:</span> {task.title}</p>
                    <p><span className="text-gray-400 font-semibold">Due:</span> {new Date(task.date).toLocaleDateString()}</p>
                    <p><span className="text-gray-400 font-semibold">Priority:</span> {task.priority}</p>
                  </div>
                  <div className="mt-3">
                    <p><span className="text-gray-400 font-semibold">Description:</span> {task.description}</p>
                  </div>
                </div>
              ))}

              {title.length > 0 ? (
                  <button className='bg-amber-500' onClick={handleclick}>Update {title}</button>
                  
        ):(
            <div className='relative -top-2 text-center text-red-600'>
              Please select a task first to update
            </div>
        )}

              {click && (
                <div className='flex items-center justify-center'>
                <form onSubmit={updatetask} className="bg-gray-800 p-10 rounded-lg shadow-lg w-[700px]">
                <h2 className="text-2xl mb-6 font-semibold text-center">Add New Task</h2>
                <input
                  type="text"
                  name="name"
                  value={title}
                  onChange={(e)=> settitle(e.target.value)}
                  placeholder="Task Name"
                  required
                  className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 placeholder-gray-400"
                />
                <input
                  type="date"
                  name="date"
                  value={date}
                  onChange={(e)=> setdate(e.target.value)}
                  required
                  className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 text-white"
                />
                <textarea
                  name="description"
                  value={description}
                  onChange={(e)=> setdescription(e.target.value)}
                  placeholder="Description..."
                  required
                  className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 placeholder-gray-400 h-32"
                ></textarea>
                <label className="block mb-2 text-gray-300">Priority: {priority || 3}</label>
                <input
                  type="range"
                  name="priority"
                  min="1"
                  max="5"
                  step="1"
                  value={priority}
                  onChange={(e)=> setpriority(e.target.value)}
                  className="w-full mb-4"
                />
                <button
                onClick={updatetask}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-semibold"
                >
                  Update
                </button>
              </form>
              </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

        
    </div>
  )
}

export default TaskUpdation
