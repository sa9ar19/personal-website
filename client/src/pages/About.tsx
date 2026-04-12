import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="section-padding bg-secondary/30">
          <div className="container text-center">
            <h1 className="font-serif text-5xl font-semibold mb-4 text-foreground">
              About Me
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get to know the person behind the lens and stories
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="section-padding">
          <div className="container max-w-3xl">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              {/* Image placeholder */}
              <div className="h-96 bg-gradient-to-br from-muted to-secondary rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Your Photo Here</p>
              </div>

              {/* Bio */}
              <div>
                <h2 className="font-serif text-3xl font-semibold mb-4 text-foreground">
                  Hello, I'm [Your Name]
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I'm a passionate traveler and photographer who believes that every journey tells a story. 
                  For the past several years, I've been exploring the world, capturing moments, and sharing 
                  experiences through my lens.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  My journey started with a simple curiosity about different cultures, landscapes, and people. 
                  What began as a hobby has evolved into a passion that drives me to seek new adventures, 
                  challenge myself, and document the beauty of our world.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Through this website, I share not just photographs, but the stories, emotions, and lessons 
                  learned from each destination. I hope my experiences inspire you to explore, discover, and 
                  create your own adventures.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="divider-line my-16" />

            {/* Interests */}
            <div>
              <h2 className="font-serif text-3xl font-semibold mb-8 text-foreground text-center">
                What I Love
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { title: "Trekking", desc: "Exploring mountain trails and remote paths" },
                  { title: "Photography", desc: "Capturing the beauty of nature and culture" },
                  { title: "Storytelling", desc: "Sharing experiences and connecting with people" },
                ].map((item, i) => (
                  <div key={i} className="p-6 border border-border bg-card rounded-lg text-center">
                    <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
