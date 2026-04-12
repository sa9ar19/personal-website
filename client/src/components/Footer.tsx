import { trpc } from "@/lib/trpc";
import { Github, Linkedin, Twitter, Mail, Instagram } from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  github: <Github size={18} />,
  linkedin: <Linkedin size={18} />,
  twitter: <Twitter size={18} />,
  instagram: <Instagram size={18} />,
  email: <Mail size={18} />,
};

export default function Footer() {
  const { data: socialLinks } = trpc.social.list.useQuery();

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="font-serif text-2xl font-semibold text-foreground mb-1">
              My Journey
            </p>
            <p className="text-sm text-muted-foreground">
              Travels, treks, and life experiences
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks && socialLinks.length > 0 ? (
              socialLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-all duration-200"
                >
                  {ICON_MAP[link.platform.toLowerCase()] || <Mail size={18} />}
                </a>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Social links coming soon</p>
            )}
          </div>
        </div>

        <div className="divider-line my-8" />

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} My Journey. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
