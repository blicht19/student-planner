package baileylicht.backend.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.web.filter.OncePerRequestFilter

class JwtAuthFilter : OncePerRequestFilter() {
    @Autowired
    lateinit var tokenGenerator: JwtGenerator

    @Autowired
    lateinit var userDetailsService: PlannerUserDetailsService

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val jwt = parseJwt(request)
        if (jwt != null && tokenGenerator.validateToken(jwt)) {
            val username = tokenGenerator.getUsernameFromToken(jwt)
            val userDetails = userDetailsService.loadUserByUsername(username)
            val authentication = UsernamePasswordAuthenticationToken(userDetails, null, userDetails.authorities)
            authentication.details = WebAuthenticationDetailsSource().buildDetails(request)

            SecurityContextHolder.getContext().authentication = authentication
        }

        filterChain.doFilter(request, response)
    }

    private fun parseJwt(request: HttpServletRequest): String? {
        return tokenGenerator.getJwtFromCookies(request)
    }

//    private fun getJwtFromRequest(request: HttpServletRequest): String? {
//        val bearerToken = request.getHeader("Authorization")
//        if (!StringUtils.hasText(bearerToken) || !bearerToken.startsWith("Bearer ")) {
//            return null
//        }
//
//        return bearerToken.substring(7, bearerToken.length)
//    }
}