package baileylicht.backend.dtos

data class SubjectDto(
    val name: String?,
    val location: String?,
    val monday: Boolean?,
    val tuesday: Boolean?,
    val wednesday: Boolean?,
    val thursday: Boolean?,
    val friday: Boolean?,
    val saturday: Boolean?,
    val sunday: Boolean?,
    val startTime: String?,
    val endTime: String?,
    val id: Long?
)
