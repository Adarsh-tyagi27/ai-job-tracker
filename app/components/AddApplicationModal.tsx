import React, { useState } from 'react';
import styles from './AddApplicationModal.module.css';
import { JobApplication, ApplicationStatus } from '../types';

interface AddApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (app: Omit<JobApplication, 'id' | 'dateApplied'>) => void;
    initialStatus?: ApplicationStatus;
}

export default function AddApplicationModal({ isOpen, onClose, onAdd, initialStatus = 'Wishlist' }: AddApplicationModalProps) {
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        url: '',
        salaryRange: '',
        jobDescription: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            ...formData,
            status: initialStatus,
        });
        setFormData({ company: '', position: '', url: '', salaryRange: '', jobDescription: '' });
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2 className={styles.title}>Track New Job</h2>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Company Name</label>
                        <input
                            required
                            className={styles.input}
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                            placeholder="e.g. Google"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Position</label>
                        <input
                            required
                            className={styles.input}
                            value={formData.position}
                            onChange={e => setFormData({ ...formData, position: e.target.value })}
                            placeholder="e.g. Senior React Engineer"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Job Link (URL)</label>
                        <input
                            className={styles.input}
                            value={formData.url}
                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Salary Range (Optional)</label>
                        <input
                            className={styles.input}
                            value={formData.salaryRange}
                            onChange={e => setFormData({ ...formData, salaryRange: e.target.value })}
                            placeholder="e.g. $120k - $160k"
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitBtn}>
                            Add Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
