package baileylicht.backend.services

import baileylicht.backend.dtos.PlannerItemResponseDto
import baileylicht.backend.models.DateRangePlannerItemEntity
import baileylicht.backend.models.FilterablePlannerItemEntity
import baileylicht.backend.models.PlannerItemEntity
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
abstract class PlannerItemService<E : PlannerItemEntity, P : JpaRepository<E, Long>, D : PlannerItemResponseDto>(
    private val repository: P
) {
    /**
     * Converts a list of planner item JPA entities to DTOs to be returned to the client
     * @param entities A list of planner item JPA entities
     * @return A list of planner item DTOs to be returned to the client
     */
    abstract fun convertEntitiesToResponseDtos(entities: List<E>): List<D>

    /**
     * Retrieves all planner item entities for a given user from the database
     * @param userId The ID number for a user
     * @return A list of planner item entities for this user
     */
    abstract fun findAllEntitiesByUserId(userId: Long): List<E>

    /**
     * Retrieves all planner items for this user
     * @param userId The ID number for a user
     * @return A list of planner item DTOs for this user
     */
    fun getAll(userId: Long): List<D> {
        val items = findAllEntitiesByUserId(userId)
        return convertEntitiesToResponseDtos(items)
    }

    /**
     * Retrieves a single planner item entity from the database
     * @param userId The ID number for a user
     * @param id The ID number of a planner item
     * @return A single planner item JPA entity
     */
    abstract fun getItem(userId: Long, id: Long): E?

    /**
     * Saves a planner item entity to the database
     * @param item A planner item entity
     */
    fun saveItem(item: E) {
        repository.save(item)
    }

    /**
     * Deletes a planner item from the database
     * @param userId The ID number for a user
     * @param id The ID number for a planner item
     * @return The number of items that were deleted
     */
    @Transactional
    abstract fun deleteItem(userId: Long, id: Long): Long
}

abstract class DateRangePlannerItemService<E : DateRangePlannerItemEntity, P : JpaRepository<E, Long>, D : PlannerItemResponseDto>(
    repository: P
) :
    PlannerItemService<E, P, D>(repository) {
    /**
     * Retrieves all planner item entities for a given user with a date between startDate and endDate, inclusive, from the database
     * @param userId The ID number of a user
     * @param startDate The start of the range of dates of planner items to return
     * @param endDate The end of the range of dates of planner items to return
     * @return A list of planner item entities for userId from startDate to endDate, inclusive
     */
    abstract fun findAllEntitiesInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<E>

    /**
     * Retrieves all planner items for a given user with a date between startDate and endDate, inclusive
     * @param userId The ID number of a user
     * @param startDate The start of the range of dates of planner items to return
     * @param endDate The end of the range of dates of planner items to return
     * @return A list of planner item DTOs for userId from startDate to endDate, inclusive
     */
    fun getAllInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<D> {
        val items = findAllEntitiesInDateRange(userId, startDate, endDate)
        return convertEntitiesToResponseDtos(items)
    }

    /**
     * Retrieves all planner items for a given user with a given date
     * @param userId The ID number of a user
     * @param date A date to check for planner items
     * @return A list of planner items for userId on date
     */
    fun getAllOnDate(userId: Long, date: LocalDate): List<D> {
        return getAllInDateRange(userId, date, date)
    }
}

abstract class FilterablePlannerItemService<E : FilterablePlannerItemEntity, P : JpaRepository<E, Long>, D : PlannerItemResponseDto>(
    repository: P
) : DateRangePlannerItemService<E, P, D>(repository) {
    /**
     * Retrieves all planner item entities for a given user that are incomplete from startDate to endDate, inclusive, from the database
     * @param userId The ID number of a user
     * @param startDate The start of the range of dates of planner items to return
     * @param endDate The end of the range of dates of planner items to return
     * @return A list of planner item entities for userId that are incomplete from startDate to endDate, inclusive
     */
    abstract fun findAllIncompleteEntitiesInDateRange(userId: Long, startDate: LocalDate, endDate: LocalDate): List<E>

    /**
     * Returns all planner items for a user filtered by date and completions status
     * @param userId The ID number of a user
     * @param showCompleted Indicates whether completed items should be returned
     * @param startDate The start of the range of dates of planner items to return
     * @param endDate The end of the range of dates of planner items to return
     * @return A list of planner items for userId from startDate to endDate, inclusive, with completed items excluded if showCompleted is false
     */
    fun getAllFiltered(userId: Long, showCompleted: Boolean, startDate: LocalDate, endDate: LocalDate): List<D> {
        val items = if (showCompleted) {
            findAllEntitiesInDateRange(userId, startDate, endDate)
        } else {
            findAllIncompleteEntitiesInDateRange(userId, startDate, endDate)
        }
        return convertEntitiesToResponseDtos(items)
    }
}