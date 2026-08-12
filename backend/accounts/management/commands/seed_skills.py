from django.core.management.base import BaseCommand
from accounts.models import Skill


class Command(BaseCommand):
    help = "Seed default TechConnect skills"

    def handle(self, *args, **kwargs):
        skills = [
            "C++",
            "C",
            "Java",
            "Python",
            "JavaScript",
            "TypeScript",
            "Go",
            "Rust",
            "PHP",
            "Kotlin",
            "HTML",
            "CSS",
            "React",
            "Next.js",
            "Vue.js",
            "Angular",
            "Tailwind CSS",
            "Node.js",
            "Express.js",
            "Django",
            "Flask",
            "FastAPI",
            "Spring Boot",
            "PostgreSQL",
            "MySQL",
            "MongoDB",
            "Redis",
            "Git",
            "Docker",
            "REST API",
            "Machine Learning",
            "Data Science",
            "UI/UX Design",
            "AWS",
            "Azure",
        ]

        created = 0

        for name in skills:
            _, was_created = Skill.objects.get_or_create(name=name)

            if was_created:
                created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Skills seeded successfully. Created {created} skills."
            )
        )