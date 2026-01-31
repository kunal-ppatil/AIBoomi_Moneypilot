/**
 * Advanced Financial Calculator with Rule-Based Logic
 * Provides realistic investment readiness scores, asset allocation, and SIP calculations
 */

/**
 * Calculate Investment Readiness Score (0-100)
 * Based on multiple financial health indicators
 */
export function calculateReadiness(income, expenses, savings) {
    const surplus = income - expenses;
    const savingsRatio = (surplus / income) * 100;
    const emergencyFund = savings / expenses; // Months of expenses covered

    let score = 0;
    let factors = [];

    // Factor 1: Savings Rate (0-30 points)
    if (savingsRatio >= 50) {
        score += 30;
        factors.push({ name: 'Savings Rate', status: 'Excellent', points: 30 });
    } else if (savingsRatio >= 30) {
        score += 25;
        factors.push({ name: 'Savings Rate', status: 'Very Good', points: 25 });
    } else if (savingsRatio >= 20) {
        score += 20;
        factors.push({ name: 'Savings Rate', status: 'Good', points: 20 });
    } else if (savingsRatio >= 10) {
        score += 10;
        factors.push({ name: 'Savings Rate', status: 'Fair', points: 10 });
    } else {
        score += 5;
        factors.push({ name: 'Savings Rate', status: 'Needs Improvement', points: 5 });
    }

    // Factor 2: Emergency Fund (0-35 points)
    if (emergencyFund >= 12) {
        score += 35;
        factors.push({ name: 'Emergency Fund', status: 'Excellent (12+ months)', points: 35 });
    } else if (emergencyFund >= 6) {
        score += 30;
        factors.push({ name: 'Emergency Fund', status: 'Very Good (6-12 months)', points: 30 });
    } else if (emergencyFund >= 3) {
        score += 20;
        factors.push({ name: 'Emergency Fund', status: 'Adequate (3-6 months)', points: 20 });
    } else if (emergencyFund >= 1) {
        score += 10;
        factors.push({ name: 'Emergency Fund', status: 'Insufficient (1-3 months)', points: 10 });
    } else {
        score += 0;
        factors.push({ name: 'Emergency Fund', status: 'Critical (< 1 month)', points: 0 });
    }

    // Factor 3: Monthly Surplus (0-20 points)
    if (surplus > income * 0.5) {
        score += 20;
        factors.push({ name: 'Monthly Surplus', status: 'Excellent (>50%)', points: 20 });
    } else if (surplus > income * 0.3) {
        score += 15;
        factors.push({ name: 'Monthly Surplus', status: 'Very Good (30-50%)', points: 15 });
    } else if (surplus > income * 0.2) {
        score += 10;
        factors.push({ name: 'Monthly Surplus', status: 'Good (20-30%)', points: 10 });
    } else if (surplus > 0) {
        score += 5;
        factors.push({ name: 'Monthly Surplus', status: 'Minimal (<20%)', points: 5 });
    } else {
        score += 0;
        factors.push({ name: 'Monthly Surplus', status: 'Deficit', points: 0 });
    }

    // Factor 4: Expense Ratio (0-15 points)
    const expenseRatio = (expenses / income) * 100;
    if (expenseRatio < 40) {
        score += 15;
        factors.push({ name: 'Expense Control', status: 'Excellent (<40%)', points: 15 });
    } else if (expenseRatio < 60) {
        score += 10;
        factors.push({ name: 'Expense Control', status: 'Good (40-60%)', points: 10 });
    } else if (expenseRatio < 80) {
        score += 5;
        factors.push({ name: 'Expense Control', status: 'Fair (60-80%)', points: 5 });
    } else {
        score += 0;
        factors.push({ name: 'Expense Control', status: 'Poor (>80%)', points: 0 });
    }

    // Determine overall label
    let label, color, recommendation;
    if (score >= 85) {
        label = 'Excellent';
        color = 'green';
        recommendation = 'You are in great financial shape! Ready for aggressive wealth building.';
    } else if (score >= 70) {
        label = 'Very Good';
        color = 'lightgreen';
        recommendation = 'Strong financial foundation. Ready to start investing systematically.';
    } else if (score >= 55) {
        label = 'Good';
        color = 'yellow';
        recommendation = 'Decent position. Focus on building emergency fund before aggressive investing.';
    } else if (score >= 40) {
        label = 'Fair';
        color = 'orange';
        recommendation = 'Needs improvement. Prioritize expense reduction and emergency savings.';
    } else {
        label = 'Needs Attention';
        color = 'red';
        recommendation = 'Critical: Focus on financial stability before investing.';
    }

    return {
        score: Math.round(score),
        label,
        color,
        recommendation,
        factors,
        metrics: {
            savingsRatio: savingsRatio.toFixed(1),
            emergencyFundMonths: emergencyFund.toFixed(1),
            monthlySurplus: surplus,
            expenseRatio: expenseRatio.toFixed(1)
        }
    };
}

/**
 * Calculate required monthly SIP for a goal
 * Uses compound interest formula: FV = P × [(1 + r)^n - 1] / r × (1 + r)
 */
