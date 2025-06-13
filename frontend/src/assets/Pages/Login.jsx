import { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { useContext } from 'react';
import {useGoogleLogin} from '@react-oauth/google'
import { googleAuth } from '../../api';


function Login() {


    const {setUser} = useContext(UserContext)
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [token,settoken] = useState("");

    const toggleShowPassword = () => setShowPassword(prev => !prev);

    const handleLogin = async (e) => {
        e.preventDefault();
      
        setError('');
        setSuccess('');
      
        const payload = {
          username: username, 
          password: password,
        };
      
        try {
          const response = await fetch("http://localhost:4001/todo/loginginuser", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
          }
      
          const data = await response.json();


          console.log("The dat is: ",data.user);
      
          if (data.success) {
            setSuccess("Login successful!");
            localStorage.setItem('token',data.token);
            localStorage.setItem('user',JSON.stringify(data.user))
            setUser(data.user.name)
            setError('');
            navigate('/')

          } else {
            setError(data.message || "Invalid credentials.");
            setSuccess('');
          }
      
          setUsername('');
          setPassword('');
        } catch (err) {
          console.error(err);
          setError(err.message);
          setSuccess('');
        }
      };


      const handlegoogle = async (authResult) => {
        try {
            if (authResult?.code) {
                const result = await googleAuth(authResult.code);
                const { email, name, picture } = result.data.user;
    
                const obj = {
                    email,
                    name,
                    image: picture,
                    token: result.data.token,
                };
    
                settoken(obj);
                localStorage.setItem('user-info', JSON.stringify(obj));
                localStorage.setItem('token', result.data.token);
                setUser(name);
                navigate('/');
            }
        } catch (error) {
            console.error("Google login failed:", error);
            setError("Failed to login with Google");
        }
    };
    
      const googlelogin = useGoogleLogin({
        onSuccess: handlegoogle,
        onError: handlegoogle,
        flow:'auth-code'
      })

      
    return (
        <div className="flex h-screen">
            <div className="w-1/2 flex items-center justify-center p-8 border-r-2 border-gray-300">
                <h1 className="text-lg font-semibold text-center text-gray-700 leading-relaxed">
                    Welcome Back! <br />
                    This section can contain a brief message about the app, benefits of logging in,
                    or anything motivational you'd like to add. 
                </h1>
            </div>

            <div className="w-1/2 flex items-center justify-center bg-gray-50">
                <form className="flex flex-col gap-5 w-[80%] max-w-md bg-white p-6 rounded-lg shadow-md" onSubmit={handleLogin}>
                    <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                    {error && <p className="text-red-600 text-center">{error}</p>}
                    {success && <p className="text-green-600 text-center">{success}</p>}

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <span
                            onClick={toggleShowPassword}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className="bg-red-600 text-white py-2 rounded hover:bg-red-500 transition duration-300"
                        onClick={googlelogin}
                    >
                        Continue With Google
                    </button>

                    <p><Link to='/signup' className='hover:text-blue-600'>Have not any Account?  Sign up Here!</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Login;
