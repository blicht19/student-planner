package baileylicht.backend.models

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "revoked_tokens")
class RevokedToken(@Id val token: String, @Column val expiration: Long)