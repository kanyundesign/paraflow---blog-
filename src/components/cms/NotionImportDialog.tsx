import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, FileUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotionImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: { title: string; content: string }) => void;
}

export function NotionImportDialog({ open, onOpenChange, onImport }: NotionImportDialogProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!url.trim()) {
      toast({
        title: 'URL Required',
        description: 'Please enter a Notion page URL',
        variant: 'destructive',
      });
      return;
    }

    // Validate Notion URL
    if (!url.includes('notion.so') && !url.includes('notion.site')) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid Notion page URL',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call edge function to fetch Notion content
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notion-import`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ url }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to import from Notion');
      }

      const data = await response.json();
      
      onImport({
        title: data.title,
        content: data.content,
      });

      toast({
        title: 'Import Successful',
        description: 'Notion content has been imported',
      });

      setUrl('');
      onOpenChange(false);
    } catch (error) {
      console.error('Notion import error:', error);
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'Failed to import from Notion',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Import from Notion
          </DialogTitle>
          <DialogDescription>
            Enter the Notion page URL to import its content into the editor.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="notion-url">Notion Page URL</Label>
            <Input
              id="notion-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.notion.so/your-page-id"
              className="bg-background border-border"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Make sure the Notion page is shared or accessible via the link.
          </p>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={isLoading || !url.trim()}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
