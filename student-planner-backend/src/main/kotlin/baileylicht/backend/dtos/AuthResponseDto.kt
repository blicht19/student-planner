package baileylicht.backend.dtos

data class AuthResponseDto(val username: String, val id: Long, val warning: String? = null)
