import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, ChevronLeft, Calendar } from "lucide-react";

export default function BlogDetail() {
  const [location, navigate] = useLocation();
  const postId = parseInt(location.split("/").pop() || "0");
  
  const { data: post, isLoading } = trpc.blog.getById.useQuery({ id: postId });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : !post ? (
          <div className="flex items-center justify-center py-40">
            <p className="text-muted-foreground">Post not found</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <section className="section-padding bg-secondary/30">
              <div className="container max-w-3xl">
                <button
                  onClick={() => navigate("/blog")}
                  className="flex items-center gap-2 text-primary hover:opacity-70 transition-opacity mb-6"
                >
                  <ChevronLeft size={18} /> Back to Blog
                </button>
                
                <h1 className="font-serif text-5xl font-semibold mb-4 text-foreground">
                  {post.title}
                </h1>
                
                {post.publishedAt && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={16} />
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Featured Image */}
            {post.featuredImageUrl && (
              <section className="section-padding pt-0">
                <div className="container max-w-3xl">
                  <div className="h-96 bg-gradient-to-br from-muted to-secondary rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Featured Image</p>
                  </div>
                </div>
              </section>
            )}

            {/* Content */}
            <section className="section-padding">
              <div className="container max-w-3xl prose prose-neutral max-w-none">
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
