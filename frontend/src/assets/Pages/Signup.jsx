import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rpassword, setRPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showpasswod, setshowpassword] = useState(false);

    const passwordMatch = password === rpassword;

    const controller = new AbortController();
    const signal = controller.signal;

    const createUser = async (e) => {
        e.preventDefault();

        if (!passwordMatch) {
            setError('Passwords do not match');
            return;
        }

        const payload = { name, username, password };
        const url = `http://localhost:4001/todo/creatinguser`;

        setError('');
        setSuccess('');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(payload),
                signal
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create user.");
            }

            setSuccess(data.message || "Account successfully created!");
            setName('');
            setUsername('');
            setPassword('');
            setRPassword('');
        } catch (err) {
            console.error("Error during fetch:", err);
            setError(err.message);
        }
    };


    const gotologin = () => {

        navigate('/login')
    }

    const checkpassword = () => {
        setshowpassword(!showpasswod);
    }

    return (
        <div className='w-full h-[100vh] flex justify-center items-center border-3 border-red-600'>

            <div className="left w-[50%] h-full border-2 border-black flex justify-center items-center p-4">
                <h1 className="text-xl font-semibold">
                    This is all about this app why we're building it, and how it can help.
                    Don't worry, bro. I'm always here to assist. Keep us in your duas
                </h1>
            </div>

            <div className="right w-[50%] h-full border-2 border-black flex justify-center items-center">
                <form onSubmit={createUser} className='flex flex-col gap-6 p-4 border rounded'>

                    {error && <p className="text-red-600">{error}</p>}
                    {success && <p className="text-green-600">{success}</p>}

                    <input type="text" placeholder='Your Name' value={name} onChange={(e) => setName(e.target.value)} required className="border p-2" />
                    <input type="text" placeholder='Your Username' value={username} onChange={(e) => setUsername(e.target.value)} required className="border p-2" />
                    <div className='relative w-full flex items-center border px-2 py-1'>
                        <input
                            type={showpasswod ? "text" : "password"}
                            placeholder='Your Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full py-2 pl-1 pr-8 outline-none"
                        />
                        <span className="absolute right-2 cursor-pointer" onClick={checkpassword}>
                            {showpasswod ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <input
                        type="password"
                        placeholder='Re-type Password'
                        value={rpassword}
                        onChange={(e) => setRPassword(e.target.value)}
                        required
                        className="border p-2"

                    />

                    {rpassword.length > 0 && (
                        <p className={`${password === rpassword ? 'text-green-600' : 'text-red-600'}`}>
                            {password === rpassword ? 'Passwords match' : 'Passwords do not match'}
                        </p>
                    )}

                    <button type='submit' className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={!passwordMatch}>
                        Create Account
                    </button>

                    {success && (
                        <button className="bg-blue-700 px-4 py-2 rounded text-center text-white cursor-pointer" onClick={gotologin}>
                            Login
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Signup;
