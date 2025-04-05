
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
}

interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category: string;
}

interface ProjectDataContextType {
  projects: Project[];
  experience: Experience[];
  skills: Skill[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addExperience: (experienceItem: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
}

const ProjectDataContext = createContext<ProjectDataContextType | undefined>(undefined);

export const ProjectDataProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const { toast } = useToast();

  // Fetch data on component mount
  useEffect(() => {
    fetchProjects();
    fetchExperience();
    fetchSkills();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        const formattedProjects: Project[] = data.map((project: Tables<'projects'>) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          technologies: project.technologies,
          githubUrl: project.github_url || undefined,
          demoUrl: project.demo_url || undefined,
          imageUrl: project.image_url || undefined,
          featured: project.featured,
        }));
        setProjects(formattedProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects data.",
        variant: "destructive",
      });
    }
  };

  const fetchExperience = async () => {
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        const formattedExperience: Experience[] = data.map((exp: Tables<'experience'>) => ({
          id: exp.id,
          title: exp.title,
          company: exp.company,
          location: exp.location,
          startDate: exp.start_date,
          endDate: exp.end_date || undefined,
          current: exp.current,
          description: exp.description,
        }));
        setExperience(formattedExperience);
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
      toast({
        title: "Error",
        description: "Failed to load experience data.",
        variant: "destructive",
      });
    }
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        const formattedSkills: Skill[] = data.map((skill: Tables<'skills'>) => ({
          id: skill.id,
          name: skill.name,
          level: skill.level,
          category: skill.category,
        }));
        setSkills(formattedSkills);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast({
        title: "Error",
        description: "Failed to load skills data.",
        variant: "destructive",
      });
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: project.title,
          description: project.description,
          technologies: project.technologies,
          github_url: project.githubUrl,
          demo_url: project.demoUrl,
          image_url: project.imageUrl,
          featured: project.featured,
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const newProject: Project = {
          id: data.id,
          title: data.title,
          description: data.description,
          technologies: data.technologies,
          githubUrl: data.github_url || undefined,
          demoUrl: data.demo_url || undefined,
          imageUrl: data.image_url || undefined,
          featured: data.featured,
        };

        setProjects(prev => [...prev, newProject]);
        
        toast({
          title: "Project added",
          description: `${project.title} has been added to your portfolio.`,
        });
      }
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add project.",
        variant: "destructive",
      });
    }
  };

  const updateProject = async (id: string, projectUpdates: Partial<Project>) => {
    try {
      // Convert from client model to database model
      const updates: any = {};
      if ('title' in projectUpdates) updates.title = projectUpdates.title;
      if ('description' in projectUpdates) updates.description = projectUpdates.description;
      if ('technologies' in projectUpdates) updates.technologies = projectUpdates.technologies;
      if ('githubUrl' in projectUpdates) updates.github_url = projectUpdates.githubUrl;
      if ('demoUrl' in projectUpdates) updates.demo_url = projectUpdates.demoUrl;
      if ('imageUrl' in projectUpdates) updates.image_url = projectUpdates.imageUrl;
      if ('featured' in projectUpdates) updates.featured = projectUpdates.featured;

      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setProjects(projects.map(project => 
        project.id === id ? { ...project, ...projectUpdates } : project
      ));
      
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update project.",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const projectToDelete = projects.find(project => project.id === id);
      
      if (!projectToDelete) {
        toast({
          title: "Error",
          description: "Project not found.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
      
      toast({
        title: "Project deleted",
        description: `${projectToDelete.title} has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete project.",
        variant: "destructive",
      });
    }
  };

  const addExperience = async (experienceItem: Omit<Experience, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('experience')
        .insert([{
          title: experienceItem.title,
          company: experienceItem.company,
          location: experienceItem.location,
          start_date: experienceItem.startDate,
          end_date: experienceItem.endDate,
          current: experienceItem.current,
          description: experienceItem.description,
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const newExperience: Experience = {
          id: data.id,
          title: data.title,
          company: data.company,
          location: data.location,
          startDate: data.start_date,
          endDate: data.end_date || undefined,
          current: data.current,
          description: data.description,
        };

        setExperience(prev => [...prev, newExperience]);
        
        toast({
          title: "Experience added",
          description: `${experienceItem.title} at ${experienceItem.company} has been added.`,
        });
      }
    } catch (error) {
      console.error('Error adding experience:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add experience.",
        variant: "destructive",
      });
    }
  };

  const updateExperience = async (id: string, experienceUpdates: Partial<Experience>) => {
    try {
      // Convert from client model to database model
      const updates: any = {};
      if ('title' in experienceUpdates) updates.title = experienceUpdates.title;
      if ('company' in experienceUpdates) updates.company = experienceUpdates.company;
      if ('location' in experienceUpdates) updates.location = experienceUpdates.location;
      if ('startDate' in experienceUpdates) updates.start_date = experienceUpdates.startDate;
      if ('endDate' in experienceUpdates) updates.end_date = experienceUpdates.endDate;
      if ('current' in experienceUpdates) updates.current = experienceUpdates.current;
      if ('description' in experienceUpdates) updates.description = experienceUpdates.description;

      const { error } = await supabase
        .from('experience')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setExperience(experience.map(exp => 
        exp.id === id ? { ...exp, ...experienceUpdates } : exp
      ));
      
      toast({
        title: "Experience updated",
        description: "Your experience has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating experience:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update experience.",
        variant: "destructive",
      });
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      const experienceToDelete = experience.find(exp => exp.id === id);
      
      if (!experienceToDelete) {
        toast({
          title: "Error",
          description: "Experience not found.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setExperience(prevExperience => prevExperience.filter(exp => exp.id !== id));
      
      toast({
        title: "Experience deleted",
        description: `${experienceToDelete.title} at ${experienceToDelete.company} has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete experience.",
        variant: "destructive",
      });
    }
  };

  const addSkill = async (skill: Omit<Skill, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert([{
          name: skill.name,
          level: skill.level,
          category: skill.category,
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const newSkill: Skill = {
          id: data.id,
          name: data.name,
          level: data.level,
          category: data.category,
        };

        setSkills(prev => [...prev, newSkill]);
        
        toast({
          title: "Skill added",
          description: `${skill.name} has been added to your skills.`,
        });
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add skill.",
        variant: "destructive",
      });
    }
  };

  const updateSkill = async (id: string, skillUpdates: Partial<Skill>) => {
    try {
      const updates = {
        name: skillUpdates.name,
        level: skillUpdates.level,
        category: skillUpdates.category,
      };

      const { error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setSkills(skills.map(skill => 
        skill.id === id ? { ...skill, ...skillUpdates } : skill
      ));
      
      toast({
        title: "Skill updated",
        description: "Your skill has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating skill:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update skill.",
        variant: "destructive",
      });
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const skillToDelete = skills.find(skill => skill.id === id);
      
      if (!skillToDelete) {
        toast({
          title: "Error",
          description: "Skill not found.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setSkills(prevSkills => prevSkills.filter(skill => skill.id !== id));
      
      toast({
        title: "Skill deleted",
        description: `${skillToDelete.name} has been deleted from your skills.`,
      });
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete skill.",
        variant: "destructive",
      });
    }
  };

  return (
    <ProjectDataContext.Provider value={{
      projects,
      experience,
      skills,
      addProject,
      updateProject,
      deleteProject,
      addExperience,
      updateExperience,
      deleteExperience,
      addSkill,
      updateSkill,
      deleteSkill,
    }}>
      {children}
    </ProjectDataContext.Provider>
  );
};

export const useProjectData = () => {
  const context = useContext(ProjectDataContext);
  
  if (context === undefined) {
    throw new Error('useProjectData must be used within a ProjectDataProvider');
  }
  
  return context;
};
