exports.calculateTotal = function (list) {
    
    let total = 0;

    list.forEach(listRecord => {
        let {amount, quantity} = listRecord;
        total += amount * quantity;
    });

    return total;
}