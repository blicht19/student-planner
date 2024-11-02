package baileylicht.backend.models

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

@Entity
@Table(name = "users")
class UserEntity(
    @Column(nullable = false) @NotBlank @Size(max = 20) val username: String,
    @Column(nullable = false) @NotBlank @Size(max = 100) val password: String,
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long? = null
)