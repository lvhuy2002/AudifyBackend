function insertElement(str) {
    
    return str.slice(0, 8) + '-' + str.slice(8, 12) + '-' + str.slice(12, 16) + '-' + str.slice(16, 20) + '-' + str.slice(20);
}
console.log(insertElement("e1469890b32e4dfdbfb32e52d98c777b"))