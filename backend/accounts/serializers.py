from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth import authenticate
from .models import *


class UserRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only= True)

    class Meta:
        model = User
        fields = ("email", "username", "password", "confirm_password")
        extra_kwargs = {"password": {"write_only": True}}
        
    def validate(self, attrs):
        if attrs.get("password")!=attrs.get("confirm_password"):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        return attrs
    
    def create(self, validated_data):
        validated_data.pop("confirm_password", None)

        return User.objects.create_user(**validated_data)

    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only= True)
    
    def validate(self, attrs):
        user = authenticate(
            username=attrs.get("email"),
            password=attrs.get("password"),
        )
        if not user:
            raise serializers.ValidationError({"detail": "Invalid email or password"})

        attrs["user"]=user
        return attrs

class UserLogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(write_only=True)
    def validate(self, attrs):
        try:
            RefreshToken(attrs["refresh"])
        except TokenError:
            raise serializers.ValidationError(
                {"refresh": "invalid or expired efresh token"}
            )
        
        return attrs
    
    def save(self):
        refresh_token=self.validated_data["refresh"]
        token=RefreshToken(refresh_token)
        token.blacklist


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = (
            "id",
            "name",
        )


class ProfileUpdateSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(
        many=True,
        read_only=True
    )
    skill_ids = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(),
        many=True,
        source="skills",
        write_only=True,
        required=False,
    )
    id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    class Meta:
        model = Profile
        fields = (
            "id",
            "username",
            "bio", 
            "college", 
            "branch", 
            "graduation_year", 
            "looking_for",
            "availability",
            "github_url",
            "linkedin_url",
            "portfolio_url",
            "skills",
            "skill_ids",
        )


class ProfileListSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    class Meta:
        model=Profile   
        fields=(
            "user",
            "id",
            "username",
            "bio",
            "college",
            "branch",
            "graduation_year",
            "looking_for",
            "availability",
            "github_url",
            "linkedin_url",
            "portfolio_url",
            "skills",
        )

class ProjectCreateSerializer(serializers.ModelSerializer):
    required_skills=serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(),
        many=True
    )
    class Meta:
        model=Project
        fields=(
            "title",
            "description",
            "required_skills",
            "max_members",
        )

class ProjectOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
        )

class ProjectListSerializer(serializers.ModelSerializer):
    owner=ProjectOwnerSerializer(read_only=True)
    required_skills=SkillSerializer(many=True, read_only=True)
    has_pending_request=serializers.SerializerMethodField()

    def get_has_pending_request(self, obj):
        request = self.context["request"]
        user = request.user
        if user.is_anonymous:
            return False
        return JoinRequest.objects.filter(
            project=obj,
            user=user,
            status=JoinRequest.Status.PENDING
        ).exists()
    class Meta:
        model=Project
        fields=(
            "id",
            "title",
            "description",
            "owner",
            "required_skills",
            "status",
            "max_members",
            "created_at",
            "has_pending_request",
        )

class ProjectUpdateSerializer(serializers.ModelSerializer):
    required_skills=serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(),
        many=True
    )
    class Meta:
        model=Project
        fields=(
            "title",
            "description",
            "required_skills",
            "status",
            "max_members",
        )
    
class JoinRequestProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "status",
        )


class JoinRequestUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
        )


class JoinRequestSerializer(serializers.ModelSerializer):
    project = JoinRequestProjectSerializer(read_only=True)
    user = JoinRequestUserSerializer(read_only=True)

    class Meta:
        model = JoinRequest
        fields = (
            "id",
            "user",
            "project",
            "status",
        )

class ProjectAttentionSerializer(serializers.ModelSerializer):
    pending_requests = serializers.IntegerField(read_only=True)

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "pending_requests",
        )

    def get_pending_requests(self, obj):
        return obj.join_requests.filter(
            status=JoinRequest.Status.PENDING
        ).count()
    
class DashboardSerializer(serializers.Serializer):
    projects_owned = serializers.IntegerField()
    projects_joined = serializers.IntegerField()
    pending_requests_received = serializers.IntegerField()
    pending_requests_sent = serializers.IntegerField()
    recruiting_projects = serializers.IntegerField()
    completed_projects = serializers.IntegerField()
    projects_needing_attention = ProjectAttentionSerializer(many=True)
