package baileylicht.backend.models

import jakarta.persistence.*
import jakarta.validation.constraints.Size
import java.time.LocalTime

@Entity
@Table(name = "subjects")
class Subject(
    @Column(nullable = false) @Size(min = 1, max = 100) var name: String,
    @ManyToOne @JoinColumn(
        name = "user_id",
        referencedColumnName = "id",
        updatable = false,
        nullable = false
    ) val user: UserEntity,
    @Column @Size(max = 100) var location: String? = null,
    @Column var sunday: Boolean = false,
    @Column var monday: Boolean = false,
    @Column var tuesday: Boolean = false,
    @Column var wednesday: Boolean = false,
    @Column var thursday: Boolean = false,
    @Column var friday: Boolean = false,
    @Column var saturday: Boolean = false,
    @Column var startTime: LocalTime? = null,
    @Column var endTime: LocalTime? = null,
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null
) : PlannerItemEntity