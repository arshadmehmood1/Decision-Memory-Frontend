/**
 * Decision Templates - Pre-sets for common decision scenarios
 * 
 * These templates provide starting points for common types of decisions,
 * helping users get started faster with structured, high-quality entries.
 */

import { FileCode, Users, DollarSign, Rocket, Building, Target, Brain, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface DecisionTemplate {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    color: string;
    category: 'PRODUCT' | 'MARKETING' | 'SALES' | 'HIRING' | 'TECH' | 'OPERATIONS' | 'STRATEGIC' | 'OTHER';
    prefill: {
        title: string;
        decision: string;
        context: string;
        alternatives: { name: string; whyRejected: string }[];
        assumptions: { value: string }[];
        successCriteria: { value: string }[];
    };
}

export const DECISION_TEMPLATES: DecisionTemplate[] = [
    {
        id: 'tech-stack',
        name: 'Tool / Tech Switch',
        description: 'Switching tools, frameworks, or infrastructure',
        icon: FileCode,
        color: 'purple',
        category: 'TECH',
        prefill: {
            title: 'Switching from [Current Tool] to [New Tool]',
            decision: 'We are switching from [current tool] to [new tool] to address [specific pain points].',
            context: 'Current system limitations:\n- [Scalability issue]\n- [Cost inefficiency]\n- [Developer friction]\n\nThis change is triggered by [growth milestone / contract renewal / requirement].',
            alternatives: [
                { name: 'Stay with current solution', whyRejected: 'Does not address the core friction we\'re facing.' },
                { name: 'Build custom in-house solution', whyRejected: 'Engineering time better spent on product features.' }
            ],
            assumptions: [
                { value: 'The migration can be completed in [X weeks] without major disruption.' },
                { value: 'The new tool will handle [X]x current load/usage.' }
            ],
            successCriteria: [
                { value: 'Zero data loss during migration' },
                { value: 'Team productivity increases by [X]%' },
                { value: 'Cost reduced by [X]% annually' }
            ]
        }
    },
    {
        id: 'feature-priority',
        name: 'Feature Prioritization',
        description: 'Deciding between competing features or roadmap items',
        icon: Target,
        color: 'orange',
        category: 'PRODUCT',
        prefill: {
            title: 'Prioritizing [Feature A] over [Feature B]',
            decision: 'We are prioritizing [Feature A] for the upcoming cycle/sprint instead of [Feature B].',
            context: 'Strategic Context:\n- Current goal: [Growth/Retention/Revenue]\n- Resource constraints: [Limited eng capacity]\n\nFeature A Impact: [High]\nFeature B Impact: [Medium]',
            alternatives: [
                { name: 'Build Feature B first', whyRejected: 'Lower RICE score; less alignment with current Q1 goals.' },
                { name: 'Build both in parallel', whyRejected: 'Would reduce focus and delay delivery of both.' }
            ],
            assumptions: [
                { value: 'Feature A is crucial for closing [Contract/Segment].' },
                { value: 'Feature B can wait until Q2 without losing key customers.' }
            ],
            successCriteria: [
                { value: 'Feature A ships by [Date]' },
                { value: 'Adoption rate of [X]% within 2 weeks' },
                { value: 'Stakeholders align on the delay of Feature B' }
            ]
        }
    },
    {
        id: 'hiring',
        name: 'Hiring Decision',
        description: 'Selecting a candidate or defining a new role',
        icon: Users,
        color: 'blue',
        category: 'HIRING',
        prefill: {
            title: 'Hiring [Role Title] for [Team/Department]',
            decision: 'We are hiring [candidate name/type] for [role] to [primary purpose of the hire].',
            context: 'Team context:\n- Current team size: [X]\n- Workload issues: [specific gaps]\n- Growth plans: [upcoming needs]\n\nThis role is critical because [reason].',
            alternatives: [
                { name: 'Promote internally', whyRejected: 'No suitable internal candidates with required skillset.' },
                { name: 'Outsource to contractor', whyRejected: 'This role requires deep institutional knowledge.' },
                { name: 'Delay hiring', whyRejected: 'Current workload is unsustainable.' }
            ],
            assumptions: [
                { value: 'Candidate will ramp up within [X] weeks.' },
                { value: 'Team dynamics will not be negatively impacted.' }
            ],
            successCriteria: [
                { value: 'Candidate passes 90-day review with positive feedback' },
                { value: 'Team velocity increases by [X]% within 3 months' },
                { value: 'Role-specific KPIs met within first quarter' }
            ]
        }
    },
    {
        id: 'pricing',
        name: 'Pricing Change',
        description: 'Adjusting pricing strategy or plans',
        icon: DollarSign,
        color: 'green',
        category: 'STRATEGIC',
        prefill: {
            title: 'Adjusting Pricing from [Old] to [New]',
            decision: 'We are changing our pricing from [current structure] to [new structure] to [primary goal].',
            context: 'Market context:\n- Competitor pricing: [range]\n- Customer feedback: [themes]\n- Current conversion rate: [X]%\n\nKey drivers:\n- [Revenue goals]\n- [Market positioning]',
            alternatives: [
                { name: 'Keep current pricing', whyRejected: 'Not capturing the value we deliver to customers.' },
                { name: 'Add more tiers', whyRejected: 'Complexity would confuse customers and hurt conversions.' }
            ],
            assumptions: [
                { value: 'Existing customers will accept grandfather clause terms.' },
                { value: 'Price elasticity is within acceptable bounds.' }
            ],
            successCriteria: [
                { value: 'ARPU increases by [X]% within 6 months' },
                { value: 'Churn remains under [X]%' },
                { value: 'Net new MRR improves' }
            ]
        }
    },
    {
        id: 'product-launch',
        name: 'Product/Feature Launch',
        description: 'Launching a new product or major feature',
        icon: Rocket,
        color: 'orange',
        category: 'PRODUCT',
        prefill: {
            title: 'Launching [Feature/Product Name]',
            decision: 'We are launching [feature/product] to [target user segment] to address [core problem].',
            context: 'Why now:\n- [Market timing]\n- [Customer demand signals]\n- [Competitive pressure]\n\nScope: [MVP features included]',
            alternatives: [
                { name: 'Wait for more validation', whyRejected: 'Multiple customers have requested this feature explicitly.' },
                { name: 'Build a different feature first', whyRejected: 'This has higher potential impact on retention.' }
            ],
            assumptions: [
                { value: 'Target users will discover and adopt the feature within [X] weeks.' },
                { value: 'The feature will not significantly increase support load.' }
            ],
            successCriteria: [
                { value: '[X]% of target users try the feature within first month' },
                { value: 'NPS for the feature is [X]+ after launch' },
                { value: 'Feature contributes to [X]% reduction in churn' }
            ]
        }
    },
    {
        id: 'vendor',
        name: 'Vendor/Partnership',
        description: 'Selecting a vendor or strategic partnership',
        icon: Building,
        color: 'slate',
        category: 'OPERATIONS',
        prefill: {
            title: 'Partnering with [Vendor/Company] for [Purpose]',
            decision: 'We are selecting [vendor/partner] to [purpose]. Contract terms: [key terms].',
            context: 'Evaluation process:\n- [X] vendors evaluated\n- Key criteria: [list]\n- Timeline: [urgency reason]',
            alternatives: [
                { name: 'Build in-house', whyRejected: 'Not our core competency; would distract engineering.' },
                { name: 'Choose [other vendor]', whyRejected: '[Specific shortcoming]' }
            ],
            assumptions: [
                { value: 'Vendor will deliver on SLA commitments.' },
                { value: 'Integration effort is within [X] engineering weeks.' }
            ],
            successCriteria: [
                { value: 'Integration completed within [X] weeks' },
                { value: 'Uptime meets [X]% SLA' },
                { value: 'Cost stays within budget of [X]/month' }
            ]
        }
    },
    {
        id: 'strategic',
        name: 'Strategic Pivot',
        description: 'Major direction change or pivot',
        icon: Target,
        color: 'red',
        category: 'STRATEGIC',
        prefill: {
            title: 'Pivoting from [Old Direction] to [New Direction]',
            decision: 'We are pivoting our focus from [current focus] to [new focus] based on [key insight].',
            context: 'Evidence for change:\n- [Data point 1]\n- [Data point 2]\n- [Customer feedback]\n\nRisks of not changing: [consequences]',
            alternatives: [
                { name: 'Double down on current approach', whyRejected: 'Data shows diminishing returns on current strategy.' },
                { name: 'Gradual transition', whyRejected: 'Market window requires faster action.' }
            ],
            assumptions: [
                { value: 'Team can adapt to new direction within [X] weeks.' },
                { value: 'Existing customers will remain through transition.' }
            ],
            successCriteria: [
                { value: 'New direction shows [X]% traction improvement in [timeframe]' },
                { value: 'Team alignment score remains above [X]' },
                { value: 'Key customers retained through transition' }
            ]
        }
    },
    {
        id: 'marketing',
        name: 'Marketing Strategy',
        description: 'New marketing channel or campaign approach',
        icon: Zap,
        color: 'yellow',
        category: 'MARKETING',
        prefill: {
            title: 'Launching [Channel/Campaign] Marketing Initiative',
            decision: 'We are investing in [marketing channel/strategy] with a budget of [X] to achieve [goal].',
            context: 'Current marketing state:\n- CAC: $[X]\n- Best performing channel: [name]\n- Growth target: [X]%\n\nWhy this channel now: [rationale]',
            alternatives: [
                { name: 'Increase spend on existing channels', whyRejected: 'Hitting diminishing returns; need diversification.' },
                { name: 'Delay marketing investment', whyRejected: 'Competitive pressure requires immediate action.' }
            ],
            assumptions: [
                { value: 'Channel will achieve [X] CAC within [timeframe].' },
                { value: 'Target audience is active on this channel.' }
            ],
            successCriteria: [
                { value: 'CAC under $[X] within 3 months' },
                { value: '[X] qualified leads per month' },
                { value: 'Channel contributes [X]% of new signups' }
            ]
        }
    },
    {
        id: 'blank',
        name: 'Start from Scratch',
        description: 'Create a decision with no template',
        icon: Brain,
        color: 'gray',
        category: 'OTHER',
        prefill: {
            title: '',
            decision: '',
            context: '',
            alternatives: [{ name: '', whyRejected: '' }],
            assumptions: [{ value: '' }],
            successCriteria: [{ value: '' }]
        }
    }
];

export function getTemplateById(id: string): DecisionTemplate | undefined {
    return DECISION_TEMPLATES.find(t => t.id === id);
}
