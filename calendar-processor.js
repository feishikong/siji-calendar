/**
 * CalendarProcessor - Handles conversions for the Solar Calendar system.
 * - This system utilizes 13 months, each containing 28 days (4 weeks starting Monday).
 * - The year commences on the first Monday occurring on or after the Vernal Equinox.
 * - Includes 'Year Day' (Day 365) and 'Leap Day' (Day 366) outside the standard months.
 * - Vernal Equinox data determines the anchor point for each year.
 */
class CalendarProcessor {
  constructor() {
    // Current 13-month structure
    this.calendarStructure = [
      { name: 'Ichika', days: 28, startDay: 1 },
      { name: 'Futaba', days: 28, startDay: 29 },
      { name: 'Mikasa', days: 28, startDay: 57 },
      { name: 'Yotsuba', days: 28, startDay: 85 },
      { name: 'Itsuki', days: 28, startDay: 113 },
      { name: 'Mutsumi', days: 28, startDay: 141 },
      { name: 'Nanako', days: 28, startDay: 169 },
      { name: 'Yabuki', days: 28, startDay: 197 },
      { name: 'Kokoro', days: 28, startDay: 225 },
      { name: 'Tobira', days: 28, startDay: 253 },
      { name: 'Toichi', days: 28, startDay: 281 },
      { name: 'Tofuro', days: 28, startDay: 309 },
      { name: 'Tomita', days: 28, startDay: 337 } // Ends on day 365
    ];

    this.gregorianMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.dayNamesFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.firstDayOfYear = {};
    this.lunarDay = {}
    this.sunCalc = {};
    this.jerusalemNewMoon = {}; // Populated by loadAstronomicalData
    this.newMoonData = {}; // Populated by loadAstronomicalData
    this.vernalEquinoxData = {}; // Populated by loadAstronomicalData
    this.summerSolsticeData = {}; // Populated by loadAstronomicalData
    this.fallEquinoxData = {}; // Populated by loadAstronomicalData
    this.winterSolsticeData = {}; // Populated by loadAstronomicalData
    this.solarYearStartDateCache = {}; // Cache for Gregorian start date of each Solar year
    this.astronomicalEventCache = {}; // Cache for approximate astronomical event dates (Gregorian)
    this.locationVisibility = { latitude: 31.78902, longitude: 35.20108 };
  }

  /**
   * Load astronomical data from the JSON source. This defines the year's anchor point.
   */
  async loadAstronomicalData() {
    try {
      this.sunCalc = await import('https://cdn.skypack.dev/suncalc2');
      const response = await fetch('https://feishikong.github.io/Shisan-calendar/data/equinoxes-and-solstices/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      this.vernalEquinoxData = data.reduce((acc, entry) => {
        const year = parseInt(entry.year, 10);
        if (year >= 2000 && year <= 2101) { // Need prev/next year data
          const parts = entry.spring.split('-');
          const yearStr = String(entry.year).padStart(4, '0');
          const month = parts[1].padStart(2, '0');
          const day = parts[2].padStart(2, '0');
          acc[year] = `${yearStr}-${month}-${day}`;
        }
        return acc;
      }, {});

      this.summerSolsticeData = data.reduce((acc, entry) => {
        const year = parseInt(entry.year, 10);
        if (year >= 2000 && year <= 2101) { // Need prev/next year data
          const parts = entry.summer.split('-');
          const yearStr = String(entry.year).padStart(4, '0');
          const month = parts[1].padStart(2, '0');
          const day = parts[2].padStart(2, '0');
          acc[year] = `${yearStr}-${month}-${day}`;
        }
        return acc;
      }, {});

      this.fallEquinoxData = data.reduce((acc, entry) => {
        const year = parseInt(entry.year, 10);
        if (year >= 2000 && year <= 2101) { // Need prev/next year data
          const parts = entry.fall.split('-');
          const yearStr = String(entry.year).padStart(4, '0');
          const month = parts[1].padStart(2, '0');
          const day = parts[2].padStart(2, '0');
          acc[year] = `${yearStr}-${month}-${day}`;
        }
        return acc;
      }, {});
      this.winterSolsticeData = data.reduce((acc, entry) => {
        const year = parseInt(entry.year, 10);
        if (year >= 2000 && year <= 2101) { // Need prev/next year data
          const parts = entry.winter.split('-');
          const yearStr = String(entry.year).padStart(4, '0');
          const month = parts[1].padStart(2, '0');
          const day = parts[2].padStart(2, '0');
          acc[year] = `${yearStr}-${month}-${day}`;
        }
        return acc;
      }, {});

      const newMoon = await fetch('https://feishikong.github.io/Shisan-calendar/data/new-moons/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const dataNewMoon = await newMoon.json();
      this.newMoonData = dataNewMoon.reduce((acc, entry) => {
	const year = parseInt(entry.year, 10);
	acc[year] = entry.newMoon;
        return acc;
      }, {});
      // Pre-calculate start dates after loading
      this.preCalculateYearStartDates();

    } catch (error) {
      // Use fallback data if fetch fails
      this._useFallbackEquinoxData();
      this.preCalculateYearStartDates(); // Calculate start dates even with fallback
    }
  }

