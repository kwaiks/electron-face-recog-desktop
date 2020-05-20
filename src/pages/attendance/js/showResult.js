const users = require('./users.json');

const ulId = "results-list"

var resultList;

function showResult(results){
    const resultDiv = document.getElementById('results');
    const ul = document.getElementById(ulId);
    if(ul){
        ul.parentNode.removeChild(ul)
    }
    let data = filterUser(results);
    console.log('ini data')
    console.log(data)
    resultList = document.createElement('ul');
    resultList.id = ulId;
    resultDiv.append(resultList)
    data.forEach(d=>{
        let resultsItem = document.createElement('li');
        resultsItem.id = d['id']
        resultList.append(resultsItem)
        createList(d,resultsItem);
    })
}

function filterUser(code){
    let results = []
    code.forEach(d=>{
      let x = users.find(e=>e['NIP'] == d)
      console.log(x)
      if(x) results.push(x)
    })
    return results
}

function createList(data,listDiv){
    let list = document.createElement('ul')
    list.className = "item-list"
    listDiv.append(list);
    let itemList1 = document.createElement('li')
    itemList1.innerHTML = data['name']
    list.append(itemList1);
    let itemList2 = document.createElement('li')
    itemList2.innerHTML = data['NIP'];
    list.append(itemList2)
}

module.exports = {
    showResult
}