import { defineCollection, z } from "astro:content";
import { imageKeys } from "../data/media";

const services = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    heroImageKey: z.enum(imageKeys)
  })
});

const caseStudies = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    client: z.string(),
    sector: z.string(),
    results: z.array(z.string())
  })
});

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    author: z.string(),
    category: z.string(),
    published: z.string()
  })
});

const products = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    price: z.number(),
    vatRate: z.number(),
    category: z.string(),
    stock: z.number(),
    sku: z.string(),
    imageKey: z.enum(imageKeys)
  })
});

export const collections = { services, "case-studies": caseStudies, blog, products };
