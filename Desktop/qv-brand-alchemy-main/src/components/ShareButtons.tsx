import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title: string;
  url?: string;
  className?: string;
}

const ShareButtons = ({ title, url, className = "" }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const shareUrl =
    url ||
    (typeof window !== "undefined" ? window.location.href : "");
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl || "https://www.qvbrands.com");

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually from your address bar.",
        variant: "destructive",
      });
    }
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      className: "hover:bg-blue-500/10 hover:text-blue-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      className: "hover:bg-blue-600/10 hover:text-blue-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: "hover:bg-blue-700/10 hover:text-blue-700",
    },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Share2 className="h-4 w-4" />
        <span className="text-sm font-medium">Share:</span>
      </div>
      
      {shareLinks.map((link) => (
        <Button
          key={link.name}
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 transition-colors ${link.className}`}
          onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
          title={`Share on ${link.name}`}
        >
          <link.icon className="h-4 w-4" />
        </Button>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-brand-purple-soft/20 hover:text-brand-purple-accent transition-colors"
        onClick={handleCopyLink}
        title="Copy link"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default ShareButtons;