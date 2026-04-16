import { useState } from "react";
<<<<<<< HEAD
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Image as ImageIcon, Check, AlertCircle, MapPin, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Admin() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'destinations' | 'blogs'>('destinations');

  // --- Destination Form State ---
  const [destName, setDestName] = useState("");
  const [destDetail, setDestDetail] = useState("");
  const [destImage, setDestImage] = useState<string | null>(null);

  // --- Blog Form State ---
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogImage, setBlogImage] = useState<string | null>(null);

  // --- UI States ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Mutations ---
  const createDestMutation = trpc.destinations.create.useMutation({
    onSuccess: () => {
      showToast("Destination created successfully!");
      setDestName(""); setDestDetail(""); setDestImage(null);
      setIsSubmitting(false);
    },
    onError: (err) => { showToast(err.message, "error"); setIsSubmitting(false); }
  });

  const createBlogMutation = trpc.blogs?.create?.useMutation({
    onSuccess: () => {
      showToast("Blog post published!");
      setBlogTitle(""); setBlogContent(""); setBlogImage(null);
      setIsSubmitting(false);
    },
    onError: (err) => { showToast(err.message, "error"); setIsSubmitting(false); }
  });

  if (authLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user || user.role !== "admin") { navigate("/"); return null; }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'dest' | 'blog') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'dest') setDestImage(reader.result as string);
      else setBlogImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitDest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    createDestMutation.mutate({
      destinationName: destName,
      destinationDetail: destDetail,
      coverImageBase64: destImage || undefined
    });
  };

  const handleSubmitBlog = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (createBlogMutation) {
      createBlogMutation.mutate({
        title: blogTitle,
        content: blogContent,
        coverImageBase64: blogImage || undefined
      });
    } else {
      showToast("Blog backend routes not found!", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-6 z-[200] animate-in slide-in-from-right-full duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
            toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}>
            {toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your travel stories and destinations.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-secondary/30 rounded-2xl mb-10 max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab('destinations')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${activeTab === 'destinations' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <MapPin size={18} /> Destinations
          </button>
          <button 
            onClick={() => setActiveTab('blogs')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${activeTab === 'blogs' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <FileText size={18} /> Blog Posts
          </button>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
          {activeTab === 'destinations' ? (
            <form onSubmit={handleSubmitDest} className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Create New Destination</h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Destination Name</label>
                <input value={destName} onChange={(e) => setDestName(e.target.value)} required className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all" placeholder="e.g. Santorini, Greece" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Description</label>
                <textarea value={destDetail} onChange={(e) => setDestDetail(e.target.value)} required rows={5} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all" placeholder="Tell the story of this place..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Cover Image</label>
                <label className="flex flex-col items-center justify-center w-full h-48 bg-secondary/10 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:bg-secondary/20 transition-all overflow-hidden relative">
                  {destImage ? <img src={destImage} className="w-full h-full object-cover" /> : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <ImageIcon size={32} className="mb-2" />
                      <span>Click to upload cover photo</span>
                    </div>
                  )}
                  <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'dest')} accept="image/*" />
                </label>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Create Destination</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitBlog} className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Write New Blog Post</h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Blog Title</label>
                <input value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} required className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all" placeholder="e.g. 5 Tips for Solo Travelers" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Content</label>
                <textarea value={blogContent} onChange={(e) => setBlogContent(e.target.value)} required rows={10} className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all" placeholder="Write your heart out..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Blog Cover Image</label>
                <label className="flex flex-col items-center justify-center w-full h-48 bg-secondary/10 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:bg-secondary/20 transition-all overflow-hidden relative">
                  {blogImage ? <img src={blogImage} className="w-full h-full object-cover" /> : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <ImageIcon size={32} className="mb-2" />
                      <span>Click to upload blog cover</span>
                    </div>
                  )}
                  <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'blog')} accept="image/*" />
                </label>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <><Check size={20} /> Publish Blog Post</>}
              </button>
            </form>
          )}
        </div>
      </main>
