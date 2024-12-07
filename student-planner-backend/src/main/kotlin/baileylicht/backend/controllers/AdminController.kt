package baileylicht.backend.controllers

import baileylicht.backend.dtos.UserInformationDto
import baileylicht.backend.services.AdminService
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/admin/users")
@Tag(name = "Admin")
class AdminController(@Autowired private val adminService: AdminService) {
    @GetMapping(produces = [MediaType.APPLICATION_JSON_VALUE])
    @ApiResponses(
        value = [ApiResponse(responseCode = "200", description = "Successfully retrieved users"), ApiResponse(
            responseCode = "401",
            description = "Unauthorized"
        )]
    )
    fun getAllUsers(): ResponseEntity<List<UserInformationDto>> {
        val users = adminService.getAllUsers()
        return ResponseEntity(users, HttpStatus.OK)
    }

    @PostMapping(produces = [MediaType.TEXT_PLAIN_VALUE], path = ["unlock"])
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully unlocked user account"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "404",
            description = "User not found"
        )]
    )
    fun unlockUserAccount(@RequestParam(value = "userId") userId: Long): ResponseEntity<String> {
        val unlocked = adminService.unlockUserAccount(userId)
        return if (unlocked) {
            ResponseEntity("User account was successfully unlocked", HttpStatus.OK)
        } else {
            ResponseEntity("Could not find user with id $userId", HttpStatus.BAD_REQUEST)
        }
    }

    @DeleteMapping(produces = [MediaType.TEXT_PLAIN_VALUE])
    @ApiResponses(
        value = [ApiResponse(responseCode = "200", description = "Successfully deleted user"), ApiResponse(
            responseCode = "401",
            description = "Unauthorized"
        )]
    )
    fun deleteUserAccount(@RequestParam(value = "userId") userId: Long): ResponseEntity<String> {
        adminService.deleteUser(userId)
        return ResponseEntity("User account was successfully deleted", HttpStatus.OK)
    }
}