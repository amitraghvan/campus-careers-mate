export interface ExploreJob {
    id: string;
    role: string;
    company: string;
    logo: string; // Placeholder styling for now
    location: string;
    type: "Full-time" | "Internship" | "Contract";
    tags: string[];
    postedAt: string;
    trending?: boolean;
}

export const TRENDING_JOBS: ExploreJob[] = [
    {
        id: "1",
        role: "Software Engineer, Early Career",
        company: "Google",
        logo: "G",
        location: "Bangalore, India",
        type: "Full-time",
        tags: ["Java", "C++", "Python"],
        postedAt: "2 days ago",
        trending: true,
    },
    {
        id: "2",
        role: "Frontend Developer Intern",
        company: "Swiggy",
        logo: "S",
        location: "Remote",
        type: "Internship",
        tags: ["React", "TypeScript", "Tailwind"],
        postedAt: "4 hours ago",
        trending: true,
    },
    {
        id: "3",
        role: "Product Analyst",
        company: "Cred",
        logo: "C",
        location: "Bangalore, India",
        type: "Full-time",
        tags: ["SQL", "Python", "Analytics"],
        postedAt: "1 day ago",
    },
];

export const RECOMMENDED_JOBS: ExploreJob[] = [
    {
        id: "4",
        role: "SDE-1",
        company: "Amazon",
        logo: "A",
        location: "Hyderabad, India",
        type: "Full-time",
        tags: ["Java", "AWS", "Distributed Systems"],
        postedAt: "3 days ago",
    },
    {
        id: "5",
        role: "Backend Engineer",
        company: "Zomato",
        logo: "Z",
        location: "Gurgaon, India",
        type: "Full-time",
        tags: ["Go", "PostgreSQL", "Kafka"],
        postedAt: "5 days ago",
    },
    {
        id: "6",
        role: "Full Stack Intern",
        company: "Razorpay",
        logo: "R",
        location: "Bangalore, India",
        type: "Internship",
        tags: ["Node.js", "React", "Typescript"],
        postedAt: "1 week ago",
    },
];

export const CATEGORIES = [
    { id: "sde", label: "Software Engineering" },
    { id: "data", label: "Data Science" },
    { id: "product", label: "Product Management" },
    { id: "design", label: "Design" },
    { id: "marketing", label: "Marketing" },
    { id: "sales", label: "Sales" },
];
