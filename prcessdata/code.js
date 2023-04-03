const data = require('./data')
const dbdata = require('./dbdata')
const jsondt = require('./parsedcsvdt')
const courseDt = require('./courseDt')

// let datas = data.data()
// let mapped = datas?.map(x => {
//   return {
//     ...x,
//     assignments: x.assignments?.map(y => y.id)
//   }
// })
// let groupIds = datas?.map(x => x.id)

// let dbdts = dbdata.data()
// let dbdtsMapped = dbdts.assignmentGroups?.map(x => {
//   return {
//     id: x.id,
//     name: x.name,
//     assignmentIds: x?.assignments,
//     assignmentCount: x?.assignments?.length,
//   }
// })
// let dbdtsIds = dbdts?.assignmentGroups?.map(x => x.id)
// console.log('dbdtsIds?.length != groupIds?.length', dbdtsIds?.length, groupIds?.length)
// if (dbdtsIds?.length != groupIds?.length) {
//   console.log('not the same dbdtsIds?.length != groupIds?.length', dbdtsIds?.length, groupIds?.length)
// }
// let dbdtsIdsNotIncludes = dbdts?.assignmentGroups?.filter(x => !groupIds?.includes(x.id))

// console.log(`mapped `, JSON.stringify(mapped, null, 2))
// console.log(`groupIds `, JSON.stringify(groupIds, null, 2))
// console.log(`dbdtsNames `, JSON.stringify(dbdts?.assignmentGroups?.map(x => x.name), null, 2))
// console.log(`dbdtsMapped `, JSON.stringify(dbdtsMapped, null, 2))
// console.log(`dbdtsIdsNotIncludes `, JSON.stringify(dbdtsIdsNotIncludes, null, 2))

// let jsdt = jsondt.data()
// console.log(`jsdt `, jsdt[0])

// let programsInfo = jsdt?.map(x => {
//   return {
//     studentSidId: x.sisId,
//     programsInfo: JSON.parse(x.programsInfo),
//   }
// })
// console.log(`programsInfo[0] `, JSON.stringify(programsInfo[0], null, 2))

// let output = programsInfo?.filter(x => x.programsInfo?.find(info => info?.M?.courses?.L?.find(
//   course => course?.M?.displayResults?.L?.find(
//     displayResult => displayResult?.M?.results?.L?.find(
//       y => y?.L?.find(
//         result => result?.M?.name?.S?.indexOf('  ') >= 0))))))

// let mappedOutput = output?.map(x => { return {
//   studentSidId: x.studentSidId,
//   programsInfo: x.programsInfo?.map(programInfo => { return {
//     courses: programInfo.M.courses?.L?.map(course => { return {
//       name: `name(${course.M.name.S}) - sisId(${course.M.sisId.S}) - id(${course.M.id.S})`,
//       displayResults: course.M.displayResults?.L?.map(displayResult => { return {
//         results: displayResult?.M?.results?.L?.map(result => { return {
//           result: result.L?.filter(r => r.M.name.S?.indexOf('  ') >= 0)?.map(r => r.M.name.S)
//         }})
//       }})
//     }})
//   }}),
// }})
// mappedOutput = mappedOutput.map(x => {
//   return {
//     studentSidId: x.studentSidId,
//     programsInfo: x.programsInfo?.map(p => { return {
//       courses: p.courses?.map(c => { return {
//         name: c.name,
//         displayResults: c.displayResults?.filter(d => d?.length > 0)?.map(d => d)
//           // ?.map(d => { return {
//           //   results: d.results?.filter(res => res.result?.length > 0)?.map(res => res.result)
//           // }})
//       }})
//     }}),
//   }
// })
// mappedOutput = mappedOutput?.filter(x => x.displayResults?.length > 0 && x.displayResult?.find(y => y.results?.find(r => r.result?.length > 0)))
// mappedOutput = mappedOutput?.filter(
//   mapped => mapped.programsInfo.filter(
//     p => p.courses?.filter(c => c.displayResults?.length > 0))
// )
// console.log(`output `, JSON.stringify(mappedOutput, null, 2))

let coursesGroup = courseDt.data()

// let allDisplayResults = coursesGroup?.flatMap(course =>
//   course.displayResults?.filter(displayResult =>
//     displayResult.style == 'grade' && displayResult?.results?.length > 0))
let displayResults = coursesGroup[0].displayResults?.filter(displayResult =>
  displayResult?.style == 'grade' && displayResult?.results?.length > 0)

let allRes = displayResults?.flatMap(displayResult =>
  displayResult?.results[0]?.filter(result => (!result.heading && !Number.isNaN(+result.gradeNumber))))

console.log(`allRes `, JSON.stringify(allRes, null, 2))
