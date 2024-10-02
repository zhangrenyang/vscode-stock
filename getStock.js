const Crawler = require('crawler');

function getStock(stockCodes, callback) {
    const c = new Crawler({
        maxConnections: 10,
        callback: function (error, res, done) {
            if (error) {
                console.error('获取股票信息失败:', error);
                callback('获取股票信息失败');
            } else {
                const stockData = res.body.split('="')[1].slice(1, -2);
                // 2. 按 ~ 分隔字段
                const stockInfo = stockData.split('~');
                // 3. 提取股票名称、当前价格、涨跌百分比和涨跌额
                const stockName = stockInfo[1]; // 上证指数
                const currentPrice = stockInfo[3]; // 当前价格 3336.50
                const changePercent = stockInfo[32]; // 涨跌百分比 2.35%
                const change = stockInfo[31]; // 涨跌额 14.76
                const color = parseFloat(change) >= 0 ? '$(arrow-up)' : '$(arrow-down)';
                callback(`${color} ${stockName}: ${currentPrice} (${changePercent}%)`);
            }
            done();
        }
    });

    stockCodes.forEach(code => {
        c.queue(`https://qt.gtimg.cn/q=${code}`);
    });
}

module.exports = getStock;