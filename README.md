# Solar & Gregorian Calendar System

## Overview
A comprehensive dual-calendar system displaying both Solar (13 month Spring Equinox aligned) and Gregorian calendars with full astronomical event tracking and cross-calendar linking.

## Files

### HTML Files
- **index.html** - Solar calendar with Gregorian date references
- **gregorian-calendar.html** - Gregorian calendar with Solar date references

### JavaScript
- **calendar-processor.js** - CalendarProcessor class handling all date conversions and calculations

### CSS
- **calendar-styles.css** - Shared styling for both calendars

## Features

### Solar Calendar Display Format
Each month shows:
```
Ichika
Gregorian: March-April
```
- **Solar Month**: Names derived from Japanese Numerals
- **Gregorian Months**: Corresponding Gregorian months that overlap

### Gregorian Calendar Display Format
Each month shows:
```
March
Solar: Tomita-Ichika
```
- **Gregorian Month**: Standard month name
- **Solar Months**: Corresponding Solar month names

### Shisan Date Format
Shisan dates are formatted as
```
Month-Name SolarDay:LunarDay
```
so a date such as "2 April 2026" becomes `Ichika 13:14`

### Astronomical Events
Both calendars display:
- 🌱 **Vernal Equinox** - Spring begins
- ☀️  **Summer Solstice** - Longest day
- 🍂 **Autumn Equinox** - Fall begins
- ❄️  **Winter Solstice** - Shortest day
- 🌑 **New Moon** - Lunation cycle starts
- 🌓 **First Quarter** - 7 days after New Moon
- 🌕 **Full Moon** - 14 days after New Moon
- 🌗 **Last Quarter** - 21 days after New Moon

Features:
- Clickable event cards with hover tooltips
- Special day highlighting with colored borders
- Event badges on calendar days
- Direct navigation to event dates

### Cross-Calendar Linking
- **Click month headings** to jump to the corresponding month in the other calendar (TODO)
- **Click any day** in one calendar to view it in the other calendar
- URL parameters enable deep linking between calendars
- Smooth animations and highlighting
- Bidirectional navigation maintains year context

**Month Heading Links:**(TODO)
- Solar calendar month → Opens first corresponding Gregorian month
- Gregorian calendar month → Opens first corresponding Solar month

**Day Links:**
- Solar calendar day → Opens exact date in Gregorian calendar
- Gregorian calendar day → Opens exact date in Solar calendar

### Calendar Name Origin
The name of the calendar is derived from Chinese numerals based on the fact that it has 13 months

**Shisan** - Shísān 10 + 3

### Month Name Origins

The Solar month names are derived from Japanese numerals:

1. **Ichika** - Ichi: 1
2. **Futaba** - Futa: 2
3. **Mikasa** - Mi(tsu): 3
4. **Yotsuba** - Yotsu: 4
5. **Itsuki** - Itsu: 5
6. **Mutsumi** - Mutsu: 6
7. **Nanako** - Nana: 7
8. **Yabuki** - Yatsu: 8
9. **Kokoro** - Koko(notsu): 9
10. **Tomoya** - Tō: 10
11. **Toichi** - Tō + Ichi: 10 + 1
12. **Tofuro** - Tō + Futa: 10 + 2
13. **Tomita** - Tō + Mi(tsu): 10 + 3

### Weekday Name Origins

The weekdays are borrowed from the Hebrew calendar which are numerical with the exception of the seventh day
the numerical names are abbreviated using Hebrew numberals

1. יום א׳ (Yom Alef) - Day One
2. יום ב׳ (Yom Bet) - Day Two
3. יום ג׳ (Yom Gimel) - Day Three
4. יום ד׳ (Yom Dalet) - Day Four
5. יום ה׳ (Yom Heh) - Day Five
6. יום ו׳ (Yom Vav) - Day Six
7. שבת (Shabbat) - (Day of) Rest

## CalendarProcessor Class

The `CalendarProcessor` class provides:

### Properties
- `solarMonths` - Complete solar month data with month names, and Gregorian mappings
- `gregorianMonths` - Standard month names
- `vernalEquinoxData` - Vernal equinox dates for years 2001-2100
- `summerSolsticeData` - Summer Soltice dates for years 2001-2100
- `fallEquinoxData` - Fall Equinox dates for years 2001-2100
- `winterSolsticeData` - Winter Equinox dates for years 2001-2100
- `newMoonData` - new moon dates for years 2001-2081

### Key Methods

#### Date Conversion
```javascript
getGregorianDateForSolarDay(solarYear, solarDay)
// Convert solar day number to Gregorian date

getSolarDateFromGregorian(gregorianDate, gregorianYear)
// Convert Gregorian date to solar calendar info
```

#### Astronomical Events
```javascript
getAstronomicalEvents(year)
// Get all astronomical events for a year

checkAstronomicalEvent(date, year)
// Check if a date is an astronomical event
```

#### Formatting
```javascript
formatSolarMonthTitle(monthIndex)
// Returns: { main: "Ichika", sub: "Gregorian: March-April" }

formatGregorianMonthTitle(gregorianMonthIndex)
// Returns: { main: "March", sub: "Solar: Tomita-Ichika" }
```

## Usage

### Basic Setup
All three files must be in the same directory:
```
index.html
gregorian-calendar.html
calendar-processor.js
calendar-styles.css
```

### Standalone Use
Each HTML file works independently and includes all necessary JavaScript inline.

### Year Selection
Both calendars support years 2001-2082 through the year input control.

### Theme Toggle
- Light/Dark mode toggle
- Preference saved in localStorage
- System preference detection

### Navigation
- Previous/Next month buttons
- Smooth scrolling between months
- Active month indicator
- **Clickable month headings** - hover to see link effect, click to navigate to other calendar (TODO)
- Month headings show hover state to indicate they are clickable

## Technical Details

### Solar Calendar
- Based on astronomical observations
- Starts at Vernal Equinox (Nowruz - Persian New Year)
- First month: 29 days (0-28)
  - Day 0 is labeled "Equinox Day"
- Next 11 months: 28 days each
- Last month: 28 days (29 in leap years)
  - Day 29 is labeled "Leap Day"

### Date Calculations
- Solar year starts March 20/21 (Vernal Equinox)
- Leap days are inserted when the difference between the last day of the year and start of the next is 2 days
- Astronomical event dates are based on ephemeris data and calculations performed by [suncalc](https://github.com/mourner/suncalc)

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- CSS Grid and Flexbox layouts
- CSS custom properties (variables)

## Customization

### Styling
Modify `calendar-styles.css` to customize:
- Color schemes (CSS custom properties in `:root`)
- Layout dimensions
- Typography
- Animation timing

## License
This calendar system is provided as-is for educational and personal use.

## Credits
Shisan calendar is derived from the solar calendar system by [Tom Gould](https://github.com/tomgould).
Astronomical event calculations are based on the [Solstice and Equinox Table](https://www.astropixels.com/ephemeris/soleq2001.html) and [Moon Phases Table](https://www.astropixels.com/ephemeris/moon/phases2001gmt.html) Courtesy of Fred Espenak, www.Astropixels.com
