// Date functions

// Get date from bootstrap-datepicker
export function getDate(date) {
  const rawDate = new Date(date);
  const z = rawDate.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(rawDate - z);
  const localDateISO = localDate.toISOString().slice(0, 10);
  return localDateISO;
}

// Format date in `%d %b %y` format
export function formatDate(dateStr) {
  if (dateStr) {
    var date = new Date(dateStr);
    var y = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
    var m = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
    var d = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
    return d + " " + m + " " + y;
  }
};

// Add 8 hours: Convert date from UTC (SP default) to SGT
export function offsetDate(date) {
  const rawDate = new Date(date);
  const z = rawDate.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(rawDate - z);
  return localDate;
};

// Get year
export function getYear(cleanDate) {
  return cleanDate.getFullYear();
};

export function getWorkYear(cleanDate) {
  const year = cleanDate.getFullYear();
  return 'WY ' + (cleanDate.getMonth() <= 3 ? year - 1 : year);
};

// Get quarter
export function getQuarter(cleanDate, year) {
  let qtr = Math.floor((cleanDate.getMonth()) / 3);
  if (qtr === 0) {
    return year + ' Q4';  
  }
  return year + ' Q' + (Math.floor(cleanDate.getMonth() / 3));
};

export function getMonth(cleanDate, year) {
  return year + '-' + String(cleanDate.getMonth() + 1).padStart(2, '0');
};

// Test period equality
export function testPeriodEquality(date, dateOption, period) {
  const endDate = offsetDate(new Date(date));
  const workyear = getWorkYear(endDate);
  const year = getYear(endDate);

  if (period === 'annual') {
    return getWorkYear(endDate) === dateOption;
  } else if (period === 'quarterly') {
    return getQuarter(endDate, workyear) === dateOption;
  } else if (period === 'monthly') {
    return getMonth(endDate, year) === dateOption;
  }
}

// Convert date string into start/end dates
export function quarterToIsoDate(dateStr, isStart) {
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
  } else if (qtr === 'Q4') {
    if (isStart) return `${Number(year)+1}-01-01`;
    return `${Number(year)+1}-03-31`;
  }
}

export function monthToIsoDate(dateStr, isStart) {
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

export function yearToIsoDate(dateStr, isStart) {
  const [, year] = dateStr.split(' ');
  if (isStart) return `${year}-04-01`;
  return `${Number(year) + 1}-03-31`;
}