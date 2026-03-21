"use client";

import { useRouter } from "next/navigation";
import { Scale, LogOut, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function HuissierDashboard() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push("/login");
    };

    const requests = [
        { id: "REQ-2023-001", client: "Dhiya Eddine", type: "Formal Notice", status: "Pending", date: "Oct 25, 2023" },
        { id: "REQ-2023-002", client: "Amine Meziani", type: "Summons", status: "In Progress", date: "Oct 24, 2023" },
        { id: "REQ-2023-003", client: "SARL Example", type: "Seizure", status: "Completed", date: "Oct 20, 2023" },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Pending": return <Clock className="w-5 h-5 text-amber-500" />;
            case "In Progress": return <AlertCircle className="w-5 h-5 text-blue-500" />;
            case "Completed": return <CheckCircle className="w-5 h-5 text-green-500" />;
            default: return <FileText className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white border-b border-gray-200 py-4 px-6 sm:px-12 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Scale className="w-8 h-8 text-secondary-500" />
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-primary-500">
                            Settle<span className="text-secondary-500">Up</span>.dz
                        </h1>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bailiff Portal</p>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                </button>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full py-12 px-6 sm:px-12">
                <div className="mb-10">
                    <h2 className="text-3xl font-extrabold text-primary-900">Welcome, Maître</h2>
                    <p className="text-gray-600 mt-2">Here is your daily overview of case requests and ongoing procedures.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-4 bg-amber-50 rounded-2xl text-amber-600"><Clock className="w-8 h-8" /></div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending</p>
                            <p className="text-3xl font-black text-gray-900">12</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-4 bg-blue-50 rounded-2xl text-blue-600"><AlertCircle className="w-8 h-8" /></div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">In Progress</p>
                            <p className="text-3xl font-black text-gray-900">5</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-4 bg-green-50 rounded-2xl text-green-600"><CheckCircle className="w-8 h-8" /></div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Completed</p>
                            <p className="text-3xl font-black text-gray-900">48</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h3 className="text-xl font-bold text-gray-900">Recent Requests</h3>
                        <button className="text-sm font-semibold text-primary-600 hover:text-primary-800">View All</button>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {requests.map((req) => (
                            <div key={req.id} className="p-6 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gray-100 rounded-xl">
                                        {getStatusIcon(req.status)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">{req.client}</p>
                                        <p className="text-sm font-medium text-gray-500">{req.id} • {req.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-sm text-gray-500 font-medium">{req.date}</span>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                                        ${req.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                                        req.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                                        'bg-green-100 text-green-700'}`}>
                                        {req.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
