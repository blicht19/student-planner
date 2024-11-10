package baileylicht.backend.models

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.sql.Timestamp

@Entity
@Table(name = "users")
class UserEntity(
    @Column(nullable = false) @NotBlank @Size(max = 20) val username: String,
    @Column(nullable = false) @NotBlank @Size(max = 100) val password: String,
    @Column var accountLocked: Boolean = false,
    @Column var failedLoginAttempts: Int = 0,
    @Column var lockTime: Timestamp? = null,
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long? = null
)