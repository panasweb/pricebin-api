const WEEK_MILISECONDS = 1000 * 60 * 60 * 24 * 7;

exports.calculateTotal = function (list) {
    
    let total = 0;

    list.forEach(listRecord => {
        let {amount, quantity} = listRecord;
        total += amount * quantity;
    });

    return total;
}

exports.addToAverage = function (average, N, value) {
    return (N * average + value) / (N+1);
}

exports.removeFromAverage = function(average, N, value) {
    if (size == 1) return 0; // wrong but then adding a value "works"
    // if (size == 1) return NAN;     // mathematically proper
    // assert(size > 1);              // debug-mode check
    // if(size < 2) throw(...)        // always check
    return (N * average - value) / (N - 1)
}

exports.recalculateWeeks = function(startDate) {
    const today = (new Date()).getTime();
    const start = startDate.getTime();

    const diff = Math.abs(today - start);
    
    return Math.max(Math.floow(diff, WEEK_MILISECONDS), 1);
}

exports.recalculateMonths = function(startDate) {
    const today = new Date();
    const monthsToday = today.getFullYear() * 12 + today.getMonth();
    const monthsBegin = startDate.getFullYear() * 12 + startDate.getMonth();

    return Math.max(monthsToday - monthsBegin, 1);
}