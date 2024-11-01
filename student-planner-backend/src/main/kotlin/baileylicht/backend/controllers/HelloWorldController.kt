package baileylicht.backend.controllers

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/hello")
@Tag(name = "Hello World", description = "Hello World example")
class HelloWorldController {
    @RequestMapping(method = [RequestMethod.GET], produces = [MediaType.TEXT_PLAIN_VALUE])
    @Operation(summary = "Returns 'Hello World'")
    @ApiResponses(
        value = [ApiResponse(responseCode = "200", description = "OK"), ApiResponse(
            responseCode = "404",
            description = "Resource not found"
        )]
    )
    fun helloWorld() = "Hello World"
}