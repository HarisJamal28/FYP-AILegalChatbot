import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css"; // SCSS we'll define below

const Register = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [about, setAbout] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Added state for confirm password
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        // Check if the passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/signup', {
                firstname, lastname, email, about, password,
            });

            if (response.status === 200) {
                alert('Account created successfully');
                navigate('/login');
            }
        } catch (error) {
            if (error.response?.status === 400) {
                alert('User already exists');
            } else {
                alert('Account creation failed');
            }
        }
    };

    return (
        <div className="register-container">
            {/* Parent container */}
            <div className="form-container">
                {/* Title Section */}
                <h1 className="form-title">Sign up for an account</h1>

                {/* Form Section */}
                <div className="register-wrapper">
                    {/* Left side of the form */}
                    <div className="register-form left-side">
                        <form onSubmit={onSubmit}>
                            <label>First Name</label>
                            <input type="text" placeholder="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />

                            <label>Last Name</label>
                            <input type="text" placeholder="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} required />

                            <label>Password</label>
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </form>
                    </div>

                    {/* Right side of the form */}
                    <div className="register-form right-side">
                        <form onSubmit={onSubmit}>
                            <label>Email</label>
                            <input type="email" placeholder="123@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

                            <label>About</label>
                            <input type="text" placeholder="I am a worker" value={about} onChange={(e) => setAbout(e.target.value)} required />

                            <label>Confirm Password</label>
                            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </form>
                    </div>
                </div>

                {/* Bottom Section: Submit Button and Link */}
                <div className="bottom-section">
                    <button type="submit" className="submit-btn" onClick={onSubmit}>Sign Up</button>
                    <p className="switch-link">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
