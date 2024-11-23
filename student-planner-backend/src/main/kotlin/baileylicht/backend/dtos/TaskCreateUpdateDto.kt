package baileylicht.backend.dtos

data class TaskCreateUpdateDto(
    val name: String?,
    val complete: Boolean?,
    val note: String?,
    val dueDate: String?,
    val id: Long?
)
