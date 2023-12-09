const info = _string => {
  console.log('\x1b[36m%s\x1b[0m', '[INFO] :: ' + _string)
}

const warn = _string => {
  console.log('\x1b[33m%s\x1b[0m', '[WARN] :: ' + _string)
}

const error = _string => {
  console.log('\x1b[31m%s\x1b[0m', '[ERROR] :: ' + _string)
}

export { info, warn, error }
