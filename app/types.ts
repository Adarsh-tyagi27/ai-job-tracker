export type ApplicationStatus = 'Wishlist' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface JobApplication {
    id: string;
    company: string;
    position: string;
    jobDescription: string;
    url: string;
    status: ApplicationStatus;
    dateApplied: string;
    salaryRange?: string;
    notes?: string;
    aiAnalysis?: {
        keywords: string[];
        tips: string[];
    };
}

// ref: 13












