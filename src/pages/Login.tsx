import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShieldAlt,
    faLock,
    faChartLine,
    faUsers,
    faEnvelope,
    faEye,
    faEyeSlash,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const success = login(email, password);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Green */}
            <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-[#1a5c1a] to-[#2d7a2d] text-white p-8 flex-col justify-center items-center relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

                <div className="relative z-10 text-center max-w-md">
                    {/* Logo */}
                    <div className="mb-8 flex flex-col items-center">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4">
                            <FontAwesomeIcon
                                icon={faShieldAlt}
                                className="text-[#1a5c1a] text-xl"
                            />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">
                            Admin Portal
                        </h1>
                        <p className="text-white/80 text-base">
                            Secure access to your dashboard
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-5">
                        <div className="flex items-start gap-3 text-left">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FontAwesomeIcon
                                    icon={faLock}
                                    className="text-lg"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base mb-1">
                                    Enhanced Security
                                </h3>
                                <p className="text-white/70 text-sm">
                                    Multi-layer protection for your data
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-left">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FontAwesomeIcon
                                    icon={faChartLine}
                                    className="text-lg"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base mb-1">
                                    Real-time Analytics
                                </h3>
                                <p className="text-white/70 text-sm">
                                    Monitor your system performance
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-left">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FontAwesomeIcon
                                    icon={faUsers}
                                    className="text-lg"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base mb-1">
                                    User Management
                                </h3>
                                <p className="text-white/70 text-sm">
                                    Complete control over user access
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome Back
                            </h2>
                            <p className="text-gray-600">
                                Please sign in to your admin account
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <FontAwesomeIcon
                                        icon={faEnvelope}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="admin@company.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c1a] focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        id="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter your password"
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c1a] focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <FontAwesomeIcon
                                            icon={
                                                showPassword
                                                    ? faEyeSlash
                                                    : faEye
                                            }
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(e.target.checked)
                                        }
                                        className="w-4 h-4 text-[#1a5c1a] border-gray-300 rounded focus:ring-[#1a5c1a]"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Remember me
                                    </span>
                                </label>
                                <a
                                    href="#"
                                    className="text-sm text-[#1a5c1a] hover:underline">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-[#1a5c1a] text-white py-3 rounded-lg font-medium hover:bg-[#2d7a2d] transition-colors flex items-center justify-center gap-2">
                                Sign In
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </form>

                        {/* Secure Login Notice */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-3">
                                <FontAwesomeIcon
                                    icon={faShieldAlt}
                                    className="text-[#1a5c1a] mt-0.5"
                                />
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                        Secure Login
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                        Your connection is encrypted and secure.
                                        We never store your login credentials.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">Need help?</p>
                        <a
                            href="#"
                            className="text-sm text-[#1a5c1a] font-medium hover:underline">
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
