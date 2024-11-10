package baileylicht.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class StudentPlannerBackendApplication

fun main(args: Array<String>) {
    runApplication<StudentPlannerBackendApplication>(*args)
}
