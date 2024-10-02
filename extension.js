const vscode = require('vscode');
const getStock = require('./getStock');

let statusBarItem;
let timer;

function activate(context) {
    console.log('股票插件已激活');

    // 注册开始命令
    let startDisposable = vscode.commands.registerCommand('vscode-stock.start', function () {
        console.log('执行 vscode-stock.start 命令');
        startStockInfo();
    });

    context.subscriptions.push(startDisposable);

    // 注册停止命令
    let stopDisposable = vscode.commands.registerCommand('vscode-stock.stop', function () {
        console.log('执行 vscode-stock.stop 命令');
        stopStockInfo();
    });

    context.subscriptions.push(stopDisposable);

    // 创建状态栏项
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.command = 'vscode-stock.stop';
    context.subscriptions.push(statusBarItem);

    // 添加配置变更监听
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('stockExtension')) {
            console.log('股票插件配置已更改');
            if (timer) {
                stopStockInfo();
                startStockInfo();
            }
        }
    }));

    console.log('股票插件命令已注册');
}

function startStockInfo() {
    const config = vscode.workspace.getConfiguration('stockExtension');
    const updateTime = config.get('updateTime');

    statusBarItem.show();

    updateStockInfo();
    timer = setInterval(updateStockInfo, updateTime);
}

function updateStockInfo() {
    const config = vscode.workspace.getConfiguration('stockExtension');
    const stockCodes = config.get('stockCode').split(',').map(code => code.trim());

    getStock(stockCodes, (stockInfo) => {
        statusBarItem.text = stockInfo;
        statusBarItem.tooltip = '点击关闭股票信息';
    });
}

function stopStockInfo() {
    if (timer) {
        clearInterval(timer);
    }
    statusBarItem.hide();
}

function deactivate() {
    stopStockInfo();
}

module.exports = {
    activate,
    deactivate
};