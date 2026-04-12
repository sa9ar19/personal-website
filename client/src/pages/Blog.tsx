import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, Calendar, ArrowRight } from "lucide-react";

export default function Blog() {
  const [, navigate] = useLocation();
  const { data: posts, isLoading, error } = trpc.blog.list.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="section-padding bg-secondary/30">
          <div className="container text-center">
            <h1 className="font-serif text-5xl font-semibold mb-4 text-foreground">
              Stories & Reflections
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thoughts, experiences, and insights from my travels and adventures.
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="section-padding">
          <div className="container max-w-3xl">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-muted-foreground" size={32} />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive mb-4">Error loading blog posts</p>
                <button onClick={() => window.location.reload()} className="text-primary hover:opacity-70">
                  Try again
                </button>
              </div>
            ) : !posts || posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">No blog posts yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map((post, i) => (
                  <button
                    key={post.id}
                    onClick={() => navigate(`/blog/${post.id}`)}
                    className="w-full text-left p-6 border border-border bg-card rounded-lg card-hover group"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2 className="font-serif text-2xl font-semibold text-foreground group-hover:text-primary transition-colors flex-1">
                        {post.title}
                      </h2>
                      <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                    </div>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt || post.content.substring(0, 150)}
                    </p>
                    
                    {post.publishedAt && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={14} />
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
