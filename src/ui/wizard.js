
import { calculateReadiness } from '../logic/calculator.js';
import { dataService } from '../services/supabase.js';
import '../styles/wizard.css';

const state = {
    step: 1,
    data: {
        personal: { age: 25, income: 50000, expenses: 20000, savings: 100000 },
        goals: [{ id: 1, type: 'Retirement', amount: 10000000, years: 20, priority: 'High' }],
        preferences: { risk: 'Balanced', experience: 'Intermediate' }
    }
};

export async function initWizard() {
    const main = document.querySelector('main');
    document.querySelector('.scroll-indicator')?.remove();

    // Load existing data if available from Supabase
    const result = await dataService.getPlan();
    if (result.success && result.data) {
        state.data = {
            personal: result.data.personal || state.data.personal,
            goals: result.data.goals || state.data.goals,
            preferences: result.data.preferences || state.data.preferences
        };
    }

    renderWizard(main);
}

function renderWizard(container) {
    container.innerHTML = `
      <div class="wizard-section">
      <div class="wizard-container fade-in">
         
         <!-- New Tabbed Navigation -->
         <div class="wizard-tabs">
            <div class="tab-item ${state.step === 1 ? 'active' : ''} ${state.step > 1 ? 'completed' : ''}" onclick="window.jumpToStep(1)">Personal Info</div>
            <div class="tab-item ${state.step === 2 ? 'active' : ''} ${state.step > 2 ? 'completed' : ''}" onclick="window.jumpToStep(2)">Goals</div>
            <div class="tab-item ${state.step === 3 ? 'active' : ''} ${state.step > 3 ? 'completed' : ''}" onclick="window.jumpToStep(3)">Preferences</div>
            <div class="tab-item">Results</div>
         </div>
         
         <div class="wizard-content-area" id="wizard-content">
            ${getStepContent(state.step)}
         </div>
         
         <div class="wizard-footer">
            ${state.step > 1 ? '<button class="btn btn-text" id="prev-btn">Back</button>' : ''}
            <button class="btn btn-primary" id="next-btn">${state.step === 3 ? 'See My Plan' : 'Next'}</button>
         </div>
      </div>
      </div>
    `;

    attachListeners(container);
    // Dynamic listeners for Add Goal
    if (state.step === 2) attachGoalListeners();

    // Expose jump helper
    window.jumpToStep = (step) => {
        if (step < state.step) {
            state.step = step;
            renderWizard(container);
        }
    };
}

