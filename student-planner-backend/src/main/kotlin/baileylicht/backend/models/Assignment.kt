package baileylicht.backend.models

import jakarta.persistence.*
import jakarta.validation.constraints.Size
import java.time.LocalDate

@Entity
@Table(name = "assignments")
class Assignment(
    @Column(nullable = false) @Size(min = 1, max = 100) var name: String,
    @Column(nullable = false) var complete: Boolean = false,
    @ManyToOne @JoinColumn(
        name = "user_id",
        referencedColumnName = "id",
        updatable = false
    ) val user: UserEntity,
    @ManyToOne @JoinColumn(name = "subject_id", referencedColumnName = "id") var subject: Subject? = null,
    @Column @Size(max = 500) var note: String? = null,
    @Column var dueDate: LocalDate? = null,
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null
)