  /**
   * Fallback equinox data (approximation) if JSON source is unavailable.
   */
  _useFallbackEquinoxData() {
    for (let year = 1899; year <= 2101; year++) {
        let day = (year >= 2044 && year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) || year === 2100 ? 19 : 20;
        if (year === 2100) day = 19;
        this.vernalEquinoxData[year] = `${year}-03-${String(day).padStart(2, '0')}`;
    }
  }

  /**
   * Calculate the Gregorian date (UTC Date object) corresponding to Day 1, Month 1
   * of a given Solar year. This is the first Monday on or after the Vernal Equinox.
   */
  getSolarYearStartDate(solarYear) {
      if (this.solarYearStartDateCache[solarYear]) {
          return this.solarYearStartDateCache[solarYear];
      }

      const vernalEquinoxStr = this.vernalEquinoxData[solarYear];

      if (!vernalEquinoxStr) {
          return null; // Missing data
      }

      const vernalEquinoxDate = new Date(vernalEquinoxStr);

      const startDate = vernalEquinoxDate;
      startDate.setUTCDate(vernalEquinoxDate.getUTCDate() + 1);

      this.solarYearStartDateCache[solarYear] = startDate;
      return startDate;
  }

   /** Pre-calculate and cache start dates for the relevant range */
   preCalculateYearStartDates() {
       for (let year = 2001; year <= 2100; year++) {
           this.getSolarYearStartDate(year); // Calculate and cache
           this.jerusalemNewMoon[year] = this.newMoonData[year].map( date => this.findFirstCrescent(new Date(date)));
           this.firstDayOfYear[year] = this.getSolarYearStartDate(year).getUTCDay();
       }
   }

  /**
   * Determine if the current Solar year is a leap year (has 366 days).
   */
  isSolarLeapYear(solarYear) {
    const startDate = this.getSolarYearStartDate(solarYear);
    const endDate = this.getGregorianDateForSolarDay(solarYear, 365);
    const nextStartDate = this.getSolarYearStartDate(solarYear + 1);

    if (!startDate || !nextStartDate) {
      // Fallback approximation if data is missing
      const leapMonthDays = new Date(solarYear, 2, 0).getDate();
      return leapMonthDays === 29;
    }

    const diffDays = nextStartDate.getUTCDate() - endDate.getUTCDate();
    return diffDays === 2;
  }

  /**
   * Get the Gregorian date (UTC Date object) for a specific day number within the Solar year structure.
   */
  getGregorianDateForSolarDay(solarYear, solarDayOfYear) {
    const startDate = this.getSolarYearStartDate(solarYear);
    if (!startDate) return null;

    if (solarDayOfYear < 0) {
        return targetDate; // Invalid day number
    }

    const targetDate = new Date(startDate);
    targetDate.setUTCDate(startDate.getUTCDate() + solarDayOfYear - 1);
    return targetDate;
  }

