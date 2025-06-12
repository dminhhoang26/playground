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