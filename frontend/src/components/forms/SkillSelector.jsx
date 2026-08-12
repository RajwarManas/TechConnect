import { useState } from "react"
import "./SkillSelector.css"

function SkillSelector({
    label,
    skills = [],
    selectedSkills = [],
    onChange,
}) {
    const [open, setOpen] = useState(false)

    function handleSkillToggle(skillId) {
        let updatedSkills
        if(selectedSkills.includes(skillId)) {
            updatedSkills = selectedSkills.filter(id => id !== skillId)
        }
        else {
            updatedSkills= [
                ...selectedSkills,
                skillId,
            ]
        }
        onChange(updatedSkills)
    }
    return (
        <div className="skill-selector">
    
            <button
                type="button"
                className="skill-dropdown"
                onClick={() => setOpen(!open)}
            >
                <span>{label}</span>
    
                <span>
                    {open ? "▲" : "▼"}
                </span>
            </button>
    
            {selectedSkills.length > 0 && (
                <div className="selected-skills">
                    {selectedSkills.length} selected
                </div>
            )}
    
            {open && (
                <div className="skills-list">
    
                    {skills.map(skill => (
                        <div
                            key={skill.id}
                            className="skill-item"
                        >
    
                            <input
                                id={`skill-${skill.id}`}
                                type="checkbox"
                                checked={selectedSkills.includes(skill.id)}
                                onChange={() => handleSkillToggle(skill.id)}
                            />
    
                            <label htmlFor={`skill-${skill.id}`}>
                                {skill.name}
                            </label>
    
                        </div>
                    ))}
    
                </div>
            )}
    
        </div>
    )
}

export default SkillSelector