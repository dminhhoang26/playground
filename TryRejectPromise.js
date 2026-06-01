let func1 = () => {
  return new Promise(async (resolve, reject) => {
    reject('Hello')
  })
}

let func2 = async () => {
  try {
    await func1()
  } catch (error) {
    console.log(`error `, error)
  }
}
await func2()
