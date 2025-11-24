import { defineStackbitConfig, SiteMapEntry } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "custom",
  nodeVersion: "22",
  devCommand: "npm run dev",
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content"],
      models: [
        {
          name: "page",
          type: "page",
          label: "Page",
          urlPath: "/{slug}",
          filePath: "content/pages/{slug}.json",
          fields: [
            {
              name: "title",
              type: "string",
              label: "Title",
              required: true,
            },
            {
              name: "slug",
              type: "slug",
              label: "Slug",
              required: true,
            },
            {
              name: "description",
              type: "text",
              label: "Description",
            },
            {
              name: "sections",
              type: "list",
              label: "Sections",
              items: {
                type: "model",
                models: ["hero", "features", "testimonials", "cta"],
              },
            },
          ],
        },
        {
          name: "hero",
          type: "object",
          label: "Hero Section",
          fields: [
            {
              name: "title",
              type: "string",
              label: "Title",
              required: true,
            },
            {
              name: "subtitle",
              type: "text",
              label: "Subtitle",
            },
            {
              name: "ctaText",
              type: "string",
              label: "CTA Text",
            },
            {
              name: "ctaLink",
              type: "string",
              label: "CTA Link",
            },
          ],
        },
        {
          name: "features",
          type: "object",
          label: "Features Section",
          fields: [
            {
              name: "title",
              type: "string",
              label: "Title",
            },
            {
              name: "items",
              type: "list",
              label: "Feature Items",
              items: {
                type: "object",
                fields: [
                  {
                    name: "title",
                    type: "string",
                    label: "Title",
                  },
                  {
                    name: "description",
                    type: "text",
                    label: "Description",
                  },
                  {
                    name: "icon",
                    type: "string",
                    label: "Icon",
                  },
                ],
              },
            },
          ],
        },
        {
          name: "testimonials",
          type: "object",
          label: "Testimonials Section",
          fields: [
            {
              name: "title",
              type: "string",
              label: "Title",
            },
            {
              name: "items",
              type: "list",
              label: "Testimonials",
              items: {
                type: "object",
                fields: [
                  {
                    name: "quote",
                    type: "text",
                    label: "Quote",
                  },
                  {
                    name: "author",
                    type: "string",
                    label: "Author",
                  },
                  {
                    name: "company",
                    type: "string",
                    label: "Company",
                  },
                ],
              },
            },
          ],
        },
        {
          name: "cta",
          type: "object",
          label: "Call to Action",
          fields: [
            {
              name: "title",
              type: "string",
              label: "Title",
            },
            {
              name: "description",
              type: "text",
              label: "Description",
            },
            {
              name: "buttonText",
              type: "string",
              label: "Button Text",
            },
            {
              name: "buttonLink",
              type: "string",
              label: "Button Link",
            },
          ],
        },
      ],
    }),
  ],
  siteMap: ({ documents, models }) => {
    const pageModels = models.filter((m) => m.type === "page");

    return documents
      .filter((d) => pageModels.some((m) => m.name === d.modelName))
      .map((document) => {
        const urlModel = (() => {
          switch (document.modelName) {
            case "page":
              return "page";
            default:
              return null;
          }
        })();

        if (!urlModel) {
          return null;
        }

        const data = document as any;
        const slug = data.slug || document.id;
        const isHome = slug === "home" || slug === "index";

        return {
          stableId: document.id,
          urlPath: isHome ? "/" : `/${slug}`,
          document,
          isHomePage: isHome,
        };
      })
      .filter(Boolean) as SiteMapEntry[];
  },
});
