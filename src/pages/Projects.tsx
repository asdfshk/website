
import React from 'react';
import { useProjectData } from '@/hooks/useProjectData';

const Projects = () => {
  const { projects } = useProjectData();

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-4">My Projects</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A collection of my work in computer science, machine learning, and software development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <div key={project.id} className="border border-border rounded-lg overflow-hidden hover:border-primary transition-colors">
            <div className="bg-card p-6">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-muted-foreground mb-4 h-20 overflow-y-auto">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="bg-secondary px-2 py-1 rounded-full text-xs font-medium">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                    GitHub Repository
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
