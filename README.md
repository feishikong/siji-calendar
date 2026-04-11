# Solar & Gregorian Calendar System

## Overview
A comprehensive dual-calendar system displaying both Solar (divided into seasons aligned with the Northern Spring Equinox) and Gregorian calendars with full astronomical event tracking and cross-calendar linking.

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
Each season shows:
```
Akira
Gregorian: March-June
```
- **Solar Season**: Names derived from Japanese season names
- **Gregorian Months**: Corresponding Gregorian months that overlap

### Gregorian Calendar Display Format
Each month shows:
```
March
Solar: Natsuki-Akira
```
- **Gregorian Month**: Standard month name
- **Solar Season(s)**: Corresponding Solar season name(s)

### Siji Date Format
Siji dates are formatted as
```
Season-name LunarDayʹWeekNumber
```
where the lunar day is rendered with Greek numerals
so a date such as "22 March 2027" becomes `2027 Akira ιεʹ1`

#### Greek Numerals reference table

|Numeral|Name   |value|
|-------|-------|-----|
| αʹ 	|alpha  |  1  |
| βʹ 	|beta   |  2  |
| γʹ 	|gamma  |  3  |
| δʹ 	|delta  |  4  |
| εʹ 	|epsilon|  5  |
| ϛʹ 	|stigma |  6  |
| ζʹ 	|zeta 	|  7  |
| ηʹ 	|eta 	|  8  |
| θʹ 	|theta 	|  9  |
| ιʹ 	|iota 	| 10  |
| κʹ 	|kappa 	| 20  |
| λʹ 	|lambda	| 30  |

### Astronomical Events
Both calendars display:
- 🌱 **Vernal Equinox** - Spring begins in the Northern Hemisphere
- ☀️  **Summer Solstice** - Longest day in the Northern Hemisphere
- 🍂 **Autumn Equinox** - Fall begins in the Northern Hemisphere
- ❄️  **Winter Solstice** - Shortest day in the Northern Hemisphere
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
The name of the calendar is derived from the Chinese word meaning The Four Seasons:

**Siji** - 四季 (Sìjì): The Four Seasons

### Season Name Origins

The Solar month names are derived from Japanese names for the seasons:

1. **Akira** - 秋 (Aki): Autumn
2. **Fuyuki** - 冬 (Fuyu): Winter
3. **Haruka** - 春 (Haru): Spring
4. **Natsuki** - 夏 (Natsu): Summer

#### Reasoning

While English season names could be used, those seasons are inverted for the Southern Hemisphere of our planet. When it is Spring in the Northern Hemisphere it is Summer in the south. For this reason Spring is called Akira instead of Haruka.

### Weekday Name Origins

The weekdays are borrowed from the Hebrew calendar which are numerical with the exception of the seventh day; 
the numerical names are abbreviated using Hebrew numerals

1. <span dir='rtl'>יום א׳</span> (Yom Alef) - Day One
2. <span dir='rtl'>יום ב׳</span> (Yom Bet) - Day Two
3. <span dir='rtl'>יום ג׳</span> (Yom Gimel) - Day Three
4. <span dir='rtl'>יום ד׳</span> (Yom Dalet) - Day Four
5. <span dir='rtl'>יום ה׳</span> (Yom Heh) - Day Five
6. <span dir='rtl'>יום ו׳</span> (Yom Vav) - Day Six
7. <span dir='rtl'>שבת</span> (Shabbat) - (Day of) Rest

### Reasoning

I'm already using Japanese names for names of the season, so why not hebrew names for the days of the week?

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
// Returns: { main: "Akira", sub: "Gregorian: March-April" }

formatGregorianMonthTitle(gregorianMonthIndex)
// Returns: { main: "March", sub: "Siji: Natsuki-Akira" }
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
Both calendars support years 2001-2100 through the year input control.

### Theme Toggle
- Light/Dark mode toggle
- Preference saved in localStorage
- System preference detection

### Navigation
- Previous/Next month/season buttons
- Smooth scrolling between months/seasons
- Active month/season indicator
- **Clickable month/season headings** - hover to see link effect, click to navigate to other calendar (TODO)
- Month/Season headings show hover state to indicate they are clickable (TODO)

## Technical Details

### Solar Calendar
- Based on astronomical observations
- Starts at Vernal Equinox (Nowruz - Persian New Year)
- First season: 92 days (0-91)
  - Day 0 is labeled "New Day"
- Next 2 seasons: 91 days each
- Last season: 91 days (92 in leap years)
  - Day 92 is labeled "Leap Day"

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
Siji calendar is derived from the solar calendar system by [Tom Gould](https://github.com/tomgould).
Astronomical event calculations are based on the [Solstice and Equinox Table](https://www.astropixels.com/ephemeris/soleq2001.html) and [Moon Phases Table](https://www.astropixels.com/ephemeris/moon/phases2001gmt.html) Courtesy of Fred Espenak, www.Astropixels.com
