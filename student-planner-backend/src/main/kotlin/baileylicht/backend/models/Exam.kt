package baileylicht.backend.models

import jakarta.persistence.*
import jakarta.validation.constraints.Size
import java.time.LocalDate
import java.time.LocalTime

@Entity
@Table(name = "exams")
class Exam(
    @Column(nullable = false) @Size(min = 1, max = 100) var name: String,
    @Column(nullable = false) var date: LocalDate,
    @Column var startTime: LocalTime,
    @Column var endTime: LocalTime,
    @ManyToOne @JoinColumn(
        name = "user_id",
        referencedColumnName = "id",
        updatable = false,
        nullable = false
    ) var user: UserEntity,
    @ManyToOne @JoinColumn(name = "subject_id", referencedColumnName = "id") var subject: Subject? = null,
    @Column @Size(max = 100) var location: String? = null,
    @Column @Size(max = 500) var note: String? = null,
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null
)