import { useState } from "react";
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
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-semibold mb-2 text-foreground">
              Access Denied
            </h1>
            <p className="text-muted-foreground mb-6">
              You need admin privileges to access this page.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
            >
              Go Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

      <Footer />
    </div>
  );
}