=======
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("destinations");

  // Destination form state
  const [destName, setDestName] = useState("");
  const [destDesc, setDestDesc] = useState("");

  // Blog form state
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");

  // Queries
  const { data: destinations, refetch: refetchDest } = trpc.destinations.list.useQuery();
  const { data: posts, refetch: refetchPosts } = trpc.blog.list.useQuery();

  // Mutations
  const createDestMutation = trpc.admin.destinations.create.useMutation({
    onSuccess: () => {
      toast.success("Destination created!");
      setDestName("");
      setDestDesc("");
      refetchDest();
    },
    onError: (err) => toast.error(err.message),
  });

  const createBlogMutation = trpc.admin.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post created!");
      setBlogTitle("");
      setBlogContent("");
      setBlogExcerpt("");
      refetchPosts();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteDestMutation = trpc.admin.destinations.delete.useMutation({
    onSuccess: () => {
      toast.success("Destination deleted!");
      refetchDest();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteBlogMutation = trpc.admin.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted!");
      refetchPosts();
    },
    onError: (err) => toast.error(err.message),
  });

  // Auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }
  if (!isAuthenticated || user?.role !== "admin") {
    navigate("/login");
    return null;
  }
  // if (!isAuthenticated || user?.role !== "admin") {
  //   return (
  //     <div className="min-h-screen flex flex-col">
  //       <Navbar />
  //       <main className="flex-1 flex items-center justify-center">
  //         <div className="text-center">
  //           <h1 className="font-serif text-3xl font-semibold mb-2 text-foreground">
  //             Access Denied
  //           </h1>
  //           <p className="text-muted-foreground mb-6">
  //             You need admin privileges to access this page.
  //           </p>
  //           <button
  //             onClick={() => navigate("/")}
  //             className="px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
  //           >
  //             Go Home
  //           </button>
  //         </div>
  //       </main>
  //       <Footer />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <h1 className="font-serif text-4xl font-semibold mb-2 text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your gallery, blog posts, and social links
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container max-w-5xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="destinations">Destinations</TabsTrigger>
                <TabsTrigger value="blog">Blog Posts</TabsTrigger>
                <TabsTrigger value="social">Social Links</TabsTrigger>
              </TabsList>

              {/* Destinations Tab */}
              <TabsContent value="destinations" className="space-y-6">
                <div className="p-6 border border-border bg-card rounded-lg">
                  <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">
                    Create New Destination
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Destination Name *
                      </label>
                      <input
                        type="text"
                        value={destName}
                        onChange={(e) => setDestName(e.target.value)}
                        placeholder="e.g., Himalayas, Bali, Swiss Alps"
                        className="w-full px-4 py-2 border border-border rounded bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Description
                      </label>
                      <textarea
                        value={destDesc}
                        onChange={(e) => setDestDesc(e.target.value)}
                        placeholder="Tell the story of this destination..."
                        rows={3}
                        className="w-full px-4 py-2 border border-border rounded bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!destName.trim()) {
                          toast.error("Destination name is required");
                          return;
                        }
                        createDestMutation.mutate({
                          name: destName,
                          description: destDesc || undefined,
                        });
                      }}
                      disabled={createDestMutation.isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {createDestMutation.isPending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Plus size={18} />
                      )}
                      Create Destination
                    </button>
                  </div>
                </div>

                {/* Destinations List */}
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">
                    Your Destinations
                  </h3>
                  <div className="space-y-3">
                    {destinations && destinations.length > 0 ? (
                      destinations.map(dest => (
                        <div
                          key={dest.id}
                          className="p-4 border border-border bg-card rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <h4 className="font-semibold text-foreground">{dest.name}</h4>
                            <p className="text-sm text-muted-foreground">{dest.description}</p>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm("Delete this destination?")) {
                                deleteDestMutation.mutate({ id: dest.id });
                              }
                            }}
                            disabled={deleteDestMutation.isPending}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No destinations yet. Create one above!
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Blog Tab */}
              <TabsContent value="blog" className="space-y-6">
                <div className="p-6 border border-border bg-card rounded-lg">
                  <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">
                    Create New Blog Post
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        placeholder="Your blog post title"
                        className="w-full px-4 py-2 border border-border rounded bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Excerpt
                      </label>
                      <input
                        type="text"
                        value={blogExcerpt}
                        onChange={(e) => setBlogExcerpt(e.target.value)}
                        placeholder="Short summary of the post"
                        className="w-full px-4 py-2 border border-border rounded bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Content *
                      </label>
                      <textarea
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        placeholder="Write your full blog post here..."
                        rows={6}
                        className="w-full px-4 py-2 border border-border rounded bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!blogTitle.trim()) {
                          toast.error("Blog title is required");
                          return;
                        }
                        if (!blogContent.trim()) {
                          toast.error("Blog content is required");
                          return;
                        }
                        createBlogMutation.mutate({
                          title: blogTitle,
                          content: blogContent,
                          excerpt: blogExcerpt || undefined,
                          publishedAt: new Date(),
                        });
                      }}
                      disabled={createBlogMutation.isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {createBlogMutation.isPending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Plus size={18} />
                      )}
                      Publish Post
                    </button>
                  </div>
                </div>

                {/* Blog Posts List */}
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">
                    Your Blog Posts
                  </h3>
                  <div className="space-y-3">
                    {posts && posts.length > 0 ? (
                      posts.map(post => (
                        <div
                          key={post.id}
                          className="p-4 border border-border bg-card rounded-lg flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{post.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {post.excerpt || post.content.substring(0, 100)}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm("Delete this blog post?")) {
                                deleteBlogMutation.mutate({ id: post.id });
                              }
                            }}
                            disabled={deleteBlogMutation.isPending}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50 ml-4"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No blog posts yet. Create one above!
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Social Links Tab */}
              <TabsContent value="social" className="space-y-6">
                <div className="p-6 border border-border bg-card rounded-lg">
                  <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">
                    Manage Social Links
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Social links are managed through the database. Add records to the <code className="bg-secondary px-2 py-1 rounded text-sm">social_links</code> table with:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6 text-sm">
                    <li><strong>platform:</strong> github, linkedin, twitter, instagram, email</li>
                    <li><strong>url:</strong> Full URL to your profile</li>
                    <li><strong>icon:</strong> (optional) Icon name</li>
                    <li><strong>order:</strong> Display order (1, 2, 3...)</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Example: platform="github", url="https://github.com/yourname"
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

>>>>>>> d0a6ff7366ca6b6442c6ae10f05246e32109fee5
      <Footer />
    </div>
  );
}
