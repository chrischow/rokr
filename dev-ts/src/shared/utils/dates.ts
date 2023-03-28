import { add, areIntervalsOverlapping } from "date-fns";
// Date functions

// Get date from bootstrap-datepicker
export function getDate(date: string | Date) {
  const rawDate = new Date(date);
  const z = rawDate.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(rawDate.valueOf() - z.valueOf());
  const localDateISO = localDate.toISOString().slice(0, 10);
  return localDateISO;
}

// Format date in `%d %b %y` format
export function formatDate(dateStr: string) {
  if (dateStr) {
    const date = new Date(dateStr);
    const y = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
    const m = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
    const d = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
    return d + " " + m + " " + y;
  }
}

// Add 8 hours: Convert date from UTC (SP default) to SGT
export function offsetDate(date: string | Date) {
  const rawDate = new Date(date);
  const z = rawDate.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(rawDate.valueOf() - z.valueOf());
  return localDate;
}

// Get year
export function getYear(cleanDate: Date) {
  return cleanDate.getFullYear();
}

export function getWorkYear(cleanDate: Date) {
  const year = cleanDate.getFullYear();
  return 'WY ' + (cleanDate.getMonth() < 3 ? year - 1 : year);
}

// Get quarter
export function getQuarter(cleanDate: Date, year: string) {
  let qtr = Math.floor((cleanDate.getMonth()) / 3);
  if (qtr === 0) {
    return year + ' Q4';
  }
  return year + ' Q' + (Math.floor(cleanDate.getMonth() / 3));
}

export function getMonth(cleanDate: Date, year: number | string) {
  return year + '-' + String(cleanDate.getMonth() + 1).padStart(2, '0');
}

export function dateOptionToInterval(dateOption: string): Interval {
  var startDate: Date, endDate: Date;
  var result: Interval = {start: 0, end: 0};
  if (/WY (\d{4}) Q([1-4]{1})/g.test(dateOption)) {
    const regResult = /WY (\d{4}) Q([1-4]{1})/g.exec(dateOption);
    if (regResult)
    {
      startDate = (regResult[2] === "4" ? new Date(parseInt(regResult[1], 10) + 1, 0, 1) : 
                                       new Date(parseInt(regResult[1], 10), parseInt(regResult[2], 10) * 3, 1));
      endDate = add(startDate, {months: 3, days: -1})
      result = {start: startDate, end: endDate};
    }
  } else if (/WY (\d{4})/g.test(dateOption)) {
    const regResult = /WY (\d{4})/g.exec(dateOption);
    if (regResult)
    {
      startDate = new Date(parseInt(regResult[1], 10), 3, 1);
      endDate = new Date(parseInt(regResult[1], 10) + 1, 2, 31);
      result = {start: startDate, end: endDate};
    }
  } else if (/(\d{4})-(\d{2})/g.test(dateOption)) {
    const regResult = /(\d{4})-(\d{2})/g.exec(dateOption);
    if (regResult)
    {
      startDate = new Date(parseInt(regResult[1], 10), parseInt(regResult[2],10) - 1, 1);
      endDate = add(startDate, {months: 1, days: -1})
      result = {start: startDate, end: endDate};
    }
  }
  return result;
}

export function isStartEndDateInDateOption(startDate: Date, endDate: Date, dateOption: string): Boolean {
  return areIntervalsOverlapping({start: startDate, end: endDate}, dateOptionToInterval(dateOption), {inclusive: true});
}

// Test period equality
export function testPeriodEquality(dateStart: string, dateEnd: string, dateOption: string, period: string) {
  const startDate = offsetDate(new Date(dateStart));
  const endDate = offsetDate(new Date(dateEnd));
  const workyear = getWorkYear(endDate);
  const year = getYear(endDate);

  if (period === 'annual') {
    return getWorkYear(endDate) === dateOption;
  } else if (period === 'quarterly') {
    return isStartEndDateInDateOption(startDate, endDate, dateOption);
  } else if (period === 'monthly') {
    return getMonth(endDate, year) === dateOption;
  }
}

// Convert date string into start/end dates
export function quarterToIsoDate(dateStr: string, isStart: boolean): string {
  const [, year, qtr] = dateStr.split(' ');
  if (qtr === 'Q1') {
    if (isStart) return `${year}-04-01`;
    return `${year}-06-30`;
  } else if (qtr === 'Q2') {
    if (isStart) return `${year}-07-01`;
    return `${year}-09-30`;
  } else if (qtr === 'Q3') {
    if (isStart) return `${year}-10-01`;
    return `${year}-12-31`;
  } else {
    // (qtr === 'Q4') 
    if (isStart) return `${Number(year) + 1}-01-01`;
    return `${Number(year) + 1}-03-31`;
  }
}

export function monthToIsoDate(dateStr: string, isStart: boolean) {
  const [year, mth] = dateStr.split('-');
  if (isStart) return `${dateStr}-01`;
  if ([1, 3, 5, 7, 8, 10, 12].includes(Number(mth))) {
    return `${dateStr}-31`;
  } else if (Number(mth) === 2) {
    if (((Number(year) % 4 === 0) && (Number(year) % 100 !== 0)) || (Number(year) % 400 === 0)) {
      return `${dateStr}-29`;
    } else {
      return `${dateStr}-28`;
    }
  } else {
    return `${dateStr}-30`;
  }
}

export function yearToIsoDate(dateStr: string, isStart: boolean) {
  const [, year] = dateStr.split(' ');
  if (isStart) return `${year}-04-01`;
  return `${Number(year) + 1}-03-31`;
}