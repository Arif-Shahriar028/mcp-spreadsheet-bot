export function extractStructuredData(values) {
    const individualBazarSummaryInTaka = {};
    const expenseDetails = [];
    const mealTracker = [];
    // Contribution Summary from rows 3-8 (index 2-7), cols B (1) and C (2)
    for (let i = 2; i <= 7; i++) {
        const name = values[i]?.[1];
        const amount = values[i]?.[2];
        if (name && amount) {
            individualBazarSummaryInTaka[name] = amount;
        }
    }
    // Expense Details from rows 3-15 (index 2-14), cols F (5), G (6), H (7)
    for (let i = 2; i <= 100; i++) {
        const date = values[i]?.[5];
        const name = values[i]?.[6];
        const price = values[i]?.[7];
        if (date && name && price) {
            expenseDetails.push({ date, name, price });
        }
    }
    // Meal Tracker starts from col J (index 9), header on row 3 (index 2)
    // const mealHeader = values[2]?.slice(9); // row 3 from column J onwards
    // for (let i = 3; i < values.length; i++) {
    //   const row = values[i]?.slice(9);
    //   const date = row?.[0];
    //   const mealType = row?.[1];
    //   if (!date || !mealType) continue;
    //   const participants = mealHeader?.slice(2).map((name, idx) => ({
    //     name,
    //     status: row?.[idx + 2] || '',
    //   }));
    //   mealTracker.push({
    //     date,
    //     mealType,
    //     participants,
    //   });
    // }
    let totalRow;
    for (const row of values.reverse()) {
        if (row.includes("Total") && !row.includes("Grand Total")) {
            totalRow = row;
            break;
        }
    }
    if (!totalRow) {
        console.error("Total row not found.");
        return {};
    }
    // Columns: J=9, K=10, L=11, M=12, N=13, O=14, P=15
    // Indexing adjusted since we sliced from column 9 when reading meal data.
    const mealCounts = {
        Fahim: parseFloat(totalRow[11]) || 0,
        Nahid: parseFloat(totalRow[12]) || 0,
        Rifat: parseFloat(totalRow[13]) || 0,
        Akhter: parseFloat(totalRow[14]) || 0,
        "Arif Vaiya": parseFloat(totalRow[15]) || 0,
    };
    return {
        individualBazarSummaryInTaka,
        expenseDetails,
        mealCounts,
    };
}
