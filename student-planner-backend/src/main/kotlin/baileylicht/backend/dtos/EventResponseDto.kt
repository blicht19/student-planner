package baileylicht.backend.dtos

data class EventResponseDto(
    val name: String,
    val date: String,
    val startTime: String,
    val endTime: String,
    val location: String?,
    val note: String?,
    val id: Long?
) : PlannerItemResponseDto
