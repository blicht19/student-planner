package baileylicht.backend.dtos

data class AssignmentCreateUpdateDto(
    val name: String?,
    val complete: Boolean?,
    val subjectId: Long?,
    val note: String?,
    val dueDate: String?,
    val id: Long?
)
