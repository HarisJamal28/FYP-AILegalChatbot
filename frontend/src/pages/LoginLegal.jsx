import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import SCSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://127.0.0.1:8000/login',
            { email, password },
        ).then((response) => {
            console.log(response);
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            if (response.status === 200) {
                navigate('/chatbot');
                alert('Login successful');
                window.location.reload();
            }
        }).catch((error) => {
            console.log(error);
            if (error.response.status === 401) {
                alert('Invalid email or password');
            } else if (error.response.status === 404) {
                alert('User not found');
            } else {
                alert('Error occurred. Please try again later');
            }
        });
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-image">
                    {/* <img src="https://www.sbtpartners.com/wp-content/uploads/2023/11/Infrastructure-Management-Illustration.g" alt="login visual" /> */}
                </div>
                <div className="login-form">
                    <h2>Sign In to Your Account</h2>
                    <form onSubmit={onSubmit}>
                        <label>Email</label>
                        <input
                            type="text"
                            placeholder="123@ex.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button type="submit">Sign In</button>
                    </form>
                    <p className="register-link">
                        Don't have an account? <Link to="/register">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
