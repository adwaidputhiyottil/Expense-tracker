const Expense = require('../models/Expense');

// @desc    Analyze user expenses and give a better plan
// @route   GET /api/analysis
// @access  Private
exports.analyzeExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id });

        if (expenses.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    message: "No expenses found yet. Start tracking to get an analysis!",
                    plan: []
                }
            });
        }

        const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        
        // Group by category
        const categoryTotals = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        const insights = [];
        const recommendations = [];

        Object.keys(categoryTotals).forEach(cat => {
            const percentage = (categoryTotals[cat] / total) * 100;
            insights.push({
                category: cat,
                amount: categoryTotals[cat],
                percentage: percentage.toFixed(2)
            });

            // Some basic rule-based logic for recommendations
            if (cat === 'Shopping' && percentage > 25) {
                recommendations.push("Your Shopping expenses are quite high (over 25% of total). Consider setting a monthly limit for non-essential items.");
            }
            if (cat === 'Entertainment' && percentage > 20) {
                recommendations.push("Entertainment is taking up a significant portion of your budget. Lookout for free local events or subscription consolidations.");
            }
            if (cat === 'Food' && percentage > 40) {
                recommendations.push("Food expenses are high. Try meal prepping or reducing dining out to save more.");
            }
        });

        if (recommendations.length === 0) {
            recommendations.push("Your spending seems balanced! Keep tracking to stay on top of your finances.");
        }

        res.status(200).json({
            success: true,
            data: {
                totalExpense: total,
                breakdown: insights,
                recommendations: recommendations,
                plan: "Based on your spending, we suggest a 50/30/20 rule: 50% for Needs (Bills, Food, Transport), 30% for Wants (Shopping, Entertainment), and 20% for Savings."
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
