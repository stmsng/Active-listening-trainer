import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="contact" className="bg-muted py-12">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">ActiveListeningDojo</h3>
            <p className="text-muted-foreground mb-4">
              Transform your communication skills through interactive practice and personalized AI feedback.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook size={20} />, href: "#" },
                { icon: <Twitter size={20} />, href: "#" },
                { icon: <Instagram size={20} />, href: "#" },
                { icon: <Linkedin size={20} />, href: "#" },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "#home" },
                { label: "About", href: "#about" },
                { label: "Technology", href: "#technology" },
                { label: "FAQ", href: "#" },
                { label: "Privacy Policy", href: "#" },
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              {[
                { label: "Blog", href: "#" },
                { label: "Research", href: "#" },
                { label: "Testimonials", href: "#" },
                { label: "Case Studies", href: "#" },
                { label: "Support", href: "#" },
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {[
                { icon: <Mail size={16} />, content: "info@activelisteningdojo.com" },
                { icon: <Phone size={16} />, content: "+1 (555) 123-4567" },
                { icon: <MapPin size={16} />, content: "123 Listening Lane, Communication City" },
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">{item.icon}</span>
                  <span className="text-muted-foreground">{item.content}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-muted-foreground">
          <p>&copy; {currentYear} ActiveListeningDojo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

