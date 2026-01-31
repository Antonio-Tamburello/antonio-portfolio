"use client"

import { Container } from '@/components/container'
import Link from 'next/link'

import { Github, Linkedin, Mail } from 'lucide-react'

type SocialLink = { name: string; href: string }

export function Footer({ socialLinks }: { socialLinks: SocialLink[] }) {
  const currentYear = new Date().getFullYear()

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    GitHub: Github,
    LinkedIn: Linkedin,
    Email: Mail,
  }

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      <Container className="py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Antonio Tamburello. All rights reserved.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Built with{' '}
              <Link
                href="https://saas-forge-kit.vercel.app"
                className="underline hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                SaaS Forge Kit
              </Link>
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {socialLinks?.map((social) => {
              const Icon = iconMap[social.name] || Mail
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              )
            })}
          </div>
        </div>
      </Container>
    </footer>
  )
}