import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface ContractTemplate {
  title: string;
  description: string;
  category: string;
  requiredFields: string[];
}

export const contractTemplates: ContractTemplate[] = [
  {
    title: "Non-Disclosure Agreement (NDA)",
    description: "A confidentiality agreement to protect sensitive information",
    category: "Confidentiality",
    requiredFields: ["Party Names", "Confidential Information Definition", "Duration", "Purpose"]
  },
  {
    title: "Employment Agreement",
    description: "Standard employment contract with terms and conditions",
    category: "Employment",
    requiredFields: ["Employee Name", "Position", "Start Date", "Salary", "Benefits"]
  },
  {
    title: "Service Agreement",
    description: "Contract for providing services",
    category: "Services",
    requiredFields: ["Service Provider", "Client", "Services Description", "Payment Terms"]
  },
  {
    title: "Consulting Agreement",
    description: "Agreement for consulting services",
    category: "Services",
    requiredFields: ["Consultant", "Client", "Scope of Work", "Rate", "Duration"]
  },
  {
    title: "Sales Contract",
    description: "Agreement for the sale of goods or services",
    category: "Sales",
    requiredFields: ["Seller", "Buyer", "Product/Service", "Price", "Delivery Terms"]
  },
  {
    title: "Lease Agreement",
    description: "Contract for renting property",
    category: "Property",
    requiredFields: ["Landlord", "Tenant", "Property Details", "Rent Amount", "Lease Term"]
  },
  {
    title: "Term Sheet",
    description: "Outline of key terms for investment",
    category: "Investment",
    requiredFields: ["Company", "Investor", "Investment Amount", "Valuation", "Equity"]
  },
  {
    title: "SAFE Note Agreement",
    description: "Simple Agreement for Future Equity",
    category: "Investment",
    requiredFields: ["Company", "Investor", "Investment Amount", "Valuation Cap", "Discount Rate"]
  },
  {
    title: "Convertible Note Agreement",
    description: "Debt that converts to equity",
    category: "Investment",
    requiredFields: ["Company", "Investor", "Principal Amount", "Interest Rate", "Conversion Terms"]
  },
  {
    title: "Equity Vesting Agreement",
    description: "Schedule for earning equity over time",
    category: "Employment",
    requiredFields: ["Employee", "Company", "Total Shares", "Vesting Schedule", "Cliff Period"]
  },
  {
    title: "Partnership Agreement",
    description: "Terms for business partnership",
    category: "Business",
    requiredFields: ["Partner Names", "Business Purpose", "Capital Contributions", "Profit Sharing"]
  },
  {
    title: "Distribution Agreement",
    description: "Terms for product distribution",
    category: "Sales",
    requiredFields: ["Distributor", "Manufacturer", "Products", "Territory", "Terms"]
  },
  {
    title: "Licensing Agreement",
    description: "Terms for using intellectual property",
    category: "IP",
    requiredFields: ["Licensor", "Licensee", "IP Description", "License Type", "Duration"]
  },
  {
    title: "Software License Agreement",
    description: "Terms for software usage",
    category: "IP",
    requiredFields: ["Software Provider", "Licensee", "Software Description", "License Type", "Usage Terms"]
  },
  {
    title: "Freelancer Contract",
    description: "Agreement for freelance work",
    category: "Services",
    requiredFields: ["Freelancer", "Client", "Project Scope", "Rate", "Timeline"]
  },
  {
    title: "Intellectual Property Assignment",
    description: "Transfer of IP rights",
    category: "IP",
    requiredFields: ["Assignor", "Assignee", "IP Description", "Consideration", "Effective Date"]
  },
  {
    title: "Co-Founder Agreement",
    description: "Terms between business co-founders",
    category: "Business",
    requiredFields: ["Co-Founder Names", "Business Purpose", "Equity Split", "Roles", "Decision Making"]
  },
  {
    title: "Stock Option Agreement",
    description: "Terms for stock option grant",
    category: "Employment",
    requiredFields: ["Employee", "Company", "Number of Options", "Exercise Price", "Vesting Schedule"]
  },
  {
    title: "Investment Agreement",
    description: "Terms for investment",
    category: "Investment",
    requiredFields: ["Company", "Investor", "Investment Amount", "Equity", "Rights"]
  },
  {
    title: "Terms of Service",
    description: "Rules for using a service",
    category: "Legal",
    requiredFields: ["Service Name", "User Type", "Usage Rules", "Limitations", "Termination"]
  },
  {
    title: "Privacy Policy",
    description: "Data handling practices",
    category: "Legal",
    requiredFields: ["Company Name", "Data Types", "Collection Methods", "Usage", "User Rights"]
  },
  {
    title: "Data Processing Agreement",
    description: "GDPR-compliant data handling",
    category: "Legal",
    requiredFields: ["Data Controller", "Data Processor", "Data Types", "Processing Purpose", "Security Measures"]
  },
  {
    title: "SAAS Agreement",
    description: "Terms for software-as-a-service",
    category: "Services",
    requiredFields: ["Provider", "Customer", "Service Description", "Subscription Terms", "Service Level"]
  }
];

