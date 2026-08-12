import { useEffect, useState } from "react"

import { getSkills } from "../../api/skills"

import TextInput from "../forms/TextInput"
import TextAreaField from "../forms/TextAreaField"
import SkillSelector from "../forms/SkillSelector"
import "./ProjectForm.css"

function ProjectForm({ project, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        title : "",
        description : "",
        required_skills : [],
        max_members : "",
    })

    const [skills, setSkills] = useState([])
    useEffect(() => {
        async function loadSkills() {
            try {
                const data = await getSkills()
                console.log(data)
                setSkills(data.results)
            } catch (error) {
                console.error(error)
            }
        }
        loadSkills()
    }, [])
    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                description: project.description,
                required_skills:  project.required_skills.map(
                    (skill) => skill.id
                ),
                max_members: project.max_members,
            });
        }
    }, [project]);

    function handleChange(e) {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    function handleSkillsChange(updatedSkills) {
        setFormData((prev) => ({
            ...prev,
            required_skills: updatedSkills,
        }))
    }

     async function handleSubmit(e) {
        e.preventDefault()
        await onSave(formData)
    }

    return (
        <form 
            className="project-form"
            onSubmit={handleSubmit}
        >
            <h1>
                {project? "Edit Project" : "Create Project"}
            </h1>

            <TextInput
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter Title of Project"
            />

            <TextAreaField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project..."
            />

            <SkillSelector 
                label="Skills"
                skills={skills}
                selectedSkills={formData.required_skills}
                onChange={handleSkillsChange}
            />

            <TextInput 
                label="Max Members"
                name="max_members"
                value={formData.max_members}
                onChange={handleChange}
                placeholder="Max members allowed"
            />

            <button 
                className="primary-btn"
                type="submit"
            >
                {project ? "Update" : "Create" }
            </button>
            {onCancel && (
                <button
                    type="button"
                    className="secondary-btn"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            )}
        </form>
    );


}

export default ProjectForm