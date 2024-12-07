package baileylicht.backend.dtos

data class AuthResponseDto(val username: String, val role: String, val warning: String? = null)
