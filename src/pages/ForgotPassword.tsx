import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Key } from 'lucide-react';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        // Simulate API call for sending recovery email
        setTimeout(() => {
            setIsSending(false);
            setIsSubmitted(true);
        }, 1000);
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center pt-8 pb-16">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center">
                        <Key className="text-orange-500" size={32} />
                    </div>
                </div>

                {isSubmitted ? (
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">Check Your Email</h2>
                        <p className="text-slate-600 text-sm">
                            If an account with <strong>{email}</strong> exists, we've sent instructions on how to reset your password.
                        </p>
                        <div className="pt-4">
                            <Link
                                to="/login"
                                className="w-full inline-block bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                            >
                                Return to Log In
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Forgot Password</h2>
                        <p className="text-center text-slate-500 text-sm mb-6">Enter your email address to receive a password reset link.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors mt-4 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSending ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                                Back to Log In
                            </Link>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
