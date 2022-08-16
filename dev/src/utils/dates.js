// Date functions

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
  return year + ' Q' + (Math.floor((cleanDate.getMonth() + 1) / 3));
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