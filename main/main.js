'use strict';

function printReceipt(inputs) {
  let bacode = countBarcodes(inputs);
  let items = getItems(bacode);
  console.log(getReceipt(items));
}

function countBarcodes(barcodes) {
  let barcode = barcodes.reduce(function (barcodes, barcode) {
    if (barcode in barcodes) barcodes[barcode]++;
    else barcodes[barcode] = 1;
    return barcodes;
  }, {})
  return barcode;
}

function getItems(barcode) {
  let items = [];
  let data = loadAllItems();
  for (let attr in barcode) {
    // 如果barcode在data中未找到，count为0
    let obj = { id: attr, name: attr, count: 0, price: 0, unit: '' };
    let i;
    for (i = 0; i < data.length; i++) {
      if (attr == data[i].barcode) {
        obj.count = barcode[attr];
        obj.name = data[i].name;
        obj.price = data[i].price;
        obj.unit = data[i].unit;
        break;
      }
    }
    items.push(obj);
  }
  return items;
}

function getReceipt(items) {
  let receipt = "***<没钱赚商店>收据***\n";
  let error = false;
  let errorMessage = "[ERROR]:";
  let money = 0;
  items.forEach(item => {
    // 出错了
    if (item.count == 0) {
      error = true;
      errorMessage += item.id + ","
    }
    if (!error) {
      money += item.count * item.price;
      receipt += `名称：${item.name}，数量：${item.count}${item.unit}，单价：${item.price}.00(元)，小计：${item.price*item.count}.00(元)` + "\n";
    }
  });
  if (!error) {
    receipt += "----------------------\n";
    receipt += "总计：" + money + ".00(元)\n";
    receipt += "**********************";
    return receipt;
  } else {
    errorMessage = errorMessage.substring(0, errorMessage.length - 1) + " are invalid barcodes.";
    return errorMessage;
  }
}

module.exports = {
  printReceipt
}
