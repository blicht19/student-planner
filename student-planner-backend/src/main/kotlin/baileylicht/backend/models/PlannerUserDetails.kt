package baileylicht.backend.models

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

data class PlannerUserDetails(val user: UserEntity) : UserDetails {
    override fun getAuthorities(): Collection<GrantedAuthority> = listOf(SimpleGrantedAuthority(user.role.name))

    override fun getPassword(): String = user.password

    override fun getUsername(): String = user.username

    override fun isAccountNonLocked(): Boolean = !user.accountLocked
}