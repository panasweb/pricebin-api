const axios = require('axios');
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
    if (N == 1) return 0; // wrong but then adding a value "works"
    // if (size == 1) return NAN;     // mathematically proper
    // assert(size > 1);              // debug-mode check
    // if(size < 2) throw(...)        // always check
    return (N * average - value) / (N - 1)
}

exports.recalculateWeeks = function(startDate) {
    const today = (new Date()).getTime();
    const start = startDate.getTime();

    const diff = Math.abs(today - start);
    let weeks = Math.max(Math.floor(diff / WEEK_MILISECONDS), 1);
    return weeks;
}

exports.recalculateMonths = function(startDate) {
    const today = new Date();
    const monthsToday = today.getFullYear() * 12 + today.getMonth();
    const monthsBegin = startDate.getFullYear() * 12 + startDate.getMonth();

    return Math.max(monthsToday - monthsBegin, 1);
}

exports.roundTwoDecimals = function(num) {
    return Math.round(num * 100) / 100
}

exports.getPokemonAvatar = async function() {
    const URL = 'https://pokeapi.co/api/v2/pokemon/';
    const id = Math.max(Math.round(Math.random() * 250), 1)

    // Get Request
    try {
        const {data} = await axios.get(URL + id);
        console.log(data);
        return data.sprites.versions['generation-ii'].crystal["front_default"];

    } catch (e) {
        console.error(e);
        //return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/132.png";
        return null;
    }

}

exports.favoriteFromArray = function(objList) {
    // objects are {_id, _count}
    let max;
    let maxCount = -1;
    objList.forEach(o => {
        if (o.count > maxCount) {
            max = o;
            maxCount = o.count;
        }
    })

    return max._id;
}