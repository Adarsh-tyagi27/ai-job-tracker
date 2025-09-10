import { JobApplication } from '../types';

export const initialApplications: JobApplication[] = [
    {
        id: '1',
        company: 'TechCorp',
        position: 'Frontend Engineer',
        jobDescription: 'We are looking for a React expert...',
        url: 'https://techcorp.com/jobs/123',
        status: 'Applied',
        dateApplied: '2023-10-01',
        salaryRange: '$120k - $150k'
    },
    {
        id: '2',
        company: 'StartupAI',
        position: 'Full Stack Developer',
        jobDescription: 'Join our fast-paced team building the future of AI...',
        url: 'https://startup.ai/careers',
        status: 'Wishlist',
        dateApplied: '2023-10-05',
        notes: 'Need to update resume for this one.'
    },
    {
        id: '3',
        company: 'BigSoft',
        position: 'Software Engineer II',
        jobDescription: 'Standard enterprise java role...',
        url: 'https://bigsoft.com/careers',
        status: 'Rejected',
        dateApplied: '2023-09-20'
    },
    {
        id: '4',
        company: 'InnovateInc',
        position: 'Product Engineer',
        jobDescription: 'Work on our core product...',
        url: 'https://innovate.inc/jobs',
        status: 'Interview',
        dateApplied: '2023-09-28',
        notes: 'Technical interview next Tuesday.'
    }
];
