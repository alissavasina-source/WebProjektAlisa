const fs = require('fs');
const path = require('path');
const config = require('../config/config');

function filePath(name) {
  return path.join(config.dataDir, `${name}.json`);
}

function read(name, fallback = []) {
  const fp = filePath(name);
  if (!fs.existsSync(fp)) {
    write(name, fallback);
    return fallback;
  }
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function write(name, data) {
  const fp = filePath(name);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
}

function findById(name, id) {
  return read(name).find((item) => item.id === id);
}

function upsert(name, item) {
  const items = read(name);
  const index = items.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }
  write(name, items);
  return item;
}

function remove(name, id) {
  const items = read(name).filter((i) => i.id !== id);
  write(name, items);
}

module.exports = { read, write, findById, upsert, remove };