export const generateContract = async (
  template: ContractTemplate,
  data: Record<string, string>
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Get jurisdiction-specific context
    const jurisdictionContext = getJurisdictionContext(data.judiciary);

    const prompt = `You are a legal contract generator. Your task is to generate a complete, ready-to-use ${template.title} under ${data.judiciary} jurisdiction. The contract should be immediately usable without any placeholders or bracketed text.

${jurisdictionContext}

Contract Details:
- Contract Type: ${template.title}
- First Party: ${data.party1Name}${data.party1Address ? `\n  Address: ${data.party1Address}` : ''}
- Second Party: ${data.party2Name}${data.party2Address ? `\n  Address: ${data.party2Address}` : ''}
- Description: ${data.description}
${data.keyTerms ? `- Key Terms: ${data.keyTerms}` : ''}

Required Fields:
${template.requiredFields.map(field => `- ${field}: ${data[field.toLowerCase().replace(/\s+/g, '_')] || 'Not provided'}`).join('\n')}

CRITICAL INSTRUCTIONS:
1. Generate a COMPLETE, ready-to-use contract - NOT a template
2. DO NOT use placeholders, bracketed text, or [VARIABLES]
3. Fill in all specific details with actual values
4. Use today's date for the contract date
5. Include complete, specific information for all sections
6. Make all monetary values specific and complete
7. Include specific time periods and durations
8. Add complete contact information and addresses
9. Specify exact terms and conditions
10. Include all necessary legal boilerplate

Contract Structure Requirements:
1. Clear title and introduction
2. Complete party information
3. Specific terms and conditions
4. Detailed obligations and responsibilities
5. Specific compensation and benefits
6. Complete termination provisions
7. Specific governing law and jurisdiction
8. Complete signature blocks
9. Today's date
10. All necessary legal clauses

Format Requirements:
1. Professional legal formatting
2. Clear section numbering
3. Proper paragraph structure
4. Consistent spacing
5. Professional legal language
6. Complete sentences and clauses
7. No placeholders or variables
8. Ready for immediate use

Remember: Generate a complete, ready-to-use contract that can be signed immediately. Do not include any placeholders, bracketed text, or variables.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating contract:', error);
    throw error;
  }
};

// Helper function to get jurisdiction-specific context
const getJurisdictionContext = (judiciary: string): string => {
  const contexts: Record<string, string> = {
    common_law: `This contract should follow Common Law principles, which emphasizes:
- Judicial precedent and case law
- Adversarial legal system
- Emphasis on individual rights and freedoms
- Contract interpretation based on plain meaning
- Consideration as a key element of contract formation
- Remedies including specific performance and damages`,

    civil_law: `This contract should follow Civil Law principles, which emphasizes:
- Written legal codes and statutes
- Inquisitorial legal system
- Emphasis on social order and public interest
- Contract interpretation based on good faith
- Cause as a key element of contract formation
- Remedies including specific performance and restitution`,

    islamic_law: `This contract should follow Islamic Law (Sharia) principles, which emphasizes:
- Compliance with Islamic ethical principles
- Prohibition of interest (riba)
- Risk-sharing and profit-sharing arrangements
- Prohibition of uncertainty (gharar)
- Prohibition of gambling (maysir)
- Emphasis on mutual consent and fairness`,

    eu_law: `This contract should follow European Union Law principles, which emphasizes:
- Harmonization of laws across member states
- Protection of consumer rights
- Data protection and privacy (GDPR)
- Competition law compliance
- Cross-border trade facilitation
- Standard contract terms and conditions`,

    chinese_law: `This contract should follow Chinese Law principles, which emphasizes:
- Socialist legal system with Chinese characteristics
- Emphasis on social harmony
- Protection of state interests
- Contract interpretation based on purpose
- Emphasis on mediation and negotiation
- Special economic zone considerations`,

    indian_law: `This contract should follow Indian Law principles, which emphasizes:
- Mixed legal system (Common Law + Civil Law)
- Protection of fundamental rights
- Special economic zone regulations
- Contract interpretation based on intention
- Emphasis on arbitration and mediation
- Consideration of local customs and practices`,

    international: `This contract should follow International Law principles, which emphasizes:
- UN Convention on Contracts for International Sale of Goods (CISG)
- International commercial arbitration
- Cross-border dispute resolution
- Choice of law and jurisdiction
- International trade practices
- Harmonization of commercial laws`,

    // Add more jurisdictions as needed
  };

  return contexts[judiciary] || `This contract should follow standard legal principles and practices for ${judiciary} jurisdiction.`;
}; 