import { dateOptionToInterval, getWorkYear, isStartEndDateInDateOption } from "./dates";

test('dateOptionToStartDate with QTR', () => {
    expect(dateOptionToInterval("WY 2023 Q1")).toEqual({start: new Date("01 Apr 23"), end: new Date("30 Jun 23")});
    expect(dateOptionToInterval("WY 2023 Q2")).toEqual({start: new Date("01 Jul 23"), end: new Date("30 Sep 23")});
    expect(dateOptionToInterval("WY 2023 Q3")).toEqual({start: new Date("01 Oct 23"), end: new Date("31 Dec 23")});
    expect(dateOptionToInterval("WY 2023 Q4")).toEqual({start: new Date("01 Jan 24"), end: new Date("31 Mar 24")});
})

test('overlap in interval', () => {
    expect(isStartEndDateInDateOption(new Date("01 Apr 23"), new Date("25 Aug 23"), "WY 2023 Q1")).toBe(true);
    expect(isStartEndDateInDateOption(new Date("01 Apr 23"), new Date("25 Aug 23"), "WY 2023 Q2")).toBe(true);
    expect(isStartEndDateInDateOption(new Date("01 Apr 23"), new Date("25 Aug 23"), "WY 2023 Q3")).toBe(false);
    expect(isStartEndDateInDateOption(new Date("01 Apr 23"), new Date("25 Aug 23"), "WY 2022 Q4")).toBe(false);
})

test('dateOptionToStartDate with WY', () => {
    expect(dateOptionToInterval("WY 2023")).toEqual({start: new Date("01 Apr 23"), end: new Date("31 Mar 24")});
})

test('dateOptionToStartDate with Year-Month', () => {
    expect(dateOptionToInterval("2023-03")).toEqual({start: new Date("01 Mar 23"), end: new Date("31 Mar 23")});
})

test('getWorkyear', () => {
    expect(getWorkYear(new Date("01 Apr 22"))).toEqual("WY 2022");
    expect(getWorkYear(new Date("31 Mar 22"))).toEqual("WY 2021");
    expect(getWorkYear(new Date("01 Jan 22"))).toEqual("WY 2021");
})