const dayjs = require('dayjs')
dayjs.extend(require('dayjs/plugin/updateLocale'))
dayjs.extend(require('dayjs/plugin/utc'))
dayjs.extend(require('dayjs/plugin/timezone'))
dayjs.extend(require('dayjs/plugin/localizedFormat'))
dayjs.extend(require('dayjs/plugin/relativeTime'))
dayjs.extend(require('dayjs/plugin/customParseFormat'))
dayjs.extend(require('dayjs/plugin/weekday'))

dayjs.locale('vi')

dayjs.updateLocale('vi', {
  weekdaysShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
})

const t1 = () => {
  const dt = dayjs.utc().startOf('month')
  for (let i = 0; i < 7; i++) {
    console.log(
      dt.day(i).format('ddd')
    )
  }

  console.log(dayjs.utc().startOf('month').format())
  const s = []
  const WEEKDAYS = Array.from({ length: 7 }, (_, i) => i).reduce((previousValue, currentValue) => {
    console.log(previousValue, currentValue)
    // previousValue.push(dayjs().weekday(currentIndex).format('ddd'))
    previousValue.push(dayjs().weekday(currentValue).format('ddd'))
    return previousValue
  }, [])
  console.log(Array.from({ length: 7 }, (_, i) => dayjs().weekday(i).format('ddd')))

  console.log(Math.ceil(36 / 7))
}

const t2 = () => {
  // Chuyển sang Asia/Ho_Chi_Minh và Asia/Hong_Kong
  console.log(`current date ${dayjs().local().format()} `)
  // 2025-06-12T21:46:33+07:00
  const t = '2025-06-12T21:46:33+07:00'

  console.log('---origin---')

  console.log(`t ${t} -> ${dayjs(t).tz('Asia/Hong_Kong', false).format('L LTS')}`)

  console.log('---converted---')

  const rex = /([+-]\d{2}:\d{2}|Z)$/
  const replaced = t.replace(rex, "")
  console.log(`replaced ${replaced} ${dayjs(t).format()}`)

  const utc = dayjs.utc()
  console.log(`utc ${utc.format()} ${utc.format()}`)

  const dt = dayjs(replaced)
  console.log(`dt ${dt.format()} ${dt.toISOString()}`)
  const dt2 = dayjs.tz(replaced, 'Asia/Ho_Chi_Minh')
  console.log(`dt2 ${dt2.format()}  ${dt2.toISOString()}`)
  const dt3 = dayjs.tz(replaced, 'Asia/Hong_Kong')
  console.log(`dt3 ${dt3.format()}  ${dt3.toISOString()}`)
}

t2()
