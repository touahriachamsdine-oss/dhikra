"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Camera, ArrowLeft, Loader2, Save, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        fetch('/api/user')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.user) {
                    setUser(data.user);
                    setName(data.user.name || "");
                    setImage(data.user.image || "");
                } else {
                    router.push('/login');
                }
            })
            .catch(() => router.push('/login'))
            .finally(() => setLoading(false));
    }, [router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setMessage(null);

        try {
            const res = await fetch('/api/user', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, image }),
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Erreur lors de la mise à jour.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setUpdating(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
            return;
        }

        setUpdating(true);
        setMessage(null);

        try {
            const res = await fetch('/api/user', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Mot de passe modifié avec succès.' });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setMessage({ type: 'error', text: data.error || 'Erreur lors du changement de mot de passe.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau.' });
        } finally {
            setUpdating(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans pb-20">
            <div className="bg-primary-600 h-64 w-full absolute top-0 -z-10 rounded-b-[3rem]"></div>

            <div className="max-w-4xl mx-auto px-4 pt-12">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-bold"
                    >
                        <ArrowLeft className="w-5 h-5" /> Retour
                    </button>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md transition-all font-bold flex items-center gap-2 border border-white/10"
                        >
                            <LogOut className="w-4 h-4" /> Déconnexion
                        </button>
                    </div>
                </div>

                <h1 className="text-4xl font-black text-white mb-12">Paramètres du compte</h1>

                {message && (
                    <div className={`mb-8 p-4 rounded-2xl border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'} animate-in fade-in slide-in-from-top-4 duration-300`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl border border-gray-100 dark:border-slate-800 text-center">
                            <div className="relative w-32 h-32 mx-auto mb-6 group">
                                <img
                                    src={image || "https://i.pravatar.cc/300?u=" + user?.email}
                                    alt="PVP"
                                    className="w-full h-full rounded-full border-4 border-primary-50 object-cover shadow-inner"
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">{user?.name || user?.email}</h3>
                            <p className="text-sm text-gray-500 mb-6">{user?.email}</p>
                            <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest inline-block">
                                {user?.role}
                            </div>
                        </div>
                    </div>

                    {/* Forms */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Profile Form */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                                    <User className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Informations personnelles</h2>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nom complet</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full border-2 border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-4 focus:border-primary-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">URL de la photo de profil</label>
                                    <input
                                        type="text"
                                        value={image}
                                        onChange={e => setImage(e.target.value)}
                                        placeholder="https://example.com/avatar.jpg"
                                        className="w-full border-2 border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-4 focus:border-primary-500 outline-none transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full bg-primary-600 text-white p-4 rounded-2xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
                                >
                                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Enregistrer les modifications
                                </button>
                            </form>
                        </div>

                        {/* Password Form */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Changer le mot de passe</h2>
                            </div>

                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mot de passe actuel</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={e => setCurrentPassword(e.target.value)}
                                        required
                                        className="w-full border-2 border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-4 focus:border-amber-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nouveau mot de passe</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            required
                                            className="w-full border-2 border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-4 focus:border-amber-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirmer</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full border-2 border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-4 focus:border-amber-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 dark:shadow-none"
                                >
                                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                                    Mettre à jour le mot de passe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
