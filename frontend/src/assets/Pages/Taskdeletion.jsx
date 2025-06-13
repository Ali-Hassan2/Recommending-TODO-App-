import {useState,useEffect} from 'react'
import Navbar from '../../Components/Navbar'
import {Link} from 'react-router-dom'
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs';
import { jwtDecode } from 'jwt-decode';
import { button } from 'framer-motion/client';

function Taskdeletion() {


    const [sidebar, setSidebar] = useState(false);
    const [userid, setuserid] = useState(0);
    const [list, setlist] = useState([]);
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState('');
    const [click,setclick] = useState(false);
    const [ttask,setttask] = useState({
        id:null,
        title:'',
        date:'',
        description:'',
        priority:0
    })

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
                console.log("The result is: ", result)

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

    const handleinputchange = (task)=>{
        setclick(true)
        setttask({
            id:task.Id || null,
            title:task.title|| '',
            date: task.date || '',
            description:task.description || '',
            priority: task.priority || 0
        })
    }

    function printingvalues (){
        console.log("id is: ",ttask.id);
        console.log("title is: ",ttask.title);
        console.log("date is: ",ttask.date);
        console.log("description is: ",ttask.description);
        console.log("priority is: ",ttask.priority);
        console.log("The user id is:",userid)
    }


    printingvalues();

    const handledelete = async () => {
        try {
            const payload={
                userid:userid
            }
            const controller = new AbortController();
            const signal = controller.signal;
            const baseURL = `http://localhost:4001/todo/deletetask/${ttask.id}`;
    
            const response = await fetch(baseURL, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(payload),
                signal
            });
    
            if (!response.ok) {
                const error_data = await response.json();
                throw new Error(error_data.message || "There is an error");
            }
    
            const data = await response.json();
            if (data.success) {
                console.log("The task deleted successfully");
                seterror('');
                setlist(prev => prev.filter(task => task.Id !== ttask.id)); 
                setclick(false);
                setttask({ id: null, title: '', date: '', description: '', priority: 0 });
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.log("There is an error while making the fetch call");
                seterror(`Oops! ${error.message}` || "There is an error while making the fetch call.");
            }
        }
    };
    
    return (
        <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
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
                    <Link to="/taskdeletion" className="hover:bg-gray-800 p-2 rounded">Delete Task</Link>
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
                                    className="bg-gray-900 text-white p-6 rounded-xl shadow  hover:border-2 border-amber-500 cursor-pointer"
                                onClick={()=> handleinputchange(task)}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <p><span className="text-gray-400 font-semibold">Name:</span> {task.title}</p>
                                        <p><span className="text-gray-400 font-semibold">Due:</span> {new Date(task.date).toLocaleDateString()}</p>
                                        <p><span className="text-gray-400 font-semibold">Priority:</span> {task.priority}</p>
                                    </div>
                                    <div className="mt-3">
                                        <p><span className="text-gray-400 font-semibold">Description:</span> {task.description}</p>
                                    </div>
                                </div>
                            ))}
                            {click ? (  
                                <button onClick={handledelete} className='bg-red-700 cursor-pointer'>Delete {ttask.title}</button>
                            ):(
                                <div className='text-center text-red-600'>
                                    Please select a task to delete
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Taskdeletion
