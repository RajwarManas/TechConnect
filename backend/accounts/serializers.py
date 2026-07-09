from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Profile


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
    

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = (
            "bio", 
            "college", 
            "branch", 
            "graduation_year", 
            "looking_for",
            "availability",
            "github_url",
            "linkedin_url",
            "portfolio_url",
            "email_visibility",
        )