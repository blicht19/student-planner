package baileylicht.backend.security

import com.fasterxml.jackson.annotation.JsonIgnore
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

data class PlannerUserDetails(
    val id: Long,
    private val username: String,
    @JsonIgnore private val password: String,
    private val authorities: Collection<GrantedAuthority>
) : UserDetails {
    override fun getAuthorities(): Collection<GrantedAuthority> = authorities

    override fun getPassword(): String = password

    override fun getUsername(): String = username
}