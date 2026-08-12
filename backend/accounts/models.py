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

    user = models.OneToOneField(
        "accounts.User",
        on_delete= models.CASCADE,
        related_name="profile",
    )
    skills = models.ManyToManyField(
        "accounts.Skill",
        related_name="profiles",
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

    def __str__(self):
        return f"{self.user.username}'s Profile"
    

class Skill(models.Model):
    class Meta:
        ordering=["name"]
    name = models.CharField(max_length=100,blank=True, unique=True)
    def __str__(self):
        return self.name
    
class Project(models.Model):
    class Status(models.TextChoices):
        RECRUITING=("RECRUITING", "Recruiting")
        FULL=("FULL", "Full")
        COMPLETED=("COMPLETED", "Completed")

    class Meta:
        ordering=["-created_at"]
        
    owner=models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="owned_projects"
    )
    title=models.CharField(max_length=100)
    description=models.TextField(max_length=500)
    required_skills=models.ManyToManyField(
        "accounts.Skill",
        related_name='projects'
    )
    status=models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.RECRUITING
    )
    max_members=models.PositiveIntegerField()
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    is_active=models.BooleanField(default=True, db_index=True)
    members=models.ManyToManyField(
        "accounts.User",
        related_name="member_projects",
        blank=True,
    )
    
    def __str__(self):
        return f"{self.title} ({self.owner.username})"


class JoinRequest(models.Model):
    class Status(models.TextChoices):
        PENDING=("PENDING", "Pending")
        ACCEPTED=("ACCEPTED", "Accepted")
        REJECTED=("REJECTED", "Rejected")
    class Meta:
        ordering=["-created_at"]
        constraints=[
            models.UniqueConstraint(
                fields=['user', 'project'],
                name="unique_user_project_request"
            )
        ]

    user=models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="join_requests"
    )
    project=models.ForeignKey(
        "accounts.Project",
        on_delete=models.CASCADE,
        related_name="join_requests"
    )
    status=models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.PENDING)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} -> {self.project.title} ({self.status})"
    