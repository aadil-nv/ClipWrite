// src/types/blog.ts
export interface BlogTag {
    id: string;
    name: string;
  }
  
  export interface BlogFormData {
    headline: string;
    content: string;
    imageUrl: string;
    preferences: {
      publishImmediately: boolean;
      allowComments: boolean;
      featured: boolean;
    };
    tags: BlogTag[];
  }