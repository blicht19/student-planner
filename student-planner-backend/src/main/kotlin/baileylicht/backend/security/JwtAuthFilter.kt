package baileylicht.backend.security

import baileylicht.backend.services.PlannerUserDetailsService
import baileylicht.backend.services.RevokedTokenService
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.web.filter.OncePerRequestFilter

class JwtAuthFilter : OncePerRequestFilter() {
    @Autowired
    lateinit var jwtComponent: JwtComponent

    @Autowired
    lateinit var userDetailsService: PlannerUserDetailsService

    @Autowired
    lateinit var revokedTokenService: RevokedTokenService

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val jwt = jwtComponent.getJwtFromCookies(request)
        if (jwt != null && jwtComponent.validateToken(jwt)) {
            if (revokedTokenService.isRevoked(jwt)) {
                val cookie = jwtComponent.clearJwtCookie().toString()
                response.status = HttpStatus.UNAUTHORIZED.value()
                response.writer.print("JWT is expired or invalid")
                response.addHeader(HttpHeaders.SET_COOKIE, cookie)
            }

            val username = jwtComponent.getUsernameFromToken(jwt)
            val userDetails = userDetailsService.loadUserByUsername(username)
            val authentication = UsernamePasswordAuthenticationToken(userDetails, null, userDetails.authorities)
            authentication.details = WebAuthenticationDetailsSource().buildDetails(request)

            SecurityContextHolder.getContext().authentication = authentication
        }

        filterChain.doFilter(request, response)
    }
}