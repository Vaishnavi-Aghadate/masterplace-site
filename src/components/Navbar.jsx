import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaTimes, FaSearch, FaHome, FaBuilding, FaInfoCircle, FaEnvelope, FaEye, FaEyeSlash, FaPlus } from 'react-icons/fa';

import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import logo from '../assets/logo.jpg';
import './Navbar.css';
import CreateListingPopup from './CreateListingPopup';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';



const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showCreateListingPopup, setShowCreateListingPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(null);

  const [loginForm, setLoginForm] = useState({ 
    username: '', 
    password: '', 
    remember: false 
  });
  const [loginErrors, setLoginErrors] = useState({});
  
  const [registerForm, setRegisterForm] = useState({
    firstName: '', 
    lastName: '', 
    username: '', 
    email: '', 
    phone: '', 
    password: '', 
    confirmPassword: '', 
    agreeTerms: false
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [scrolled, setScrolled] = useState(false);

  // Check for logged in user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (storedUser) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(storedUser));
      
      if (rememberMe) {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const user = storedUsers.find(u => u.username === JSON.parse(storedUser).username);
        if (user) {
          setLoginForm({
            username: user.username,
            password: '',
            remember: true
          });
        }
      }
    }
  }, []);

  // Stronger validation functions
  const validateLogin = () => {
    const errors = {};
    const usernameOrEmail = loginForm.username.trim();
    
    if (!usernameOrEmail) {
      errors.username = 'Username or email is required';
    } else if (!/^[a-zA-Z0-9_@.]+$/.test(usernameOrEmail)) {
      errors.username = 'Invalid characters in username/email';
    }

    if (!loginForm.password) {
      errors.password = 'Password is required';
    } else if (loginForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(loginForm.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(loginForm.password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(loginForm.password)) {
      errors.password = 'Password must contain at least one number';
    } else if (!/[^A-Za-z0-9]/.test(loginForm.password)) {
      errors.password = 'Password must contain at least one special character';
    }

    return errors;
  };

  const validateRegister = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{3,6}$/im;
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    // First Name validation
    if (!registerForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (registerForm.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    } else if (!/^[a-zA-Z]+$/.test(registerForm.firstName)) {
      errors.firstName = 'First name can only contain letters';
    }

    // Last Name validation 
    if (!registerForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (registerForm.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    } else if (!/^[a-zA-Z]+$/.test(registerForm.lastName)) {
      errors.lastName = 'Last name can only contain letters';
    }

    // Username validation
    if (!registerForm.username.trim()) {
      errors.username = 'Username is required';
    } else if (registerForm.username.length < 4) {
      errors.username = 'Username must be at least 4 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(registerForm.username)) {
      errors.username = 'Username can only contain letters, numbers and underscores';
    } else if (registerForm.username.length > 20) {
      errors.username = 'Username cannot exceed 20 characters';
    } else if (storedUsers.some(user => user.username === registerForm.username)) {
      errors.username = 'Username already taken';
    }

    // Email validation
    if (!registerForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(registerForm.email)) {
      errors.email = 'Please enter a valid email address';
    } else if (storedUsers.some(user => user.email === registerForm.email)) {
      errors.email = 'Email already registered';
    }

    // Phone validation (optional)
    if (registerForm.phone && !phoneRegex.test(registerForm.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!registerForm.password) {
      errors.password = 'Password is required';
    } else if (registerForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(registerForm.password)) {
      errors.password = 'Must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(registerForm.password)) {
      errors.password = 'Must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(registerForm.password)) {
      errors.password = 'Must contain at least one number';
    } else if (!/[^A-Za-z0-9]/.test(registerForm.password)) {
      errors.password = 'Must contain at least one special character';
    }

    // Confirm Password validation
    if (!registerForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!registerForm.agreeTerms) {
      errors.agreeTerms = 'You must agree to the terms and conditions';
    }

    return errors;
  };

  const toggleMenu = () => setIsMobile(!isMobile);
  const toggleAuthPopup = () => {
    setShowAuthPopup(!showAuthPopup);
    setLoginErrors({});
    setRegisterErrors({});
  };

  const handleLoginClick = () => {
    setActiveTab('login');
    setShowAuthPopup(true);
  };

  const handleRegisterClick = () => {
    setActiveTab('register');
    setShowAuthPopup(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setShowAuthPopup(false);
  };

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (loginErrors[name]) {
      setLoginErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (registerErrors[name]) {
      setRegisterErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errors = validateLogin();
    setLoginErrors(errors);
  
    if (Object.keys(errors).length === 0) {
      try {
        // Send login request to backend
        const response = await axios.post('http://localhost:5000/api/auth/login', loginForm);
        const { token, user } = response.data;
  
        // Store token and user data in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
  
        // If "Remember me" is checked
        if (loginForm.remember) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }
  
        // Update UI state
        setIsLoggedIn(true);
        setCurrentUser(user);
        setShowAuthPopup(false);
        setLoginForm({ username: '', password: '', remember: false });
  
        console.log('Login successful:', user);
      } catch (error) {
        setLoginErrors({
          general: error.response?.data?.message || 'Login failed. Please try again.'
        });
      }
    }
  };
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
  
    // Step 1: Validate
    const errors = validateRegister();
    setRegisterErrors(errors);
  
    if (Object.keys(errors).length === 0) {
      try {
        const newUser = {
          firstName: registerForm.firstName,
          lastName: registerForm.lastName,
          username: registerForm.username,
          email: registerForm.email,
          phone: registerForm.phone,
          password: registerForm.password,
          savedProperties: []
        };
  
        // Step 2: Send to backend
        const response = await axios.post('http://localhost:5000/api/auth/register', newUser, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        console.log('Registration successful:', response.data);
  
        // Step 3: Save to local storage
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        storedUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(storedUsers));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
  
        // Step 4: Update UI
        setIsLoggedIn(true);
        setCurrentUser(newUser);
        setShowAuthPopup(false);
  
        // Step 5: Reset form
        setRegisterForm({
          firstName: '', 
          lastName: '', 
          username: '', 
          email: '', 
          phone: '', 
          password: '', 
          confirmPassword: '', 
          agreeTerms: false
        });
      } catch (error) {
        console.error('Error during registration:', error.response?.data?.message || error.message);
        setRegisterErrors({
          general: error.response?.data?.message || 'Registration failed. Please try again.'
        });
      }
    }
  };
  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMobile(false);
    };

    const handleClickOutside = (e) => {
      if (isMobile && !e.target.closest('.navbar__links') && !e.target.closest('.navbar__toggle')) {
        setIsMobile(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{ height: '80px' }}>
      <div className="navbar__container">
        <div className="navbar__logo">
          <Link to='/' onClick={() => setIsMobile(false)}>
            <img src={logo} alt="MasterPlace Logo" />
            <span>MasterPlace</span>
          </Link>
        </div>

        <div className={`navbar__links ${isMobile ? 'mobile' : ''}`}>
          <ul>
            <li>
              <Link to='/' onClick={() => setIsMobile(false)}>
                <FaHome className="nav-icon" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/homeslist" onClick={() => setIsMobile(false)}>
                <FaBuilding className="nav-icon" />
                <span>Properties</span>
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsMobile(false)}>
                <FaInfoCircle className="nav-icon" />
                <span>About</span>
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setIsMobile(false)}>
                <FaEnvelope className="nav-icon" />
                <span>Contact</span>
              </Link>
            </li>
            {/* Create Listing button visible to all users */}
            <li>
              <button 
                className="create-listing-btn"
                onClick={() => setShowCreateListingPopup(true)}
              >
                <FaPlus /> Create Listing
              </button>
            </li>
            <li className="navbar__auth-buttons">
              {isLoggedIn && (
                <Link to="/adminpanel" className="admin-btn">
                  <i className="fas fa-user-shield">Admin</i> 
                </Link>
              )}
              {isLoggedIn ? (
                <div className="profile-dropdown">
                  <button className="profile-btn">
                    <FaUserCircle size={24} />
                    <span>My Account</span>
                  </button>
                  <div className="dropdown-content">
                    <Link to="/profile">Profile</Link>
                    <Link to="/SavedProperties">Saved Properties</Link> 
                    <button onClick={() => {
                      handleLogout();
                      window.location.href = '/';
                    }}>Logout</button>
                  </div>
                </div>
              ) : (
                <button className="auth-btn" onClick={toggleAuthPopup}>
                  <FaUserCircle size={24} />
                  <span>Sign In</span>
                </button>
              )}
            </li>
          </ul>
        </div>

        <div className={`navbar__toggle ${isMobile ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="navbar__toggle-line"></span>
          <span className="navbar__toggle-line"></span>
          <span className="navbar__toggle-line"></span>
        </div>
      </div>

      {showAuthPopup && (
        <div className="auth-popup">
          <div className="auth-popup-overlay" onClick={toggleAuthPopup}></div>
          <div className="auth-popup-content">
            <button className="close-popup" onClick={toggleAuthPopup}>
              <FaTimes />
            </button>
            
            <div className="auth-header">
              <h3>{activeTab === 'login' ? 'Welcome Back' : 'Create Account'}</h3>
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => setActiveTab('login')}
                >
                  Sign In
                </button>
                <button
                  className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => setActiveTab('register')}
                >
                  Register
                </button>
              </div>
            </div>

           
      {showCreateListingPopup && (
        <CreateListingPopup 
          onClose={() => setShowCreateListingPopup(false)}
          currentUser={currentUser}
          isLoggedIn={isLoggedIn}
          onLoginRequired={() => {
            setShowCreateListingPopup(false);
            setShowAuthPopup(true);
            setActiveTab('login');
          }}
        />
      )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="auth-form" noValidate>
                {loginErrors.general && (
                  <div className="form-error general-error">{loginErrors.general}</div>
                )}
                <div className="input-group">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username or Email"
                    value={loginForm.username}
                    onChange={handleLoginChange}
                    className={loginErrors.username ? 'error' : ''}
                  />
                </div>
                {loginErrors.username && <span className="error-message">{loginErrors.username}</span>}

                <div className="input-group">
                  <FiLock className="input-icon" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className={loginErrors.password ? 'error' : ''}
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {loginErrors.password && <span className="error-message">{loginErrors.password}</span>}

                <div className="auth-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={loginForm.remember}
                      onChange={handleLoginChange}
                    />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-password" onClick={toggleAuthPopup}>
                    Forgot password?
                  </Link>
                </div>
                <button type="submit" className="auth-submit-btn">
                  Sign In
                </button>
                
                <div className="auth-divider">
                  <span>or</span>
                </div>
                <div className="social-auth">
                  <button 
                    type="button" 
                    className="social-btn google"
                    onClick={() => window.location.href = "https://accounts.google.com/"}
                  >
                    <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" />
                    Continue with Google
                  </button>
                  <button 
                    type="button" 
                    className="social-btn facebook"
                    onClick={() => window.location.href = "https://www.facebook.com/login/"}
                  >
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
                    Continue with Facebook
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="auth-form signup-form" noValidate>
                {registerErrors.general && (
                  <div className="form-error general-error">{registerErrors.general}</div>
                )}
                <div className="name-fields">
                  <div className="input-group">
                    <FiUser className="input-icon" />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={registerForm.firstName}
                      onChange={handleRegisterChange}
                      className={registerErrors.firstName ? 'error' : ''}
                    />
                  </div>
                  {registerErrors.firstName && <span className="error-message">{registerErrors.firstName}</span>}

                  <div className="input-group">
                    <FiUser className="input-icon" />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={registerForm.lastName}
                      onChange={handleRegisterChange}
                      className={registerErrors.lastName ? 'error' : ''}
                    />
                  </div>
                  {registerErrors.lastName && <span className="error-message">{registerErrors.lastName}</span>}
                </div>

                <div className="input-group">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={registerForm.username}
                    onChange={handleRegisterChange}
                    className={registerErrors.username ? 'error' : ''}
                  />
                </div>
                {registerErrors.username && <span className="error-message">{registerErrors.username}</span>}

                <div className="input-group">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    className={registerErrors.email ? 'error' : ''}
                  />
                </div>
                {registerErrors.email && <span className="error-message">{registerErrors.email}</span>}

                <div className="input-group">
                  <FiPhone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (optional)"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    className={registerErrors.phone ? 'error' : ''}
                  />
                </div>
                {registerErrors.phone && <span className="error-message">{registerErrors.phone}</span>}

                <div className="input-group">
                  <FiLock className="input-icon" />
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    className={registerErrors.password ? 'error' : ''}
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {registerErrors.password && <span className="error-message">{registerErrors.password}</span>}

                <div className="input-group">
                  <FiLock className="input-icon" />
                  <input
                    type={showRegisterConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                    className={registerErrors.confirmPassword ? 'error' : ''}
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                  >
                    {showRegisterConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {registerErrors.confirmPassword && <span className="error-message">{registerErrors.confirmPassword}</span>}

                <div className="terms-agreement">
                  <label className={registerErrors.agreeTerms ? 'error' : ''}>
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={registerForm.agreeTerms}
                      onChange={handleRegisterChange}
                    />
                    <span>I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a></span>
                  </label>
                  {registerErrors.agreeTerms && <span className="error-message">{registerErrors.agreeTerms}</span>}
                </div>

                <button type="submit" className="auth-submit-btn">
                  Register
                </button>
                <div className="auth-footer">
                  Already have an account? <button type="button" onClick={() => setActiveTab('login')}>Sign In</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {showCreateListingPopup && (
        <CreateListingPopup 
          onClose={() => setShowCreateListingPopup(false)}
          currentUser={currentUser}
        />
      )}
    </nav>
  );
};

export default Navbar;