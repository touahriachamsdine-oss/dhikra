"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, FileText, Gavel, FileCheck, ArrowLeft } from "lucide-react";

export default function ServicesPage() {
    const router = useRouter();
    
    const services = [
        {
            title: "Automated Formal Notices",
            description: "Generate legally compliant formal notices in minutes.",
            icon: <FileText className="w-8 h-8 text-primary-600" />
        },
        {
            title: "Bailiff Intermediation",
            description: "Connect directly with certified bailiffs for official document serving.",
            icon: <Scale className="w-8 h-8 text-primary-600" />
        },
        {
            title: "Claims Management",
            description: "Track and manage your outstanding claims easily from a single dashboard.",
            icon: <FileCheck className="w-8 h-8 text-primary-600" />
        },
        {
            title: "Legal Advice Consultation",
            description: "Get preliminary insights into your legal standing from experts.",
            icon: <Gavel className="w-8 h-8 text-primary-600" />
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push('/')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Scale className="w-6 h-6 text-secondary-500" />
                        <h1 className="text-xl font-black tracking-tight text-primary-500">
                            Settle<span className="text-secondary-500">Up</span>.dz
                        </h1>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full py-16 px-6 sm:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-primary-900 mb-4">Our Services</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover how we simplify legal procedures through automation and direct connections with professionals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{service.description}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
