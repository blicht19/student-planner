package baileylicht.backend.controllers

import baileylicht.backend.dtos.DateRangeDto
import baileylicht.backend.dtos.DueDateFilterDto
import baileylicht.backend.dtos.PlannerItemCreateUpdateDto
import baileylicht.backend.dtos.PlannerItemResponseDto
import baileylicht.backend.models.DateRangePlannerItemEntity
import baileylicht.backend.models.FilterablePlannerItemEntity
import baileylicht.backend.models.PlannerItemEntity
import baileylicht.backend.services.DateRangePlannerItemService
import baileylicht.backend.services.FilterablePlannerItemService
import baileylicht.backend.services.LoginService
import baileylicht.backend.services.PlannerItemService
import baileylicht.backend.utilities.stringToLocalDate
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

abstract class PlannerItemController<E : PlannerItemEntity, P : JpaRepository<E, Long>, D : PlannerItemResponseDto, S : PlannerItemService<E, P, D>, C : PlannerItemCreateUpdateDto>(
    protected val itemService: S,
    protected val loginService: LoginService
) {
    @GetMapping(produces = [MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE])
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved items"
        ), ApiResponse(responseCode = "401", description = "Unauthorized")]
    )
    fun getAll(): ResponseEntity<Any> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val items = itemService.getAll(userId)
        return ResponseEntity.ok(items)
    }

    @PostMapping(produces = [MediaType.TEXT_PLAIN_VALUE], consumes = [MediaType.APPLICATION_JSON_VALUE])
    @ApiResponses(
        value = [ApiResponse(responseCode = "201", description = "Successfully created a new item"), ApiResponse(
            responseCode = "401",
            description = "Unauthorized"
        ), ApiResponse(responseCode = "400", description = "Bad request")]
    )
    abstract fun createItem(@RequestBody dto: C): ResponseEntity<String>

    @PutMapping(produces = [MediaType.TEXT_PLAIN_VALUE], consumes = [MediaType.APPLICATION_JSON_VALUE])
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully updated item"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "400",
            description = "Bad request"
        ), ApiResponse(responseCode = "404", description = "No existing item with this id could be found")]
    )
    abstract fun updateItem(@RequestBody dto: C): ResponseEntity<String>

    @DeleteMapping(produces = [MediaType.TEXT_PLAIN_VALUE])
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully deleted an item"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "404",
            description = "Assignment not found"
        )]
    )
    fun deleteItem(@RequestParam("id") itemId: Long): ResponseEntity<String> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)

        val deletedCount = itemService.deleteItem(userId, itemId)
        if (deletedCount > 0) {
            return ResponseEntity.ok().body("Successfully deleted an item")
        }

        return ResponseEntity("Could not find an item matching id $itemId", HttpStatus.NOT_FOUND)
    }
}

abstract class DateRangePlannerItemController<E : DateRangePlannerItemEntity, P : JpaRepository<E, Long>, D : PlannerItemResponseDto, S : DateRangePlannerItemService<E, P, D>, C : PlannerItemCreateUpdateDto>(
    itemService: S, loginService: LoginService
) :
    PlannerItemController<E, P, D, S, C>(itemService, loginService) {
    @PostMapping(
        produces = [MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE],
        path = ["range"]
    )
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved items"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "400",
            description = "Bad request"
        )]
    )
    fun getAllInDateRange(@RequestBody range: DateRangeDto): ResponseEntity<Any> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity("User is not logged in", HttpStatus.UNAUTHORIZED)
        val startDate = stringToLocalDate(range.startDate) ?: return ResponseEntity(
            "Invalid start date: ${range.startDate}",
            HttpStatus.BAD_REQUEST
        )
        if (range.endDate != null) {
            val endDate = stringToLocalDate(range.endDate) ?: return ResponseEntity(
                "Invalid end date: ${range.endDate}",
                HttpStatus.BAD_REQUEST
            )
            return ResponseEntity.ok(itemService.getAllInDateRange(userId, startDate, endDate))
        }

        return ResponseEntity.ok(itemService.getAllOnDate(userId, startDate))
    }
}

abstract class FilterablePlannerItemController<E : FilterablePlannerItemEntity, P : JpaRepository<E, Long>, D : PlannerItemResponseDto, S : FilterablePlannerItemService<E, P, D>, C : PlannerItemCreateUpdateDto>(
    itemService: S,
    loginService: LoginService
) :
    PlannerItemController<E, P, D, S, C>(itemService, loginService) {
    @PostMapping(
        produces = [MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE],
        path = ["filter"]
    )
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved items"
        ), ApiResponse(responseCode = "401", description = "Unauthorized"), ApiResponse(
            responseCode = "400",
            description = "Bad request"
        )]
    )
    fun getAllFiltered(@RequestBody filter: DueDateFilterDto): ResponseEntity<Any> {
        val userId =
            loginService.getLoggedInUserId() ?: return ResponseEntity(
                "User is not logged in",
                HttpStatus.UNAUTHORIZED
            )
        val startDate =
            stringToLocalDate(filter.startDate) ?: return ResponseEntity(
                "Invalid start date",
                HttpStatus.BAD_REQUEST
            )
        val endDate =
            stringToLocalDate(filter.endDate) ?: return ResponseEntity("Invalid end date", HttpStatus.BAD_REQUEST)

        val items = itemService.getAllFiltered(userId, filter.showCompleted, startDate, endDate)
        return ResponseEntity.ok(items)
    }
}