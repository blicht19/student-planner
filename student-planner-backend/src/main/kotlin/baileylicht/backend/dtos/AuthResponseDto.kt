package baileylicht.backend.dtos

data class AuthResponseDto(val accessToken: String) {
    val tokenType = "Bearer "
}
