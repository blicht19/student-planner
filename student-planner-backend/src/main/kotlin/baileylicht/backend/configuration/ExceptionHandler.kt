package baileylicht.backend.configuration

import baileylicht.backend.security.JwtComponent
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.WebRequest

@ControllerAdvice
class ExceptionHandler(@Autowired private val jwtComponent: JwtComponent) {
    @ExceptionHandler(value = [AuthenticationCredentialsNotFoundException::class])
    protected fun handleAuthenticationCredentialsNotFound(
        exception: RuntimeException,
        request: WebRequest
    ): ResponseEntity<String> {
        val cookie = jwtComponent.clearJwtCookie().toString()
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie)
            .body(exception.message)
    }
}