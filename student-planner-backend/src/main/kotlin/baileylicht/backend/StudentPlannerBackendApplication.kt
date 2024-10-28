package baileylicht.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class StudentPlannerBackendApplication

fun main(args: Array<String>) {
    runApplication<StudentPlannerBackendApplication>(*args)
}
