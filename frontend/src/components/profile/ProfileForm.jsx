import { useEffect, useState } from "react"

import { updateProfile } from "../../api/profile"
import { getSkills } from "../../api/skills"

import TextInput from "../forms/TextInput"
import TextAreaField from "../forms/TextAreaField"
import SelectField from "../forms/SelectField"
import SkillSelector from "../forms/SkillSelector"
import "./ProfileForm.css"

import {
    availabilityOptions,
    lookingForOptions,
} from "../../constants/ProfileOptions"

function ProfileForm({ profile, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        bio: profile.bio || "",
        college: profile.college || "",
        branch: profile.branch || "",
        graduation_year: profile.graduation_year || "",
        skill_ids: profile.skills.map(skill => skill.id),
        availability: profile.availability || "",
        looking_for: profile.looking_for || "",
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
        portfolio_url: profile.portfolio_url || "",
    })
    const [skills, setSkills] = useState([])
    useEffect(() => {
        async function loadSkills() {
            try {
                const data = await getSkills()
                console.log(data)
                setSkills(data)
            } catch (error) {
                console.error(error)
            }
        }

        loadSkills()
    }, [])

    function handleChange(e) {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    function handleSkillsChange(updatedSkills) {
        setFormData((prev) => ({
            ...prev,
            skill_ids: updatedSkills,
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const updatedProfile = await updateProfile(formData)
            onSave(updatedProfile)
        } catch (error) {
            console.log(error.response.data)
            console.error(error.response.data)
        }
    }

    return (
        <form 
            onSubmit={handleSubmit}
            className="profile-form"
        >   
            <h1>Edit Profile</h1>

            <div className="form-section">
                
                <h3>About</h3>

                <TextAreaField
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell others about yourself..."
                />

                <div className="form-grid">

                    <TextInput
                        label="College"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        placeholder="Enter your college"
                    />

                    <TextInput
                        label="Branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        placeholder="Enter your branch"
                    />

                    <TextInput
                        label="Graduation Year"
                        name="graduation_year"
                        type="number"
                        value={formData.graduation_year}
                        onChange={handleChange}
                        placeholder="Enter your graduation year"
                    />

                </div>
            </div>

            <div className="form-section">

                <h3>Skills & Preferences</h3>

                <SkillSelector 
                    label="Skills"
                    skills={skills}
                    selectedSkills={formData.skill_ids}
                    onChange={handleSkillsChange}
                />

                <div className="form-grid">

                    <SelectField
                        label="Availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        options={availabilityOptions}
                        placeholder="Select Availability"
                    />

                    <SelectField
                        label="Looking For"
                        name="looking_for"
                        value={formData.looking_for}
                        onChange={handleChange}
                        options={lookingForOptions}
                        placeholder="Select what you're looking for"
                    />

                </div>
            </div>

            <div className="form-section">

                <h3>Links</h3>

                <TextInput
                    label="GitHub URL"
                    name="github_url"
                    type="url"
                    value={formData.github_url}
                    onChange={handleChange}
                    placeholder="Enter your GitHub link"
                />

                <TextInput
                    label="LinkedIn URL"
                    name="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    placeholder="Enter your LinkedIn link"
                />

                <TextInput
                    label="Portfolio URL"
                    name="portfolio_url"
                    type="url"
                    value={formData.portfolio_url}
                    onChange={handleChange}
                    placeholder="Enter your Portfolio link"
                />
            </div>

            <div className="form-actions">
                <button
                    className="cancel-btn"
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    className="save-btn"
                    type="submit"
                >
                    Save Changes
                </button>
            </div>

        </form>
    );
}

export default ProfileForm