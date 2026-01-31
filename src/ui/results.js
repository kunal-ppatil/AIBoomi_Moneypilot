
import { calculateReadiness, calculateSIP, getAssetAllocation } from '../logic/calculator.js';
import { aiService } from '../services/ai.js';
import '../styles/results.css';

export function initResults(userInput) {
    const main = document.querySelector('main');

    // 1. Advanced Calculations
    const { income, expenses, savings, age } = userInput.personal;
    const { risk } = userInput.preferences;

    // Calculate investment readiness with detailed breakdown
    const readiness = calculateReadiness(income, expenses, savings);

    // Calculate average investment horizon from goals
    const avgHorizon = userInput.goals.length > 0
        ? userInput.goals.reduce((sum, g) => sum + parseInt(g.years), 0) / userInput.goals.length
        : 5;

    // Get advanced asset allocation based on age, risk, and horizon
    const allocation = getAssetAllocation(risk, age, avgHorizon);

    // Calculate total monthly SIP needed for all goals
    let totalSip = 0;
    const goalBreakdown = userInput.goals.map(g => {
        const sipCalc = calculateSIP(parseInt(g.amount), parseInt(g.years), risk);
        totalSip += sipCalc.monthly;
        return {
            ...g,
            ...sipCalc
        };
    });

    const monthlySurplus = income - expenses;

    // 2. Render UI
    main.innerHTML = `
        <div class="wizard-section">
            <div class="results-dashboard fade-in">
                
                <div class="results-header">
                    <h1>Your Personalized Investment Plan</h1>
                    <p class="section-desc">Based on your financial situation and goals</p>
                </div>

                <!-- Top 3 Cards -->
                <div class="results-grid-3">
                    
                    <!-- Readiness -->
                    <div class="result-card">
                        <h3>Investment Readiness <span class="info-icon">i</span></h3>
                        <div style="text-align:center; padding: 1.5rem 0;">
                            <div class="score-big">${readiness.score}</div>
                            <div class="status-badge" style="background: ${readiness.color}20; color: ${readiness.color}">
                                Status: ${readiness.label}
                            </div>
                        </div>
                        ${readiness.factors.map(f => `
                            <div class="breakdown-item">
                                <span>${f.name}</span>
                                <span class="text-${f.points >= 20 ? 'green' : f.points >= 10 ? 'yellow' : 'orange'}">
                                    ${f.status}
                                </span>
                            </div>
                        `).join('')}
                        <p style="font-size:0.85rem; color:#94a3b8; margin-top:1rem;">
                            ${readiness.recommendation}
                        </p>
                        <button class="btn-learn-more" data-topic="Investment Readiness Score">Learn More</button>
                    </div>

                    <!-- Recommended Mix -->
                    <div class="result-card">
                        <h3>Recommended Mix <span class="info-icon">i</span></h3>
                        <p style="font-size:0.85rem; color:#94a3b8; margin-bottom:1rem; min-height:3em">
                            ${allocation.rationale}
                        </p>
                        
                        <div class="alloc-item">
                            <div class="alloc-label"><span>Growth (Equity)</span> <span>${allocation.equity}%</span></div>
                            <div class="alloc-track"><div class="alloc-bar" style="width:${allocation.equity}%; background:#3b82f6"></div></div>
                            <div style="font-size:0.75rem; color:#64748b; margin-top:0.25rem;">
                                Large ${allocation.breakdown.equity.largeCap}% • Mid ${allocation.breakdown.equity.midCap}% • Small ${allocation.breakdown.equity.smallCap}%
                            </div>
                        </div>
                        <div class="alloc-item">
                            <div class="alloc-label"><span>Balance (Debt)</span> <span>${allocation.debt}%</span></div>
                            <div class="alloc-track"><div class="alloc-bar" style="width:${allocation.debt}%; background:#8b5cf6"></div></div>
                            <div style="font-size:0.75rem; color:#64748b; margin-top:0.25rem;">
                                Liquid ${allocation.breakdown.debt.liquidFunds}% • Short ${allocation.breakdown.debt.shortDuration}% • Long ${allocation.breakdown.debt.longDuration}%
                            </div>
                        </div>
                        <div class="alloc-item">
                            <div class="alloc-label"><span>Gold</span> <span>${allocation.gold}%</span></div>
                            <div class="alloc-track"><div class="alloc-bar" style="width:${allocation.gold}%; background:#f59e0b"></div></div>
                        </div>
                         <button class="btn-learn-more" data-topic="Asset Allocation Mix">Learn More</button>
                    </div>

                    <!-- Monthly Recommendations -->
                    <div class="result-card">
                        <h3>Monthly Investment <span class="info-icon">i</span></h3>
                        
                        <div class="sip-amount-box">
                            <span style="display:block; font-size:0.8rem; color:#065f46">Required SIP Amount</span>
                            <h2>₹${Math.round(totalSip).toLocaleString()}</h2>
                            <span style="font-size:0.8rem; color:${totalSip <= monthlySurplus ? '#065f46' : '#dc2626'}">
                                ${totalSip <= monthlySurplus ? '✓ Achievable with current surplus' : '⚠ Exceeds current surplus'}
                            </span>
                        </div>

                        <div style="margin-bottom:1rem">
                            <div class="breakdown-item">
                                <span>Your Monthly Surplus</span>
                                <span class="text-white">₹${monthlySurplus.toLocaleString()}</span>
                            </div>
                            <div class="breakdown-item">
                                <span>Total Goal Amount</span>
                                <span class="text-white">₹${userInput.goals.reduce((a, b) => a + parseInt(b.amount), 0).toLocaleString()}</span>
                            </div>
                            ${totalSip > monthlySurplus ? `
                            <div class="breakdown-item">
                                <span>Monthly Gap</span>
                                <span class="text-orange">₹${(totalSip - monthlySurplus).toLocaleString()}</span>
                            </div>
                            ` : ''}
                        </div>
                         <button class="btn-learn-more" data-topic="Systematic Investment Plan (SIP)">Learn More</button>
                    </div>
                </div>

                <!-- Snapshot & Assumptions -->
                <div class="result-card" style="margin-bottom:2rem">
                    <h3>How We Calculated Your Plan</h3>
                    <div class="snapshot-grid-split">
                        <div>
                            <h4 style="color:#3b82f6; font-size:0.95rem; margin-bottom:1rem">Your Financial Snapshot</h4>
                            <table class="snapshot-table">
                                <tr><td>Monthly Income</td><td style="text-align:right">₹${income.toLocaleString()}</td></tr>
                                <tr><td>Monthly Expenses</td><td style="text-align:right">₹${expenses.toLocaleString()}</td></tr>
                                <tr style="background:rgba(59,130,246,0.1); border-left: 3px solid #3b82f6">
                                    <td style="color:#fff; font-weight:600">Available for Investment</td>
                                    <td style="text-align:right; color:#fff; font-weight:600">₹${(income - expenses).toLocaleString()}</td>
                                </tr>
                            </table>
                        </div>
                        <div>
                             <h4 style="color:#3b82f6; font-size:0.95rem; margin-bottom:1rem">Investment Assumptions</h4>
                             <ul class="assumptions-list">
                                <li><span>Growth Return</span> <span>12%</span></li>
                                <li><span>Safe Return</span> <span>7%</span></li>
                                <li><span>Inflation</span> <span>6%</span></li>
                             </ul>
                        </div>
                    </div>
                </div>

                <!-- 3-Step Action Plan -->
                <div class="result-card">
                    <h3>Your 3-Step Action Plan <span style="font-size:0.8rem; background:#3b82f6; color:white; padding:2px 8px; border-radius:12px; margin-left:10px">Gemini AI</span></h3>
                    <div id="ai-action-container" class="action-timeline-container">
                        <div class="ai-loading">Analysing your profile with Gemini AI...</div>
                    </div>
                </div>

                <!-- Footer Buttons (Inline) -->
                <div class="action-buttons-group">
                    <button class="btn btn-outline" id="btn-deep-analysis">Show Deep Analysis</button>
                    <button class="btn btn-primary" onclick="window.print()">Download Report</button>
                    <button class="btn btn-text" onclick="window.location.reload()">Start Over</button>
                </div>

                <!-- Deep Analysis Section (Hidden) -->
                <div id="deep-analysis-section" style="display:none; max-width:1200px; margin: 2rem auto;">
                    <div class="result-card">
                         <h3>Deep Financial Analysis</h3>
                        <div id="deep-analysis-content">
                            <div class="ai-loading">Consulting Gemini Expert...</div>
                        </div>
                    </div>
                </div>

            </div>

             <!-- Learn More Modal -->
            <div id="learn-modal" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title" id="modal-title">Learn More</h3>
                        <button class="modal-close" onclick="document.getElementById('learn-modal').classList.remove('open')">&times;</button>
                    </div>
                    <div class="modal-body" id="modal-body">
                         <div class="ai-loading">Asking Gemini...</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 3. Logic
    loadAIActionPlan(userInput);

    document.getElementById('btn-deep-analysis').addEventListener('click', () => {
        const section = document.getElementById('deep-analysis-section');
        if (section.style.display === 'none') {
            section.style.display = 'block';
            loadDeepAnalysis(userInput);
            setTimeout(() => section.scrollIntoView({ behavior: 'smooth' }), 100);
            document.getElementById('btn-deep-analysis').innerText = "Hide Deep Analysis";
        } else {
            section.style.display = 'none';
            document.getElementById('btn-deep-analysis').innerText = "Show Deep Analysis";
        }
    });

    // Learn More Handlers
    document.querySelectorAll('.btn-learn-more').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const topic = e.target.dataset.topic;
            const modal = document.getElementById('learn-modal');
            const title = document.getElementById('modal-title');
            const body = document.getElementById('modal-body');

            title.innerText = topic;
            body.innerHTML = '<div class="ai-loading">Asking Gemini...</div>';
            modal.classList.add('open');

            const content = await aiService.generateLearnMoreContent(topic, userInput);
            body.innerHTML = content;
        });
    });
}

async function loadAIActionPlan(data) {
    const container = document.getElementById('ai-action-container');
    const steps = await aiService.generateActionPlan(data);

    if (Array.isArray(steps) && steps[0].title) {
        container.innerHTML = steps.map(step => `
            <div class="action-step-card">
                <div class="step-header">
                    <div class="step-title">${step.title}</div>
                    <div class="step-badge">${step.timeline || 'Upcoming'}</div>
                </div>
                <div class="step-desc">${step.description}</div>
                ${step.resources && step.resources.length > 0 ? `
                    <div class="resource-box">
                        <div class="resource-label">Helpful Resources:</div>
                        <div class="resource-tags">${step.resources.map(r => `<span class="res-tag">${r}</span>`).join('')}</div>
                    </div>
                `: ''}
            </div>
        `).join('');
    } else {
        container.innerHTML = steps.map(s => `<div class="action-step-card">${s}</div>`).join('');
    }
}

async function loadDeepAnalysis(data) {
    const container = document.getElementById('deep-analysis-content');
    const html = await aiService.generateDeepAnalysis(data);
    container.innerHTML = html;
}
