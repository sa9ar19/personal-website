import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function Gallery() {
  const [, navigate] = useLocation();
  const { data: destinations, isLoading, error } = trpc.destinations.list.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="section-padding bg-secondary/30">
          <div className="container text-center">
            <h1 className="font-serif text-5xl font-semibold mb-4 text-foreground">
              My Destinations
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore my collection of travels organized by destination. 
              Each gallery contains photos and stories from my adventures.
            </p>
          </div>
        </section>

        {/* Destinations Grid */}
        <section className="section-padding">
          <div className="container">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-muted-foreground" size={32} />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive mb-4">Error loading destinations</p>
                <button onClick={() => window.location.reload()} className="text-primary hover:opacity-70">
                  Try again
                </button>
              </div>
            ) : !destinations || destinations.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">No destinations yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map(dest => (
                  <button
                    key={dest.id}
                    onClick={() => navigate(`/gallery/${dest.id}`)}
                    className="group text-left card-hover rounded-lg overflow-hidden border border-border bg-card"
                  >
                    {/* Cover image placeholder */}
                    <div className="h-48 bg-gradient-to-br from-muted to-secondary flex items-center justify-center group-hover:from-muted/80 transition-colors">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Cover Image</p>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {dest.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {dest.description || "No description yet"}
                      </p>
                    </div>
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
