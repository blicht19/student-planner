package baileylicht.backend.dtos

data class UserInformationDto(
    val username: String,
    val id: Long,
    val role: String,
    val accountLocked: Boolean,
    val failedLoginAttempts: Int,
    val lockTime: String?
)