  /**
   * Get Solar date information { monthIndex, day, year, specialDay? } from a Gregorian date.
   */
  getSolarDateFromGregorian(gregorianDate) {
    const gDateUTC = new Date(Date.UTC(gregorianDate.getUTCFullYear(), gregorianDate.getUTCMonth(), gregorianDate.getUTCDate()));
    const gYear = gregorianDate.getUTCFullYear();

    let solarYear = gYear;
    let solarYearStartDate = this.getSolarYearStartDate(solarYear);
    let sYearStartDate =  new Date(Date.UTC(solarYearStartDate.getUTCFullYear(), solarYearStartDate.getUTCMonth(), solarYearStartDate.getUTCDate()));

    // Determine the correct Solar year context
    if (!sYearStartDate || gDateUTC < sYearStartDate) {
        solarYear--;
        solarYearStartDate = this.getSolarYearStartDate(solarYear);
        sYearStartDate =  new Date(Date.UTC(solarYearStartDate.getUTCFullYear(), solarYearStartDate.getUTCMonth(), solarYearStartDate.getUTCDate()));
        if (!sYearStartDate) return null;
    }

    const diffTime = gDateUTC - sYearStartDate;
    const daysSinceSolarYearStart = Math.floor(diffTime / (1000 * 60 * 60 * 24));


    // Regular day within the 13 months
    const monthIndex = Math.floor(daysSinceSolarYearStart / 28);
    const dayOfMonth = (daysSinceSolarYearStart % 28) + 1;
    const lunarDay = this.getLunarDay(gDateUTC);

    const isLeap = this.isSolarLeapYear(solarYear);
    const month = this.calendarStructure[monthIndex];
    if (monthIndex < 0 || monthIndex >= this.calendarStructure.length) {
	 if(monthIndex > 13) return null; // Index out of bounds
	 if(daysSinceSolarYearStart === 364 && isLeap) return { monthIndex: 12, day: 0, year: solarYear, specialDay: "Leap Day", monthNumber: 12 }
	 else return { monthIndex: 0, day: 0, year: solarYear + 1, specialDay: "Equinox Day", monthNumber: 1 }
    }

    return {
      monthIndex: monthIndex,
      month: month,
      day: dayOfMonth,
      lday: lunarDay,
      year: solarYear,
      monthName: month.name,
      monthNumber: monthIndex + 1,
      specialDay: null
    };
  }

  /**
   * Format month title for the Solar calendar view.
   */
  formatSolarMonthTitle(monthIndex, solarYear) {
      if (monthIndex < 0 || monthIndex >= this.calendarStructure.length) return { main: 'Invalid Month', sub: '' };
      const month = this.calendarStructure[monthIndex];
      const startDayOfYear = month.startDay;
      const endDayOfYear = startDayOfYear + month.days - 1;
      const gregStartDate = this.getGregorianDateForSolarDay(solarYear, startDayOfYear);
      const gregEndDate = this.getGregorianDateForSolarDay(solarYear, endDayOfYear);
      let gregRange = '';
      if (gregStartDate && gregEndDate) {
          const startM = this.gregorianMonths[gregStartDate.getUTCMonth()].substring(0, 3);
          const endM = this.gregorianMonths[gregEndDate.getUTCMonth()].substring(0, 3);
          gregRange = startM === endM ? startM : `${startM}-${endM}`;
      }
      return {
          main: `${month.name}`,
          sub: `Gregorian: ${gregRange}`
      };
  }

  /**
   * Format month title for Gregorian calendar view, showing corresponding Solar info.
   */
  formatGregorianMonthTitle(gregorianMonthIndex, gregorianYear) {
    if (gregorianMonthIndex < 0 || gregorianMonthIndex > 11) return { main: 'Invalid Month', sub: '' };
    const gregorianMonthName = this.gregorianMonths[gregorianMonthIndex];
    const gregMonthStartDate = new Date(Date.UTC(gregorianYear, gregorianMonthIndex, 1));
    const gregMonthEndDate = new Date(Date.UTC(gregorianYear, gregorianMonthIndex + 1, 0));
    const solarStartInfo = this.getSolarDateFromGregorian(gregMonthStartDate);
    const solarEndInfo = this.getSolarDateFromGregorian(gregMonthEndDate);
    const startMonthName = solarStartInfo.monthName;
    const endMonthName = solarEndInfo.monthName;
    const solarInfoStr = `${startMonthName}-${endMonthName}`;
    return {
      main: `${gregorianMonthName}`,
      sub: ` Solar: ${solarInfoStr}`
    };
  }

  /**
   * Get approximate astronomical event dates (Gregorian).
   */
  getAstronomicalEvents(year) {
    if (this.astronomicalEventCache[year]) {
      return this.astronomicalEventCache[year];
    }
    const vernalEquinoxStr = this.vernalEquinoxData[year];
    const summerSolsticeStr = this.summerSolsticeData[year];
    const fallEquinoxStr = this.fallEquinoxData[year];
    const winterSolsticeStr = this.winterSolsticeData[year];
    // Use approximation if exact data is missing
    const vernalEquinoxDate = vernalEquinoxStr ? new Date(vernalEquinoxStr) : new Date(Date.UTC(year, 2, 20));
    const summerSolsticeDate = summerSolsticeStr ? new Date(summerSolsticeStr) : new Date(Date.UTC(year, 5, 21));
    const fallEquinoxDate = fallEquinoxStr ? new Date(fallEquinoxStr) : new Date(Date.UTC(year, 8, 22));
    const winterSolsticeDate = winterSolsticeStr ? new Date(winterSolsticeStr) : new Date(Date.UTC(year, 11, 21));
    const events = {
      vernalEquinox: vernalEquinoxDate,
      summerSolstice: summerSolsticeDate,
      autumnEquinox: fallEquinoxDate,
      winterSolstice: winterSolsticeDate,
    };
    this.jerusalemNewMoon[year].forEach((iso, index) => {
        events[`newMoon${index}`] = new Date(iso);
    });
    this.astronomicalEventCache[year] = events;
    return events;
  }

