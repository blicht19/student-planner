package baileylicht.backend.utilities

import java.time.LocalDate
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

private val dateFormatter = DateTimeFormatter.ofPattern("MM/dd/yyyy")
private val timeFormatter = DateTimeFormatter.ofPattern("hh:mm a")

/**
 * Formats a LocalTime as a String in the format HH:MM AM|PM
 * @param localTime A LocalTime
 * @return The String representation of localTime. Returns null if localTime is null
 */
fun localTimeToString(localTime: LocalTime?): String? {
    if (localTime == null) {
        return null
    }

    return timeFormatter.format(localTime)
}

/**
 * Attempts to parse a String into a LocalTime
 * @param value The String in the format HH:MM AM|PM to be parsed into a LocalTime
 * @return The LocalTime created by parsing this String. Returns null if the String could not be parsed.
 */
fun stringToLocalTime(value: String): LocalTime? {
    return try {
        LocalTime.parse(value, timeFormatter)
    } catch (e: DateTimeParseException) {
        null
    }
}

/**
 * Formats a LocalDate as a String in the format MM/DD/YYYY
 * @param date A LocalDate
 * @return The String representation of date. Returns null if date is null
 */
fun localDateToString(date: LocalDate?): String? {
    if (date == null) return null

    return dateFormatter.format(date)
}

/**
 * Attempts to parse a String into a LocalDate
 * @param value The String in the format MM/DD/YYYY to be parsed into a LocalDate
 * @return The LocalDate created by parsing this String. Returns null if the String could not be parsed
 */
fun stringToLocalDate(value: String): LocalDate? {
    return try {
        LocalDate.parse(value, dateFormatter)
    } catch (e: DateTimeParseException) {
        null
    }
}