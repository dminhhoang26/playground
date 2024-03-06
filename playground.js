let case1 = () => {
  let tmpObj = {'abc': null}
  console.log(`1111 `, )
  for (const [key, student] of Object.entries(tmpObj)) {
    console.log(`key `, key)
    console.log(`student`, student)
  }
}

let regexTest = () => {
  let regex = /[(]\d[)]/
  let str = '(12)'
  str.match(regex) ? console.log(`ok `, ) : console.log('false')
}
regexTest()