function getStepContent(step) {
    if (step === 1) {
        return `
            <div class="wizard-header">
                <h2 class="wizard-title">Tell us about your finances</h2>
                <p class="section-desc">Help us understand your current standing.</p>
            </div>
            
            <form id="step1-form" class="input-grid">
                <div class="form-group">
                    <label>Age</label>
                    <input type="number" id="inp-age" class="inp-field" value="${state.data.personal.age}" min="18" max="65">
                    <span class="helper-text">Must be between 18 and 65</span>
                </div>
                <div class="form-group">
                    <label>Monthly Income</label>
                    <input type="number" id="inp-income" class="inp-field" value="${state.data.personal.income}">
                    <span class="helper-text">Take-home after taxes</span>
                </div>
                <div class="form-group">
                    <label>Monthly Expenses</label>
                    <input type="number" id="inp-expenses" class="inp-field" value="${state.data.personal.expenses}">
                    <span class="helper-text">Rent, food, utilities, etc.</span>
                </div>
               <div class="form-group">
                    <label>Current Savings</label>
                    <input type="number" id="inp-savings" class="inp-field" value="${state.data.personal.savings}">
                    <span class="helper-text">Savings acc, FDs, liquid assets</span>
                </div>
            </form>
        `;
    }
    if (step === 2) {
        return `
            <div class="wizard-header">
                <h2 class="wizard-title">What are your financial goals?</h2>
                <p class="section-desc">Tell us what you're saving for and when you need the money.</p>
            </div>

            <div id="goals-list" class="goals-list">
                ${state.data.goals.map((goal, index) => `
                    <div class="goal-card-enhanced" data-id="${goal.id}">
                        <div class="goal-title">
                            Goal ${index + 1}
                            ${index > 0 ? '<span class="remove-goal text-red" style="cursor:pointer; font-size: 0.9rem">Remove</span>' : ''}
                        </div>
                        
                        <div class="goal-grid">
                            <div class="form-group">
                                <label>Goal Type <span class="text-red">*</span></label>
                                <select class="inp-field goal-type" onchange="updateGoal(${goal.id}, 'type', this.value)">
                                    <option value="Retirement" ${goal.type === 'Retirement' ? 'selected' : ''}>Retirement</option>
                                    <option value="House" ${goal.type === 'House' ? 'selected' : ''}>Buy a House</option>
                                    <option value="Car" ${goal.type === 'Car' ? 'selected' : ''}>Buy a Car</option>
                                    <option value="Education" ${goal.type === 'Education' ? 'selected' : ''}>Education</option>
                                    <option value="Vacation" ${goal.type === 'Vacation' ? 'selected' : ''}>Vacation</option>
                                    <option value="Wealth" ${goal.type === 'Wealth' ? 'selected' : ''}>General Wealth</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Target Amount (₹) <span class="text-red">*</span></label>
                                <input type="number" class="inp-field" placeholder="e.g. 500000" value="${goal.amount}" onchange="updateGoal(${goal.id}, 'amount', this.value)">
                            </div>
                            <div class="form-group">
                                <label>Timeline (Years) <span class="text-red">*</span></label>
                                <input type="number" class="inp-field" placeholder="e.g. 5" value="${goal.years}" onchange="updateGoal(${goal.id}, 'years', this.value)">
                            </div>
                        </div>
                        
                         <div style="display:flex; justify-content:flex-end; align-items:center; margin-top:0.5rem">
                             <label style="margin-right:1rem; color:#94a3b8; font-size:0.9rem">Priority:</label>
                             <select class="inp-field" style="width:auto; padding:0.4rem" onchange="updateGoal(${goal.id}, 'priority', this.value)">
                                <option value="High" ${goal.priority === 'High' ? 'selected' : ''}>High</option>
                                <option value="Medium" ${goal.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                                <option value="Low" ${goal.priority === 'Low' ? 'selected' : ''}>Low</option>
                             </select>
                         </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-outline btn-block" id="add-goal-btn">+ Add Another Goal</button>
        `;
    }
    if (step === 3) {
        return `
            <div class="wizard-header">
                <h2 class="wizard-title">Investment Preferences</h2>
                <p class="section-desc">Help us understand your comfort level with risk.</p>
            </div>
            
            <label class="lbl-block" style="margin-bottom:1rem">Risk Tolerance <span class="text-red">*</span></label>
            <div class="option-card-group">
                <div class="radio-option ${state.data.preferences.risk === 'Conservative' ? 'selected' : ''}" onclick="selectRisk('Conservative')">
                    <div class="radio-circle"></div>
                    <div>
                        <h4 style="color:white; margin-bottom:0.25rem">Conservative</h4>
                        <p style="color:#94a3b8; font-size:0.9rem">I prefer safer investments with steady returns</p>
                    </div>
                </div>
                <div class="radio-option ${state.data.preferences.risk === 'Balanced' ? 'selected' : ''}" onclick="selectRisk('Balanced')">
                    <div class="radio-circle"></div>
                    <div>
                        <h4 style="color:white; margin-bottom:0.25rem">Moderate</h4>
                        <p style="color:#94a3b8; font-size:0.9rem">I'm okay with some ups and downs for better returns</p>
                    </div>
                </div>
                <div class="radio-option ${state.data.preferences.risk === 'Aggressive' ? 'selected' : ''}" onclick="selectRisk('Aggressive')">
                    <div class="radio-circle"></div>
                    <div>
                        <h4 style="color:white; margin-bottom:0.25rem">Aggressive</h4>
                        <p style="color:#94a3b8; font-size:0.9rem">I can handle significant fluctuations for higher returns</p>
                    </div>
                </div>
            </div>

            <label class="lbl-block" style="margin-top:2rem; margin-bottom:1rem">Investment Experience <span class="text-red">*</span></label>
            <div class="option-card-group">
                 <div class="radio-option ${state.data.preferences.experience === 'None' ? 'selected' : ''}" onclick="selectExp('None')">
                    <div class="radio-circle"></div>
                     <div><h4 style="color:white">None</h4><p style="color:#94a3b8; font-size:0.9rem">I'm completely new to investing</p></div>
                </div>
                <div class="radio-option ${state.data.preferences.experience === 'Intermediate' ? 'selected' : ''}" onclick="selectExp('Intermediate')">
                    <div class="radio-circle"></div>
                     <div><h4 style="color:white">Intermediate</h4><p style="color:#94a3b8; font-size:0.9rem">I understand the basics</p></div>
                </div>
            </div>
        `;
    }
}

function attachListeners(container) {
    document.getElementById('next-btn')?.addEventListener('click', async () => {
        if (state.step === 1) {
            state.data.personal.age = parseInt(document.getElementById('inp-age').value);
            state.data.personal.income = parseInt(document.getElementById('inp-income').value);
            state.data.personal.expenses = parseInt(document.getElementById('inp-expenses').value);
            state.data.personal.savings = parseInt(document.getElementById('inp-savings').value);

            // Save to Supabase
            await dataService.savePlan(state.data);

            state.step++;
            renderWizard(container);
        } else if (state.step === 2) {
            // Goals updated via inline events
            // Save to Supabase
            await dataService.savePlan(state.data);

            state.step++;
            renderWizard(container);
        } else if (state.step === 3) {
            // Save final data to Supabase before showing results
            const saveResult = await dataService.savePlan(state.data);

            if (!saveResult.success) {
                console.error('Error saving data:', saveResult.error);
                alert('Error saving your data. Please try again.');
                return;
            }

            // Finish - show results
            import('./results.js').then(module => module.initResults(state.data));
        }
    });

    document.getElementById('prev-btn')?.addEventListener('click', () => {
        state.step--;
        renderWizard(container);
    });
}

function attachGoalListeners() {
    document.getElementById('add-goal-btn')?.addEventListener('click', () => {
        state.data.goals.push({ id: Date.now(), type: 'Wealth', amount: 500000, years: 5, priority: 'Medium' });
        renderWizard(document.querySelector('main'));
    });

    document.querySelectorAll('.remove-goal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.goal-card-enhanced').dataset.id;
            state.data.goals = state.data.goals.filter(g => g.id != id);
            renderWizard(document.querySelector('main'));
        });
    });

    // Global expose for inline handlers
    window.selectRisk = (val) => {
        state.data.preferences.risk = val;
        renderWizard(document.querySelector('main'));
    };

    window.selectExp = (val) => {
        state.data.preferences.experience = val;
        renderWizard(document.querySelector('main'));
    };

    window.updateGoal = (id, field, val) => {
        const goal = state.data.goals.find(g => g.id == id);
        if (goal) goal[field] = val;
    };
}
