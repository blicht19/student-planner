package baileylicht.backend.models

import jakarta.persistence.*
import jakarta.validation.constraints.Size
import java.time.LocalDate

@Entity
@Table(name = "tasks")
data class Task(
    @Column(nullable = false) @Size(min = 1, max = 100) var name: String,
    @Column(nullable = false) var dueDate: LocalDate,
    @Column(nullable = false) var complete: Boolean = false,
    @ManyToOne @JoinColumn(
        name = "user_id",
        referencedColumnName = "id",
        updatable = false,
        nullable = false
    ) val user: UserEntity,
    @Column @Size(max = 500) var note: String? = null,
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null
)