export function calculateSIP(targetAmount, years, riskProfile = 'Balanced') {
    // Expected returns based on risk profile
    const returns = {
        'Conservative': 0.08,  // 8% (mostly debt)
        'Balanced': 0.11,      // 11% (balanced equity-debt)
        'Aggressive': 0.13     // 13% (mostly equity)
    };

    const annualRate = returns[riskProfile] || 0.11;
    const monthlyRate = annualRate / 12;
    const months = years * 12;

    // SIP Formula: P = FV / [((1+r)^n - 1) / r × (1+r)]
    const factor = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const monthlySIP = targetAmount / factor;

    return {
        monthly: Math.round(monthlySIP),
        total: Math.round(monthlySIP * months),
        expectedReturn: Math.round(targetAmount - (monthlySIP * months)),
        annualRate: (annualRate * 100).toFixed(1)
    };
}

/**
 * Advanced Asset Allocation based on Age, Risk Profile, and Investment Horizon
 */
export function getAssetAllocation(riskProfile, age, investmentHorizon) {
    let equity, debt, gold;

    // Base allocation by risk profile
    const baseAllocations = {
        'Conservative': { equity: 20, debt: 65, gold: 15 },
        'Balanced': { equity: 50, debt: 35, gold: 15 },
        'Aggressive': { equity: 75, debt: 15, gold: 10 }
    };

    let allocation = baseAllocations[riskProfile] || baseAllocations['Balanced'];

    // Age-based adjustments (Rule of thumb: 100 - age = equity %)
    if (age < 30) {
        // Young investors can take more risk
        allocation.equity = Math.min(allocation.equity + 10, 85);
        allocation.debt = Math.max(allocation.debt - 10, 10);
    } else if (age > 50) {
        // Older investors need more stability
        allocation.equity = Math.max(allocation.equity - 15, 20);
        allocation.debt = Math.min(allocation.debt + 15, 70);
    }

    // Investment horizon adjustments
    if (investmentHorizon < 3) {
        // Short term: reduce equity, increase debt
        allocation.equity = Math.max(allocation.equity - 20, 10);
        allocation.debt = Math.min(allocation.debt + 20, 75);
    } else if (investmentHorizon > 10) {
        // Long term: can afford more equity
        allocation.equity = Math.min(allocation.equity + 10, 80);
        allocation.debt = Math.max(allocation.debt - 10, 10);
    }

    // Ensure total is 100%
    const total = allocation.equity + allocation.debt + allocation.gold;
    if (total !== 100) {
        const diff = 100 - total;
        allocation.debt += diff; // Adjust debt to balance
    }

    // Breakdown by sub-categories
    const breakdown = {
        equity: {
            total: allocation.equity,
            largeCap: Math.round(allocation.equity * 0.5),
            midCap: Math.round(allocation.equity * 0.3),
            smallCap: Math.round(allocation.equity * 0.2)
        },
        debt: {
            total: allocation.debt,
            liquidFunds: Math.round(allocation.debt * 0.3),
            shortDuration: Math.round(allocation.debt * 0.4),
            longDuration: Math.round(allocation.debt * 0.3)
        },
        gold: {
            total: allocation.gold,
            digitalGold: Math.round(allocation.gold * 0.6),
            sgb: Math.round(allocation.gold * 0.4)
        }
    };

    return {
        equity: allocation.equity,
        debt: allocation.debt,
        gold: allocation.gold,
        breakdown,
        rationale: generateAllocationRationale(age, riskProfile, investmentHorizon, allocation)
    };
}

/**
 * Generate rationale for asset allocation
 */
function generateAllocationRationale(age, risk, horizon, allocation) {
    const reasons = [];

    if (age < 30) {
        reasons.push(`At ${age} years, you have time to ride out market volatility`);
    } else if (age > 50) {
        reasons.push(`At ${age} years, capital preservation becomes more important`);
    }

    if (risk === 'Aggressive') {
        reasons.push('Your aggressive risk profile allows for higher equity exposure');
    } else if (risk === 'Conservative') {
        reasons.push('Your conservative approach prioritizes stability over growth');
    }

    if (horizon > 10) {
        reasons.push(`${horizon}+ year horizon enables equity-heavy strategy`);
    } else if (horizon < 3) {
        reasons.push(`Short ${horizon}-year timeline requires debt focus`);
    }

    return reasons.join('. ') + '.';
}

/**
 * Calculate total monthly investment needed for all goals
 */
export function calculateTotalMonthlyInvestment(goals, riskProfile) {
    return goals.reduce((total, goal) => {
        const sip = calculateSIP(goal.amount, goal.years, riskProfile);
        return total + sip.monthly;
    }, 0);
}

/**
 * Analyze goal feasibility
 */
export function analyzeGoalFeasibility(goal, availableSurplus, riskProfile) {
    const required = calculateSIP(goal.amount, goal.years, riskProfile);
    const feasible = required.monthly <= availableSurplus;
    const gap = feasible ? 0 : required.monthly - availableSurplus;

    return {
        goal: goal.type,
        required: required.monthly,
        feasible,
        gap,
        recommendation: feasible
            ? 'Achievable with current surplus'
            : `Need ₹${gap.toLocaleString()} more per month or extend timeline`
    };
}
