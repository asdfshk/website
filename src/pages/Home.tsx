
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProjectData } from '@/hooks/useProjectData';

const Home = () => {
  const { projects, skills } = useProjectData();
  const featuredProjects = projects.filter(project => project.featured);
  const topSkills = skills.sort((a, b) => b.level - a.level).slice(0, 5);

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-12 py-16">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Hello, I'm <span className="gradient-text">John Connor</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Computer Science Graduate & Machine Learning Enthusiast
          </p>
          <div className="code-block">
            <pre><code>const skills = ['Python', 'Machine Learning', 'React', 'TypeScript', 'Distributed Systems'];</code></pre>
            <pre><code>const passion = 'Building intelligent systems that solve real problems';</code></pre>
          </div>
          <div className="flex gap-4">
            <Link to="/projects">
              <Button>View Projects</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline">Contact Me</Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-tech-purple via-tech-blue to-tech-green p-1 animate-pulse-slow">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <span className="font-mono text-5xl text-primary">JC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <h2 className="section-heading">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map(project => (
            <div key={project.id} className="border border-border rounded-lg overflow-hidden hover:border-primary transition-colors">
              <div className="bg-card p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
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
        <div className="mt-8 text-center">
          <Link to="/projects">
            <Button variant="outline">View All Projects</Button>
          </Link>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16">
        <h2 className="section-heading">Top Skills</h2>
        <div className="space-y-4">
          {topSkills.map(skill => (
            <div key={skill.id} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{skill.name}</span>
                <span className="text-muted-foreground">{skill.category}</span>
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
        <div className="mt-8 text-center">
          <Link to="/skills">
            <Button variant="outline">View All Skills</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
