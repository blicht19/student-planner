package baileylicht.backend.dtos

data class TaskResponseDto(
    val name: String,
    val complete: Boolean,
    val dueDate: String,
    val note: String?,
    val id: Long?
) : PlannerItemResponseDto
