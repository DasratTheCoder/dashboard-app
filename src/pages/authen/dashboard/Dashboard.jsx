import { useState, useEffect, useCallback } from "react";
import { 
  Bell, 
  Settings, 
  Key, 
  Package, 
  Server, 
  Plus, 
  LogOut, 
  User, 
  Search,
  Filter,
  Download,
  RefreshCw,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  GitBranch
} from "lucide-react";

const Dashboard = () => {
  // Navigation and UI state
  const [activeTab, setActiveTab] = useState("projects");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewApiKeyModal, setShowNewApiKeyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [copiedKey, setCopiedKey] = useState(null);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Dasrat",
    lastName: "Developer",
    email: "dasrat@example.com",
    company: "Tech Innovations Inc.",
    role: "Full Stack Developer",
    location: "San Francisco, CA",
    timezone: "Pacific Standard Time (PST)",
    bio: "Passionate full-stack developer with 5+ years of experience building scalable web applications.",
    github: "dasrat",
    linkedin: "dasrat-dev",
    website: "https://dasrat.dev"
  });
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Projects state
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "AutoDeploy.AI",
      description: "AI-powered deployment automation platform",
      repo: "github.com/dasrat/autodeploy",
      status: "active",
      lastDeployed: "2 hours ago",
      deployments: 24,
      created: "2025-07-15",
      branch: "main",
      framework: "React",
      url: "https://autodeploy-ai.vercel.app"
    },
    {
      id: 2,
      name: "Portfolio Website",
      description: "Personal portfolio with dynamic content",
      repo: "github.com/dasrat/portfolio",
      status: "failed",
      lastDeployed: "1 day ago",
      deployments: 12,
      created: "2025-06-20",
      branch: "main",
      framework: "Next.js",
      url: "https://portfolio-dasrat.vercel.app"
    },
    {
      id: 3,
      name: "E-commerce API",
      description: "RESTful API for e-commerce platform",
      repo: "github.com/dasrat/ecommerce-api",
      status: "building",
      lastDeployed: "30 minutes ago",
      deployments: 8,
      created: "2025-08-01",
      branch: "develop",
      framework: "Node.js",
      url: "https://api.ecommerce-dasrat.herokuapp.com"
    }
  ]);

  // Deployments state
  const [deployments, setDeployments] = useState([
    { 
      id: 1, 
      project: "AutoDeploy.AI", 
      status: "success", 
      date: "2025-08-22",
      time: "14:30",
      duration: "2m 45s",
      commit: "a1b2c3d",
      branch: "main"
    },
    { 
      id: 2, 
      project: "E-commerce API", 
      status: "building", 
      date: "2025-08-22",
      time: "15:00",
      duration: "1m 20s",
      commit: "e4f5g6h",
      branch: "develop"
    },
    { 
      id: 3, 
      project: "Portfolio Website", 
      status: "failed", 
      date: "2025-08-21",
      time: "09:15",
      duration: "45s",
      commit: "i7j8k9l",
      branch: "main"
    },
  ]);

  // API Keys state
  const [apiKeys, setApiKeys] = useState([
    { 
      id: 1, 
      name: "Production Key",
      key: "sk-prod-1234567890abcdef1234567890abcdef", 
      created: "2025-08-10",
      lastUsed: "2 hours ago",
      usage: 1250,
      hidden: true
    },
    { 
      id: 2, 
      name: "Development Key",
      key: "sk-dev-abcdef1234567890abcdef1234567890", 
      created: "2025-08-18",
      lastUsed: "1 day ago",
      usage: 89,
      hidden: true
    },
  ]);

  // Form states
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    repo: "",
    framework: "react"
  });
  const [newApiKey, setNewApiKey] = useState({
    name: "",
    permissions: "read"
  });

  // Initialize notifications
  useEffect(() => {
    setNotifications([
      { 
        id: 1, 
        text: "Deployment succeeded for AutoDeploy.AI", 
        time: "2h ago", 
        type: "success",
        read: false 
      },
      { 
        id: 2, 
        text: "New API Key 'Development Key' created", 
        time: "1d ago", 
        type: "info",
        read: false 
      },
      { 
        id: 3, 
        text: "Deployment failed for Portfolio Website", 
        time: "3d ago", 
        type: "error",
        read: true 
      },
      { 
        id: 4, 
        text: "Monthly usage report is available", 
        time: "1w ago", 
        type: "info",
        read: true 
      },
    ]);
  }, []);

  // Utility functions
  const addNotification = useCallback((text, type = "info") => {
    const newNotif = {
      id: Date.now(),
      text,
      time: "Just now",
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const copyToClipboard = async (text, keyId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setApiKeys(prev => 
      prev.map(key => 
        key.id === keyId ? { ...key, hidden: !key.hidden } : key
      )
    );
  };

  // Project operations
  const handleAddProject = async () => {
    if (!newProject.name || !newProject.repo) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const project = {
      id: projects.length + 1,
      ...newProject,
      status: "building",
      lastDeployed: "Just now",
      deployments: 0,
      created: new Date().toISOString().split('T')[0],
      branch: "main",
      url: `https://${newProject.name.toLowerCase().replace(/\s+/g, '-')}.vercel.app`
    };
    
    setProjects(prev => [project, ...prev]);
    setNewProject({ name: "", description: "", repo: "", framework: "react" });
    setShowNewProjectModal(false);
    setIsLoading(false);
    
    addNotification(`Project "${project.name}" created successfully`, "success");
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const project = projects.find(p => p.id === projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      addNotification(`Project "${project.name}" deleted`, "info");
    }
  };

  // API Key operations
  const handleAddApiKey = async () => {
    if (!newApiKey.name) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const apiKey = {
      id: apiKeys.length + 1,
      name: newApiKey.name,
      key: `sk-${newApiKey.permissions}-${Math.random().toString(36).substr(2, 32)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Never",
      usage: 0,
      hidden: true
    };
    
    setApiKeys(prev => [apiKey, ...prev]);
    setNewApiKey({ name: "", permissions: "read" });
    setShowNewApiKeyModal(false);
    setIsLoading(false);
    
    addNotification(`API Key "${apiKey.name}" created`, "success");
  };

  const handleSignOut = () => {
    setShowSignOutModal(true);
    setShowProfile(false);
  };

  const confirmSignOut = () => {
    // Simulate sign out process
    addNotification("You have been signed out successfully", "info");
    setShowSignOutModal(false);
    // In a real app, you would redirect to login page or clear auth tokens
    console.log("User signed out");
  };

  const handleProfileSave = async () => {
    setIsProfileSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsProfileSaving(false);
    setShowProfileModal(false);
    addNotification("Profile updated successfully", "success");
  };

  // Filter and search functions
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'building': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': case 'success': return 'bg-green-100 text-green-800';
      case 'failed': case 'error': return 'bg-red-100 text-red-800';
      case 'building': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Project Management</p>
        </div>
        
        <nav className="px-4 space-y-1">
          {[
            { key: "projects", icon: Package, label: "Projects" },
            { key: "deployments", icon: Server, label: "Deployments" },
            { key: "apikeys", icon: Key, label: "API Keys" },
            { key: "settings", icon: Settings, label: "Settings" }
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === key
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab}
              </h1>
              <p className="text-sm text-gray-500">
                {activeTab === 'projects' && `${filteredProjects.length} projects`}
                {activeTab === 'deployments' && `${deployments.length} recent deployments`}
                {activeTab === 'apikeys' && `${apiKeys.length} API keys`}
                {activeTab === 'settings' && 'Manage your account settings'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search (only on projects and deployments) */}
              {(activeTab === 'projects' || activeTab === 'deployments') && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-500">{unreadNotifications.length} unread</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            {getStatusIcon(notification.type)}
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{notification.text}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg"
                >
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                  />
                </button>
                
                {showProfile && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt="Profile"
                          className="w-10 h-10 rounded-full border-2 border-gray-200"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{profileData.firstName} {profileData.lastName}</p>
                          <p className="text-sm text-gray-500">{profileData.email}</p>
                          <p className="text-xs text-gray-400">{profileData.role}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button 
                        onClick={() => {
                          setShowProfileModal(true);
                          setShowProfile(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                      >
                        <User className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Profile Settings</div>
                          <div className="text-xs text-gray-500">Update your information</div>
                        </div>
                      </button>
                      
                      <button className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700">
                        <Settings className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Account Settings</div>
                          <div className="text-xs text-gray-500">Preferences & billing</div>
                        </div>
                      </button>
                      
                      <button className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700">
                        <Bell className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Notifications</div>
                          <div className="text-xs text-gray-500">Manage alerts</div>
                        </div>
                      </button>
                      
                      <div className="border-t border-gray-100 my-2"></div>
                      
                      <button 
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-red-50 text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Sign Out</div>
                          <div className="text-xs text-red-500">End your session</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              {/* Actions Bar */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="building">Building</option>
                    <option value="failed">Failed</option>
                  </select>
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {getStatusIcon(project.status)}
                            <span className="ml-1 capitalize">{project.status}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4" />
                          <span>{project.repo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Framework:</span>
                          <span className="font-medium">{project.framework}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deployments:</span>
                          <span className="font-medium">{project.deployments}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last deployed:</span>
                          <span className="font-medium">{project.lastDeployed}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visit
                        </a>
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deployments Tab */}
          {activeTab === "deployments" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Deployments</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {deployments.map((deployment) => (
                      <tr key={deployment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{deployment.project}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                            {getStatusIcon(deployment.status)}
                            <span className="ml-1 capitalize">{deployment.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {deployment.branch}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                          {deployment.commit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {deployment.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {deployment.date} at {deployment.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === "apikeys" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
                  <p className="text-sm text-gray-500">Manage your API keys for accessing our services</p>
                </div>
                <button
                  onClick={() => setShowNewApiKeyModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Create API Key
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="divide-y divide-gray-200">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                            <span>Created: {apiKey.created}</span>
                            <span>Last used: {apiKey.lastUsed}</span>
                            <span>Usage: {apiKey.usage} requests</span>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <code className="bg-gray-100 px-3 py-1 rounded font-mono text-sm">
                              {apiKey.hidden ? 
                                apiKey.key.replace(/^(.{8}).*(.{8})$/, '$1••••••••••••••••••••$2') : 
                                apiKey.key
                              }
                            </code>
                            <button
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              {apiKey.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                              className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
                            >
                              {copiedKey === apiKey.id ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                              {copiedKey === apiKey.id ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteApiKey(apiKey.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Information
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        defaultValue="Dasrat"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        defaultValue="Developer"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="dasrat@example.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Preferences
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">Email notifications for deployments</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">Push notifications for failures</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-700">Weekly usage reports</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Create New Project</h2>
              <p className="text-sm text-gray-500">Deploy your application with ease</p>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="My Awesome Project"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({...prev, name: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of your project"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({...prev, description: e.target.value}))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repository URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={newProject.repo}
                  onChange={(e) => setNewProject(prev => ({...prev, repo: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Framework
                </label>
                <select
                  value={newProject.framework}
                  onChange={(e) => setNewProject(prev => ({...prev, framework: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="react">React</option>
                  <option value="next.js">Next.js</option>
                  <option value="vue">Vue.js</option>
                  <option value="angular">Angular</option>
                  <option value="node.js">Node.js</option>
                  <option value="express">Express</option>
                  <option value="static">Static HTML</option>
                </select>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowNewProjectModal(false)}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                disabled={isLoading || !newProject.name || !newProject.repo}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New API Key Modal */}
      {showNewApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Create API Key</h2>
              <p className="text-sm text-gray-500">Generate a new API key for your application</p>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Name
                </label>
                <input
                  type="text"
                  placeholder="Production API Key"
                  value={newApiKey.name}
                  onChange={(e) => setNewApiKey(prev => ({...prev, name: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions
                </label>
                <select
                  value={newApiKey.permissions}
                  onChange={(e) => setNewApiKey(prev => ({...prev, permissions: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="read">Read Only</option>
                  <option value="write">Read & Write</option>
                  <option value="admin">Full Access</option>
                </select>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Security Notice</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Keep your API keys secure. Don't share them in public repositories or client-side code.
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowNewApiKeyModal(false)}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddApiKey}
                disabled={isLoading || !newApiKey.name}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Creating...' : 'Create Key'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside handlers */}
      {(showNotifications || showProfile) && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;