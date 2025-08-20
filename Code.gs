function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Cash Flow Tools")
    .addItem("Generate Calendar", "generateCalendar")
    .addToUi();
}

function fetchTransactions() {
  const url = "https://avery-app-ai.onrender.com/transactions"; //api
  const response = UrlFetchApp.fetch(url, { method: "get" });
  const parsed = JSON.parse(response.getContentText());
  return parsed.data;
}

function generateCalendar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const transactions = fetchTransactions();

  //toggle transactions by month/year
  const settingsSheet = ss.getSheetByName("Optional Settings");
  //if month year is in setting sheet, use the values
  let month, year;
  if (settingsSheet) {
    month = Number(settingsSheet.getRange("B1").getValue()) - 1; // JS months 0-11
    year = Number(settingsSheet.getRange("B2").getValue());
  } else {
    const today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
  }

   //allows toggling of the starting balance if there's a starting balance value in the settings sheet
  let startingBalance = 2000; // default
  if (settingsSheet) {
    const val = settingsSheet.getRange("B3").getValue();
    if (!isNaN(val)) startingBalance = Number(val);
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let sheet = ss.getSheetByName("Cash Flow Calendar");
  if (!sheet) {
    sheet = ss.insertSheet("Cash Flow Calendar");
  } else {
    sheet.clear();
  }

  // Header
  sheet.appendRow(["Date", "Income", "Expenses", "Starting Balance", "Ending Balance"]);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayTx = transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate.getFullYear() === year &&
        txDate.getMonth() === month &&
        txDate.getDate() === day;
    });


    const income = dayTx.filter(t => t.amount > 0).reduce((a, b) => a + Number(b.amount), 0);
    const expenses = dayTx.filter(t => t.amount < 0).reduce((a, b) => a + Number(b.amount), 0);

    const endingBalance = startingBalance + income + expenses;

    sheet.appendRow([date, income, expenses, startingBalance, endingBalance]);

    startingBalance = endingBalance;
  }

  // Highlight negative balances in red
  const range = sheet.getRange(2, 5, daysInMonth);
  const rule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0)
    .setBackground('#FF0000')
    .setRanges([range])
    .build();
  const rules = sheet.getConditionalFormatRules();
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);

  // Line chart of ending balance
  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(sheet.getRange(1, 1, daysInMonth + 1, 5))
    .setPosition(2, 7, 0, 0)
    .build();
  sheet.insertChart(chart);
}
