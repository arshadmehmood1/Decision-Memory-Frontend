export const DEMO_DECISION = {
    title: "Migrate from MongoDB to PostgreSQL for Core Transactional Data",
    category: "TECH",
    status: "ACTIVE",
    madeBy: "Demo User",
    madeOn: new Date().toISOString(),
    decision: "We have decided to migrate our core transactional ledger from MongoDB to PostgreSQL to ensure ACID compliance and support complex join queries for our new reporting analytics dashboard.",
    context: "Our current MongoDB instance has served us well for the MVP phase, but as we scale to 10k+ concurrent transactions, we are seeing data consistency issues in the ledger. The finance team also requires complex relational reports that are performant-prohibitive in Mongo. We considered sticking with Mongo (v5+ transaction support) but the team's SQL expertise significantly outweighs their NoSQL optimization skills.",
    alternatives: [
        {
            name: "Stay on MongoDB (Upgrade to v6)",
            whyRejected: "While v6 improves ACID transactions, it doesn't solve the reporting complexity. We would still need an ETL pipeline to a SQL warehouse for analytics."
        },
        {
            name: "Migrate to DynamoDB",
            whyRejected: "Vendor lock-in with AWS concerns. Also, the single-table design pattern learning curve is too steep for our current timeline."
        }
    ],
    assumptions: [
        { value: "The migration script can handle the 5M records within the 4-hour maintenance window." },
        { value: "Our ORM (Prisma) adapter for Postgres will support 95% of our existing query patterns with minimal refactoring." }
    ],
    successCriteria: [
        { value: "Zero data loss during migration verification." },
        { value: "Reporting query latency reduced from 8s (Mongo Aggregation) to <200ms (SQL)." },
        { value: "Maintenance window completes under 4 hours." }
    ],
    tags: ["architecture", "database", "scaling"],
    privacy: "This Workspace",
    aiRiskScore: 15,
    neuralInsight: "Low risk decision. Standard pattern for scaling SaaS. Watch out for the 'maintenance window' assumption - 5M records might take longer depending on index rebuilding."
};
