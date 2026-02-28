import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export function UserProfile() {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.address) setAddress(user.address);
    }, [user, navigate]);

    if (!user) return null;

    const handleUpdateProfile = (e: FormEvent) => {
        e.preventDefault();

        // Password validation
        if (password && password !== confirmPassword) {
            setMessage({ text: 'Passwords do not match.', type: 'error' });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        setTimeout(async () => {
            const updates: Partial<{ address: string; password?: string }> = { address };
            if (password.trim() !== '') {
                updates.password = password;
            }

            await updateProfile(updates);
            setPassword('');
            setConfirmPassword('');
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            setIsSaving(false);

            setTimeout(() => setMessage(null), 3000);
        }, 800);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-16">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
                <p className="text-slate-600 mt-1">Manage your account details and security</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
            >
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                        {user.role === 'admin' ? <ShieldCheck size={32} /> : <User size={32} />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                        <p className="text-slate-500">{user.email}</p>
                        <span className="inline-block mt-2 text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-full uppercase tracking-wider">
                            {user.role} Account
                        </span>
                    </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    {message && (
                        <div className={`p-4 rounded-xl text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Shipping Information</h3>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Address</label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your shipping address"
                                    rows={3}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Security</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">New Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Leave blank to keep unchanged"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your new password"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all min-w-[150px] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
