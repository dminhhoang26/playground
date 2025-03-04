const dayjs = require('dayjs')
dayjs.extend(require('dayjs/plugin/updateLocale'))
dayjs.extend(require('dayjs/plugin/utc'))
dayjs.extend(require('dayjs/plugin/timezone'))
dayjs.extend(require('dayjs/plugin/localizedFormat'))
dayjs.extend(require('dayjs/plugin/relativeTime'))
dayjs.extend(require('dayjs/plugin/customParseFormat'))

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