  getSunset(date) {
     return this.sunCalc.getTimes(date, this.locationVisibility.latitude, this.locationVisibility.longitude).sunset;
  }

  findFirstCrescent(newMoonDate) {
    let check = new Date(newMoonDate);
    const jerusalemNewMoon = new Date(newMoonDate.toLocaleString("sv-SE", {timeZone: 'Asia/Jerusalem'}));
    check.setUTCDate(jerusalemNewMoon.getUTCDate() + 1);
    const sunset = this.getSunset(check);
    const moonIllum = (this.sunCalc.getMoonIllumination(sunset).fraction*100).toFixed(2);
    if(moonIllum < 1.1) jerusalemNewMoon.setUTCDate(jerusalemNewMoon.getUTCDate() + 1);
    return jerusalemNewMoon;
  }

  getLunarDay(gregorianDate){
	  const year = gregorianDate.getUTCFullYear();
	  let newMoonDate = this.jerusalemNewMoon[year].filter( newMoonDay => {
		  const today = new Date(Date.UTC(gregorianDate.getUTCFullYear(), gregorianDate.getUTCMonth(), gregorianDate.getUTCDate(), newMoonDay.getUTCHours(), newMoonDay.getUTCMinutes(), newMoonDay.getUTCSeconds(), newMoonDay.getUTCMilliseconds()));
		  return newMoonDay <= today;
	  }).reduce((latest, date) => (latest === null || date > latest ? date: latest), null);
	  if (newMoonDate == null) newMoonDate = new Date(this.newMoonData[year-1][this.newMoonData[year-1].length - 1]);
	  const today = new Date(Date.UTC(gregorianDate.getUTCFullYear(), gregorianDate.getUTCMonth(), gregorianDate.getUTCDate(), newMoonDate.getUTCHours(), newMoonDate.getUTCMinutes(), newMoonDate.getUTCSeconds(), newMoonDate.getUTCMilliseconds()));
	  const moonAgeTime = Math.abs(today - newMoonDate)
	  const moonAge = Math.round(moonAgeTime / ( 1000 * 60 * 60 * 24))
	  return moonAge;
  }

  /**
   * Check if a Gregorian date coincides with an approximate astronomical event.
   */
  checkAstronomicalEvent(date, year) {
    const events = this.getAstronomicalEvents(year);
    const dateStr = this.toISODateString(date);
    const moonAge = this.lunarDay;
    const lunarEvents = [ 0, 7, 14, 21];
    const lunarBadges = { 0: '🌑', 7: '🌓', 14: '🌕', 21: '🌗'};
    for (const [key, eventDate] of Object.entries(events)) {
        if (!eventDate || isNaN(eventDate.getTime())) continue;
        const eventDateStr = this.toISODateString(eventDate);
        let badgeKey = key
        if (dateStr === eventDateStr) {
            const icons = { vernalEquinox: '🌱', summerSolstice: '☀️', autumnEquinox: '🍂', winterSolstice: '❄️' };
            const classes = { vernalEquinox: 'vernal-equinox', summerSolstice: 'summer-solstice', autumnEquinox: 'autumn-equinox', winterSolstice: 'winter-solstice', newMoon: 'new-moon' };
            if(key.substring(0, 7) == 'newMoon') badgeKey = 'newMoon';
            const badgeIcon = lunarEvents.includes(moonAge) ? lunarBadges[moonAge] : icons[key];
            return { icon: badgeIcon, class: classes[badgeKey] };
        }
    }
    if (lunarEvents.includes(moonAge)) {
        return { icon: lunarBadges[moonAge], class: 'new-moon' };
    }
    return null;
  }

  /**
   * Format Date to ISO string (YYYY-MM-DD) using UTC values.
   */
  toISODateString(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) return null;
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

