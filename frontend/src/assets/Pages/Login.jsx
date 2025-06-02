import { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const toggleShowPassword = () => setShowPassword(prev => !prev);

    const handleLogin = async (e) => {
        e.preventDefault();
    
        setError('');
        setSuccess('');
    
        const payload = {
            username,
            password
        };
    
        try {
            const response = await fetch("http://localhost:4001/todo/loginginuser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }
    
            const data = await response.json();
    
            if (data && data.length > 0) {
                setSuccess("Login successful!");
            } else {
                setError("Invalid credentials.");
            }
    
            setUsername('');
            setPassword('');
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };
    

    return (
        <div className="flex h-screen">
            {/* Left Section */}
            <div className="w-1/2 flex items-center justify-center p-8 border-r-2 border-gray-300">
                <h1 className="text-lg font-semibold text-center text-gray-700 leading-relaxed">
                    Welcome Back! <br />
                    This section can contain a brief message about the app, benefits of logging in,
                    or anything motivational you'd like to add. 
                </h1>
            </div>

            {/* Right Section */}
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
                    >
                        Continue With Google
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
