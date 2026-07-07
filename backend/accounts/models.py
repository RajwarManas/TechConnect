from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager


class User(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    objects = UserManager()

    def __str__(self):
        return self.username 
    

class Profile(models.Model):
    class LookingFor(models.TextChoices):
        PROJECT = ("PROJECT", "Project Collaborator")
        HACKATHON = ("HACKATHON", "Hackathon Team")
        STUDY = ("STUDY", "Study Buddy")
        OPENSOURCE = ("OPENSOURCE", "Open Source")
        RESEARCH = ("RESEARCH", "Research")

    class Availability(models.TextChoices):
        AVAILABLE = ("AVAILABLE", "Available")
        BUSY = ("BUSY", "Busy")
        NOTLOOKING = ("NOTLOOKING", "Not Looking")

    class Visibility(models.TextChoices):
        PUBLIC = ("PUBLIC", "Public")
        PRIVATE = ("PRIVATE", "Private")

    user = models.OneToOneField(
        "accounts.User",
        on_delete= models.CASCADE,
        related_name="profile",
    )
    bio = models.TextField(max_length=300, blank=True)
    college = models.CharField(max_length=50, blank=True)
    branch = models.CharField(max_length=20, blank=True)
    graduation_year = models.PositiveIntegerField(blank=True, null=True,)
    looking_for = models.CharField(
        max_length=30, 
        blank=True, 
        choices=LookingFor.choices, 
        default=LookingFor.PROJECT
        )
    availability = models.CharField(
        max_length=30, 
        blank=True, 
        choices=Availability.choices, 
        default=Availability.AVAILABLE
        )
    github_url = models.URLField(max_length=100, blank=True)
    linkedin_url = models.URLField(max_length=100, blank=True)
    portfolio_url = models.URLField(max_length=100, blank=True)
    email_visibility = models.CharField(max_length=30, choices=Visibility.choices, default=Visibility.PRIVATE)

    def __str__(self):
        return f"{self.user.username}'s Profile"
    



    