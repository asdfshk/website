
import React, { useMemo } from 'react';
import { useProjectData } from '@/hooks/useProjectData';

const Skills = () => {
  const { skills } = useProjectData();
  
  const skillsByCategory = useMemo(() => {
    return skills.reduce<Record<string, typeof skills>>((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});
  }, [skills]);

  const categories = Object.keys(skillsByCategory).sort();
  
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-4">My Skills</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Technologies and tools I've worked with throughout my computer science journey.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-2xl font-bold mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillsByCategory[category]
                .sort((a, b) => b.level - a.level)
                .map((skill) => (
                  <div key={skill.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      
      {skills.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No skills available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Skills;
