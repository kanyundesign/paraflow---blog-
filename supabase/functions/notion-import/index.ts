import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Verify user has admin or editor role
async function verifyUserRole(authHeader: string): Promise<{ valid: boolean; error?: string }> {
  if (!authHeader) {
    return { valid: false, error: "Authorization header required" };
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Auth error:", userError);
    return { valid: false, error: "Invalid or expired authentication" };
  }

  // Check if user has admin or editor role
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .in("role", ["admin", "editor"])
    .maybeSingle();

  if (roleError) {
    console.error("Role check error:", roleError);
    return { valid: false, error: "Failed to verify user role" };
  }

  if (!roleData) {
    return { valid: false, error: "Access denied. Admin or editor role required." };
  }

  console.log(`User ${user.id} authorized with role: ${roleData.role}`);
  return { valid: true };
}

// Extract page ID from various Notion URL formats
function extractPageId(url: string): string | null {
  // Format: https://www.notion.so/workspace/Page-Title-abc123def456...
  // Format: https://notion.so/Page-Title-abc123def456...
  // Format: https://www.notion.so/abc123def456...
  const patterns = [
    /notion\.so\/(?:[^\/]+\/)?(?:[^-]+-)?([a-f0-9]{32})(?:\?|$)/i,
    /notion\.so\/(?:[^\/]+\/)?([a-f0-9]{32})(?:\?|$)/i,
    /notion\.so\/(?:[^\/]+\/)?[^\/]+-([a-f0-9]{32})(?:\?|$)/i,
    /([a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12})/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      // Remove dashes if present and ensure 32 char hex
      const id = match[1].replace(/-/g, '');
      if (id.length === 32) {
        return id;
      }
    }
  }
  return null;
}

// Format page ID with dashes for API calls
function formatPageId(id: string): string {
  if (id.includes('-')) return id;
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
}

// Convert rich text array to markdown
function richTextToMarkdown(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return '';
  
  return richText.map(text => {
    let content = text.plain_text || '';
    const annotations = text.annotations || {};
    
    if (annotations.code) content = `\`${content}\``;
    if (annotations.bold) content = `**${content}**`;
    if (annotations.italic) content = `*${content}*`;
    if (annotations.strikethrough) content = `~~${content}~~`;
    if (text.href) content = `[${content}](${text.href})`;
    
    return content;
  }).join('');
}

