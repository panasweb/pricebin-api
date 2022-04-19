const axios = require('axios').default;

const CC_API_KEY = process.env.CC_API_KEY;

const formatAmount = (x) => Math.round(x * 100) / 100;

const URL_GET = (fromCurrency, toCurrency) => `https://free.currconv.com/api/v7/convert?q=${fromCurrency}_${toCurrency}&compact=ultra&apiKey=${CC_API_KEY}`

exports.getCurrencyRate = async (req, res) => {
    let { amount, fromCurrency, toCurrency } = req.body;
    
    if (!fromCurrency || !toCurrency) {
        res.status(400).send("Missing conversion parameters");
        return;
    }

    fromCurrency = encodeURIComponent(fromCurrency);
    toCurrency = encodeURIComponent(toCurrency);

    let url = URL_GET(fromCurrency, toCurrency);
    console.log("get", url);


    
    axios.get(url)
        .then(response => {
            const {data} = response;
            console.log('response', data);  // response is already parsed
            let query = `${fromCurrency}_${toCurrency}`

            if (!data[query]) {
                res.status(404).send("Conversion rate not found for " + query);
                return;
            } else {

                if (amount) {
                    let converted = formatAmount(amount * data[query]);
                    data.amount = converted;
                }

                res.send(data);
            }

        })
        .catch(err => {
            console.log("CC API Get request error");
            res.status(500).send(err);
        })

}

exports.getConvertedAmount = async (req, res) => {
    let { amount, fromCurrency, toCurrency } = req.body;
    console.log(amount, fromCurrency, '->', toCurrency);

    let url = URL_GET(fromCurrency, toCurrency);

    https.get(url)
        .then(res => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            })

            res.on('end', () => {
                try {
                    let jsonObj = JSON.parse(body);
                    let query = `${fromCurrency}_${toCurrency}`
                    let rate = jsonObj[query];

                    if (rate) {
                        let converted = rate * amount;
                        res.send(formatAmount(converted));
                    }
                    else {

                        res.status(404).send('Rate not found for', query);
                    }

                } catch (err) {
                    res.status(500).send("CC API Response parse error");
                }
            });
        })
        .catch(err => {
            console.log("CC API Get request error");
            res.status(500).send(err);
        })
}

