import { Navbar } from "@/components/core/navbar";
import { NetworkProvider } from "@/components/network-provider";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <NetworkProvider>
      <div className="flex flex-col min-h-screen item">
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Navbar />
        </header>

        <main className="flex-1 container mx-auto px-4 md:px-6">
          {children}
        </main>

        <footer className="w-full border-t bg-background">
          <div className="container mx-auto flex items-center justify-center py-4">
            <p className="text-sm text-muted-foreground text-center">
              Made by{" "}
              <span className="hidden md:inline">
                <HoverCard>
                  <HoverCardTrigger className="text-primary hover:underline cursor-pointer font-medium">
                    Yash
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/20">
                        <AvatarImage src="https://github.com/Celestial-0.png" alt="Yash's Avatar" />
                        <AvatarFallback>Y</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="text-sm font-semibold">Yash Kumar Singh</h4>
                          <p className="text-xs text-muted-foreground">Full Stack Developer</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {/* description */}
                        </p>
                        <a
                          href="https://yashkumarsingh.tech"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs text-primary hover:underline"
                        >
                          Visit Portfolio →
                        </a>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </span>
              <a
                href="https://yashkumarsingh.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline cursor-pointer font-medium md:hidden"
              >
                Yash
              </a>
            </p>
          </div>
        </footer>
      </div>
    </NetworkProvider>
  );
};