// Convert a single block to markdown
function blockToMarkdown(block: any): string {
  const type = block.type;
  const data = block[type];
  
  if (!data) return '';
  
  switch (type) {
    case 'paragraph':
      return richTextToMarkdown(data.rich_text) + '\n';
    
    case 'heading_1':
      return `# ${richTextToMarkdown(data.rich_text)}\n`;
    
    case 'heading_2':
      return `## ${richTextToMarkdown(data.rich_text)}\n`;
    
    case 'heading_3':
      return `### ${richTextToMarkdown(data.rich_text)}\n`;
    
    case 'bulleted_list_item':
      return `- ${richTextToMarkdown(data.rich_text)}\n`;
    
    case 'numbered_list_item':
      return `1. ${richTextToMarkdown(data.rich_text)}\n`;
    
    case 'to_do':
      const checkbox = data.checked ? '[x]' : '[ ]';
      return `- ${checkbox} ${richTextToMarkdown(data.rich_text)}\n`;
    
    case 'toggle':
      return `<details><summary>${richTextToMarkdown(data.rich_text)}</summary></details>\n`;
    
    case 'code':
      const language = data.language || '';
      const code = richTextToMarkdown(data.rich_text);
      return `\`\`\`${language}\n${code}\n\`\`\`\n`;
    
    case 'quote':
      return `> ${richTextToMarkdown(data.rich_text)}\n`;
    
    case 'callout':
      const icon = data.icon?.emoji || '💡';
      return `> ${icon} ${richTextToMarkdown(data.rich_text)}\n`;
    
    case 'divider':
      return `---\n`;
    
    case 'image':
      const imageUrl = data.file?.url || data.external?.url || '';
      const caption = data.caption ? richTextToMarkdown(data.caption) : 'image';
      return `![${caption}](${imageUrl})\n`;
    
    case 'bookmark':
      const bookmarkUrl = data.url || '';
      const bookmarkCaption = data.caption ? richTextToMarkdown(data.caption) : bookmarkUrl;
      return `[${bookmarkCaption}](${bookmarkUrl})\n`;
    
    case 'link_preview':
      return `[${data.url}](${data.url})\n`;
    
    case 'table':
      return ''; // Tables need special handling with children
    
    case 'column_list':
    case 'column':
      return ''; // Columns are structural, content comes from children
    
    default:
      console.log(`Unhandled block type: ${type}`);
      return '';
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user authentication and role
    const authHeader = req.headers.get("Authorization") || "";
    const roleCheck = await verifyUserRole(authHeader);
    
    if (!roleCheck.valid) {
      console.error("Authorization failed:", roleCheck.error);
      return new Response(
        JSON.stringify({ error: roleCheck.error }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { url } = await req.json();
    console.log("Received URL:", url);

    if (!url) {
      return new Response(
        JSON.stringify({ error: "Notion URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const NOTION_TOKEN = Deno.env.get("NOTION_TOKEN");
    if (!NOTION_TOKEN) {
      console.error("NOTION_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: "Notion integration not configured. Please add NOTION_TOKEN secret." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract page ID
    const rawPageId = extractPageId(url);
    if (!rawPageId) {
      console.error("Could not extract page ID from URL:", url);
      return new Response(
        JSON.stringify({ error: "Invalid Notion URL. Please provide a valid Notion page link." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const pageId = formatPageId(rawPageId);
    console.log("Extracted page ID:", pageId);

    const notionHeaders = {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    };

    // Fetch page info for title
    console.log("Fetching page info...");
    const pageResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      headers: notionHeaders,
    });

    if (!pageResponse.ok) {
      const errorText = await pageResponse.text();
      console.error("Page fetch failed:", pageResponse.status, errorText);
      
      if (pageResponse.status === 401) {
        return new Response(
          JSON.stringify({ error: "Notion authentication failed. Please check your NOTION_TOKEN and ensure the page is shared with your integration." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (pageResponse.status === 404) {
        return new Response(
          JSON.stringify({ error: "Page not found. Make sure the page exists and is shared with your Notion integration." }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: `Notion API error: ${pageResponse.status}` }),
        { status: pageResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const pageData = await pageResponse.json();
    console.log("Page data received");

    // Extract title from page properties
    let title = "Imported from Notion";
    const properties = pageData.properties || {};
    for (const key of Object.keys(properties)) {
      const prop = properties[key];
      if (prop.type === "title" && prop.title?.length > 0) {
        title = prop.title.map((t: any) => t.plain_text).join('');
        break;
      }
    }
    console.log("Page title:", title);

    // Fetch all blocks
    console.log("Fetching blocks...");
    let allBlocks: any[] = [];
    let cursor: string | undefined = undefined;
    
    do {
      const blocksUrl = new URL(`https://api.notion.com/v1/blocks/${pageId}/children`);
      if (cursor) blocksUrl.searchParams.set('start_cursor', cursor);
      blocksUrl.searchParams.set('page_size', '100');

      const blocksResponse = await fetch(blocksUrl.toString(), {
        headers: notionHeaders,
      });

      if (!blocksResponse.ok) {
        const errorText = await blocksResponse.text();
        console.error("Blocks fetch failed:", blocksResponse.status, errorText);
        return new Response(
          JSON.stringify({ error: `Failed to fetch page content: ${blocksResponse.status}` }),
          { status: blocksResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const blocksData = await blocksResponse.json();
      allBlocks = allBlocks.concat(blocksData.results || []);
      cursor = blocksData.has_more ? blocksData.next_cursor : undefined;
    } while (cursor);

    console.log(`Fetched ${allBlocks.length} blocks`);

    // Convert blocks to markdown
    let markdown = '';
    for (const block of allBlocks) {
      markdown += blockToMarkdown(block);
    }

    // Clean up extra newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

    console.log("Conversion complete, content length:", markdown.length);

    return new Response(
      JSON.stringify({ title, content: markdown }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Notion import error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
