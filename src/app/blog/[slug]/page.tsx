import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPost, getAllBlogPosts } from '@/lib/blog-posts';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | SwagStore Blog`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  // Generate Article Schema.org structured data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SwagStore',
      logo: {
        '@type': 'ImageObject',
        url: 'https://swagstore.ca/logo.png',
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://swagstore.ca/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-50 to-white border-b">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">
                {post.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6">{post.description}</p>
              <div className="flex items-center text-gray-600">
                <span>By {post.author}</span>
                <span className="mx-3">•</span>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          <div 
            className="prose prose-lg prose-blue max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h1:text-4xl prose-h1:mb-6
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:my-6 prose-li:text-gray-700
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: (() => {
              let html = post.content;
              
              // Convert headings (# ## ###)
              html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
              html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
              html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
              
              // Convert bold text (**text**)
              html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
              
              // Convert line breaks to paragraphs
              html = html.split('\n\n').map(para => {
                para = para.trim();
                if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('-')) {
                  return para;
                }
                return para ? `<p>${para.replace(/\n/g, '<br />')}</p>` : '';
              }).join('\n');
              
              // Convert bullet lists (- item)
              html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
              
              // Wrap consecutive list items in ul tags
              const lines = html.split('\n');
              const result: string[] = [];
              let inList = false;
              
              for (const line of lines) {
                if (line.trim().startsWith('<li>')) {
                  if (!inList) {
                    result.push('<ul>');
                    inList = true;
                  }
                  result.push(line);
                } else {
                  if (inList) {
                    result.push('</ul>');
                    inList = false;
                  }
                  result.push(line);
                }
              }
              
              if (inList) {
                result.push('</ul>');
              }
              
              return result.join('\n');
            })()}}
          />
        </article>

        {/* CTA Section */}
        <div className="bg-gradient-to-b from-white to-gray-50 border-t">
          <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="bg-blue-600 rounded-2xl p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Request your free team store today and start building your brand in 24 hours.
              </p>
              <a
                href="/request-store"
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Request Your Free Store
              </a>
            </div>

            {/* Keywords for SEO */}
            <div className="mt-8 text-center">
              <div className="flex flex-wrap justify-center gap-2">
                {post.keywords.map((keyword) => (
                  <Badge key={keyword} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
