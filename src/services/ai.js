import { config } from '../config/env.js';

const API_KEY = config.gemini.apiKey;
const API_URL = config.gemini.apiUrl;

export const aiService = {
    async generateActionPlan(userProfile) {
        const prompt = `
      Act as a financial advisor for an Indian investor. Based on this profile, give me a structured 3-step financial plan in strict JSON format.
      
      Profile:
      - Age: ${userProfile.personal.age}
      - Income: ${userProfile.personal.income}
      - Savings: ${userProfile.personal.savings}
      - Risk Tolerance: ${userProfile.preferences.risk}
      - Goals: ${userProfile.goals.map(g => `${g.type} (${g.amount})`).join(', ')}

      Output format: A JSON Array of Objects with these keys:
      - title: Short clear title (e.g. "Start Emergency Fund")
      - timeline: String (e.g. "Immediate", "3-6 months")
      - description: 1-2 sentences explaining what to do
      - resources: Array of 2-3 platform names (e.g. ["Zerodha", "Groww"])

      Return ONLY the JSON array, no extra text.
    `;

        try {
            console.log('🔵 Gemini API - Action Plan Request');
            console.log('API Key exists:', !!API_KEY);
            console.log('API Key (first 10 chars):', API_KEY?.substring(0, 10));
            console.log('API URL:', API_URL);

            const requestBody = {
                contents: [{ parts: [{ text: prompt }] }]
            };
            console.log('Request body:', JSON.stringify(requestBody, null, 2));

            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (!response.ok) {
                console.error('❌ API Error Response:', responseText);
                throw new Error(`API request failed: ${response.status} - ${responseText}`);
            }

            const data = JSON.parse(responseText);
            console.log('✅ Parsed response:', data);

            const text = data.candidates[0].content.parts[0].text;

            // Cleanup markdown if AI adds it
            const cleanText = text.replace(/```json|```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (error) {
            console.error("❌ AI Action Plan Error:", error);
            console.error("Error details:", {
                name: error.name,
                message: error.message,
                stack: error.stack
            });

            return [
                {
                    title: "Build Emergency Corpus",
                    timeline: "Immediate",
                    description: "Secure 6 months of expenses in a liquid fund or sweep-in FD.",
                    resources: ["Bank FD", "Liquid Funds"]
                },
                {
                    title: "Start SIP Investment",
                    timeline: "Next 1 Month",
                    description: "Begin systematic investing in diversified equity mutual funds.",
                    resources: ["Zerodha Coin", "Groww", "Paytm Money"]
                },
                {
                    title: "Review & Insure",
                    timeline: "3-6 Months",
                    description: "Ensure you have adequate Term and Health insurance coverage.",
                    resources: ["PolicyBazaar", "Ditto Insurance"]
                }
            ];
        }
    },

    async generateDeepAnalysis(userProfile) {
        const totalGoalAmount = userProfile.goals.reduce((sum, g) => sum + parseInt(g.amount), 0);
        const monthlyInvestable = userProfile.personal.income - userProfile.personal.expenses;
        const emergencyFundNeeded = userProfile.personal.expenses * 6;

        const prompt = `
You are a CERTIFIED FINANCIAL PLANNER (CFP) with 15+ years of experience in Indian financial markets. Provide an EXTREMELY DETAILED, COMPREHENSIVE financial analysis for this client.

CLIENT PROFILE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Age: ${userProfile.personal.age} years
• Monthly Income: ₹${userProfile.personal.income.toLocaleString()}
• Monthly Expenses: ₹${userProfile.personal.expenses.toLocaleString()}
• Monthly Investable Surplus: ₹${monthlyInvestable.toLocaleString()}
• Current Savings: ₹${userProfile.personal.savings.toLocaleString()}
• Risk Tolerance: ${userProfile.preferences.risk}
• Investment Experience: ${userProfile.preferences.experience}

FINANCIAL GOALS:
${userProfile.goals.map((g, i) => `${i + 1}. ${g.type}: ₹${parseInt(g.amount).toLocaleString()} in ${g.years} years (Priority: ${g.priority})`).join('\n')}

Total Goal Amount: ₹${totalGoalAmount.toLocaleString()}
Emergency Fund Requirement: ₹${emergencyFundNeeded.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROVIDE A COMPREHENSIVE ANALYSIS WITH THE FOLLOWING SECTIONS (use HTML formatting):

<h3>📊 Financial Health Assessment</h3>
<p>Detailed analysis of current financial position, savings rate, expense ratio, and overall financial stability. Include specific percentages and comparisons to ideal benchmarks.</p>

<h3>🎯 Goal Feasibility Analysis</h3>
<p>For EACH goal, calculate:
- Required monthly SIP amount
- Expected corpus at maturity (assuming 12% equity returns)
- Gap analysis (if current investable surplus is insufficient)
- Specific recommendations to bridge any gaps</p>

<h3>💼 Recommended Portfolio Allocation</h3>
<p>Based on age and risk profile, provide EXACT allocation percentages:
- Equity (specify: Large Cap, Mid Cap, Small Cap percentages)
- Debt (specify: Liquid Funds, Short Duration, Long Duration)
- Gold (Digital Gold, Sovereign Gold Bonds)
- Alternative investments if applicable</p>

<h3>📈 Specific Investment Recommendations</h3>
<p>Recommend SPECIFIC Indian investment products:
- Mutual Funds (mention actual fund categories like Nifty 50 Index, Flexi Cap, etc.)
- Direct Equity (if experience level permits)
- Fixed Income (PPF, EPF, Tax-saving FDs)
- Insurance (Term Life, Health Insurance coverage amounts)</p>

<h3>⚠️ Risk Analysis & Mitigation</h3>
<p>Identify potential risks:
- Income disruption risk
- Market volatility impact
- Inflation erosion
- Specific mitigation strategies for each risk</p>

<h3>💡 Tax Optimization Strategies</h3>
<p>Specific tax-saving recommendations under Section 80C, 80D, and other applicable sections. Calculate potential tax savings.</p>

<h3>🚀 Action Plan (Next 90 Days)</h3>
<p>Concrete, actionable steps with specific timelines and platforms to use (Zerodha, Groww, Kuvera, etc.)</p>

<h3>📌 Key Warnings & Considerations</h3>
<p>Important caveats, market risks, and realistic expectations. Be honest about challenges.</p>

FORMAT: Use proper HTML tags (<h3>, <h4>, <p>, <ul>, <li>, <strong>, <em>) for beautiful formatting. Use emojis for visual appeal. Make it EXTREMELY detailed - aim for 800-1000 words. Be specific with numbers, percentages, and product names.
`;

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Deep Analysis Error:", error);
            return `
                <h3>⚠️ Analysis Temporarily Unavailable</h3>
                <p>We're unable to generate your deep analysis at this moment. This could be due to:</p>
                <ul>
                    <li>Internet connectivity issues</li>
                    <li>API rate limits</li>
                    <li>Temporary service disruption</li>
                </ul>
                <p><strong>Please try again in a few moments.</strong> Your data is safely stored and ready for analysis.</p>
            `;
        }
    },

    async generateLearnMoreContent(topic, userProfile) {
        const monthlyInvestable = userProfile.personal.income - userProfile.personal.expenses;
        const savingsRate = ((monthlyInvestable / userProfile.personal.income) * 100).toFixed(1);

        const prompt = `
You are a friendly, knowledgeable financial advisor explaining "${topic}" to a client.

CLIENT'S SPECIFIC SITUATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Age: ${userProfile.personal.age} years old
• Monthly Income: ₹${userProfile.personal.income.toLocaleString()}
• Monthly Expenses: ₹${userProfile.personal.expenses.toLocaleString()}
• Monthly Investable Amount: ₹${monthlyInvestable.toLocaleString()} (${savingsRate}% savings rate)
• Current Savings: ₹${userProfile.personal.savings.toLocaleString()}
• Risk Tolerance: ${userProfile.preferences.risk}
• Investment Experience: ${userProfile.preferences.experience}
• Primary Goals: ${userProfile.goals.map(g => g.type).join(', ')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TASK: Explain "${topic}" in a way that is SPECIFICALLY RELEVANT to THIS client's situation.

REQUIREMENTS:
1. Start with a simple definition of "${topic}"
2. Explain WHY it matters for someone with THEIR age, income level, and risk profile
3. Provide SPECIFIC examples or numbers based on their situation
4. Give 2-3 actionable insights they can use immediately
5. Use conversational, encouraging tone

FORMAT:
- Use HTML tags: <p>, <strong>, <ul>, <li>
- Keep it concise but informative (200-250 words)
- Use emojis sparingly for visual appeal
- Make it personal - use "you" and "your"
- Include specific Indian context (INR amounts, Indian investment products)

Example structure:
<p><strong>${topic}</strong> is [definition]...</p>
<p>For someone like you - ${userProfile.personal.age} years old with ₹${monthlyInvestable.toLocaleString()} to invest monthly - this means...</p>
<p><strong>Why it matters for you:</strong></p>
<ul>
  <li>Point specific to their situation</li>
  <li>Another relevant point</li>
</ul>
<p>💡 <strong>Quick tip:</strong> [Actionable advice]</p>
`;

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Learn More Error:", error);
            return `
                <p><strong>${topic}</strong></p>
                <p>We're unable to load the detailed explanation right now. Please check your internet connection and try again.</p>
                <p>💡 <em>Tip: This feature uses AI to provide personalized explanations based on your financial profile.</em></p>
            `;
        }
    }
};
