import {formatDate} from 'utils/misc'

test('formatDate formats the date to look nice', () => {
	let date = formatDate(1634585020516)
	expect(date).toBe('Oct 21')
	date = formatDate(new Date('Jan 22, 2021'))
	expect(date).toBe('Jan 21')
})

