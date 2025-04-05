
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectData } from '@/hooks/useProjectData';
import { useFileStorage } from '@/hooks/useFileStorage';

const Dashboard = () => {
  const { projects, experience, skills } = useProjectData();
  const { files } = useFileStorage();

  const stats = [
    { name: 'Projects', value: projects.length, link: '/admin/projects' },
    { name: 'Experience', value: experience.length, link: '/admin/experience' },
    { name: 'Skills', value: skills.length, link: '/admin/skills' },
    { name: 'Files', value: files.length, link: '/admin/files' },
  ];

  const recentProjects = [...projects].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 3);
  const recentFiles = [...files].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your portfolio content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link to={stat.link} key={stat.name}>
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{stat.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{stat.value}</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Manage {stat.name.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Recently added projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="p-4 border border-border rounded-md hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.technologies.join(', ')}
                        </p>
                      </div>
                      <Link 
                        to={`/admin/projects/edit/${project.id}`}
                        className="text-primary text-sm hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No projects yet.</p>
              )}
              <div className="pt-4 text-right">
                <Link to="/admin/projects" className="text-primary text-sm hover:underline">
                  View all projects
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Files */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Files</CardTitle>
            <CardDescription>Recently uploaded files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFiles.length > 0 ? (
                recentFiles.map((file) => (
                  <div 
                    key={file.id} 
                    className="p-4 border border-border rounded-md hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Link 
                        to={`/admin/files`}
                        className="text-primary text-sm hover:underline"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No files uploaded yet.</p>
              )}
              <div className="pt-4 text-right">
                <Link to="/admin/files" className="text-primary text-sm hover:underline">
                  Manage all files
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
