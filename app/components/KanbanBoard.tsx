'use client';

import React, { useState, useEffect } from 'react';
import styles from './KanbanBoard.module.css';
import { JobApplication, ApplicationStatus } from '../types';
import { initialApplications } from '../data/mockData';
import AddApplicationModal from './AddApplicationModal';

const COLUMNS: ApplicationStatus[] = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function KanbanBoard() {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeColumn, setActiveColumn] = useState<ApplicationStatus>('Wishlist');

    // AI Analysis State
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('jobApplications');
        if (saved) {
            setApplications(JSON.parse(saved));
        } else {
            setApplications(initialApplications);
            localStorage.setItem('jobApplications', JSON.stringify(initialApplications));
        }
        setIsLoaded(true);
    }, []);

    const saveToStorage = (updatedApps: JobApplication[]) => {
        localStorage.setItem('jobApplications', JSON.stringify(updatedApps));
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, status: ApplicationStatus) => {
        e.preventDefault();
        if (!draggedId) return;

        const updatedApps = applications.map(app =>
            app.id === draggedId ? { ...app, status } : app
        );

        setApplications(updatedApps);
        saveToStorage(updatedApps);
        setDraggedId(null);
    };

    const handleAddApplication = (newApp: Omit<JobApplication, 'id' | 'dateApplied'>) => {
        const application: JobApplication = {
            ...newApp,
            id: crypto.randomUUID(),
            dateApplied: new Date().toISOString().split('T')[0]
        };

        const updated = [...applications, application];
        setApplications(updated);
        saveToStorage(updated);
    };

    const handleAnalyzeJob = async (id: string, jobDescription: string) => {
        if (!jobDescription) {
            alert("Please add a Job Description first!");
            return;
        }

        setAnalyzingId(id);
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                body: JSON.stringify({ jobDescription }),
            });

            if (!res.ok) throw new Error('Analysis failed');

            const data = await res.json();

            const updatedApps = applications.map(app =>
                app.id === id ? { ...app, aiAnalysis: data } : app
            );

            setApplications(updatedApps);
            saveToStorage(updatedApps);
        } catch (error) {
            console.error(error);
            alert('Failed to analyze job.');
        } finally {
            setAnalyzingId(null);
        }
    };

    const openAddModal = (status: ApplicationStatus) => {
        setActiveColumn(status);
        setIsModalOpen(true);
    };

    if (!isLoaded) return null;

    const getAppsByStatus = (status: ApplicationStatus) => {
        return applications.filter(app => app.status === status);
    };

    return (
        <>
            <div className={styles.boardContainer}>
                {COLUMNS.map(status => (
                    <div
                        key={status}
                        className={styles.column}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, status)}
                    >
                        <div className={styles.columnHeader}>
                            <div className={styles.columnTitle}>
                                <span className={`${styles.statusIndicator} ${styles[`status-${status}`]}`} />
                                {status}
                            </div>
                            <span className={styles.countBadge}>{getAppsByStatus(status).length}</span>
                        </div>

                        <div className={styles.cardList}>
                            {getAppsByStatus(status).map(app => (
                                <div
                                    key={app.id}
                                    className={`${styles.card} ${draggedId === app.id ? styles.dragging : ''}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, app.id)}
                                >
                                    <div className={styles.cardTitle}>{app.position}</div>
                                    <div className={styles.cardCompany}>
                                        {app.company}
                                    </div>

                                    {app.salaryRange && (
                                        <div style={{ fontSize: '0.8rem', color: '#34d399', marginBottom: '0.5rem' }}>
                                            {app.salaryRange}
                                        </div>
                                    )}

                                    {/* AI Analysis Section */}
                                    {app.aiAnalysis ? (
                                        <div>
                                            <div className={styles.keywords}>
                                                {app.aiAnalysis.keywords.map((k, i) => (
                                                    <span key={i} className={styles.keyword}>{k}</span>
                                                ))}
                                            </div>
                                            <div className={styles.tips}>
                                                <p>Resume Tips:</p>
                                                <ul>
                                                    {app.aiAnalysis.tips.map((tip, i) => (
                                                        <li key={i}>{tip}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            className={styles.analyzeBtn}
                                            onClick={() => handleAnalyzeJob(app.id, app.jobDescription)}
                                            disabled={analyzingId === app.id}
                                        >
                                            {analyzingId === app.id ? (
                                                <>
                                                    <span className={styles.spinner} /> Analyzing...
                                                </>
                                            ) : (
                                                <>✨ AI Analyze</>
                                            )}
                                        </button>
                                    )}

                                    <div className={styles.cardFooter}>
                                        <span className={styles.date}>On {app.dateApplied}</span>
                                        {app.url && (
                                            <a href={app.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.8rem' }}>
                                                Link &#8599;
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className={styles.addMoreBtn}
                            onClick={() => openAddModal(status)}
                        >
                            + Add New
                        </button>
                    </div>
                ))}
            </div>

            <AddApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddApplication}
                initialStatus={activeColumn}
            />
        </>
    );
}
