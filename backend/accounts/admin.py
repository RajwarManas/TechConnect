from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import *


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ("email",)
    list_display = ("email", "username", "is_staff", "is_active")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("username", "first_name", "last_name")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "username",
                    "password1",
                    "password2",
                ),
            },
        ),
    )

    search_fields = ("email", "username")


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "college",
        "branch",
        "graduation_year",
        "availability",
    )
    search_fields = (
        "user__email",
        "user__username",
        "college",
    )
    filter_horizontal = (
        "skills",
    )


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = (
        "name",
    )
    search_fields = (
        "name",
    )

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display=(
        "title",
        "owner",
        "status",
        "max_members",
        "is_active",
        "created_at",
    )
    search_fields = (
        "title",
        "owner__username",
        "owner__email",
    )

@admin.register(JoinRequest)
class JoinRequestAdmin(admin.ModelAdmin):
    list_display=(
        "user",
        "project",
        "status",
    )