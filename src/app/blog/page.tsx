import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blog-posts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Blog - Team Store Tips & Guides | SwagStore Canada',
  description: 'Expert guides on custom team apparel, school spirit wear, sports merchandise, fundraising strategies, and building your team brand.',
  keywords: [
    'team store blog',
    'custom apparel tips',
    'team merchandise guide',
    'fundraising ideas',
    'school spirit wear tips',
    'sports team branding',
    'team apparel blog'
  ],
  openGraph: {
    title: 'Blog - Team Store Tips & Guides | SwagStore Canada',
    description: 'Expert guides on custom team apparel, fundraising, and building your team brand.',
  }
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            SwagStore Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert guides, tips, and strategies for custom team apparel, fundraising, and building your organization's brand.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>By {post.author}</span>
                    <span className="mx-2">•</span>
                    <span className="text-blue-600 group-hover:underline">
                      Read more →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Team Store?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get your free custom store in 24 hours. No setup fees, no hassle.
          </p>
          <a
            href="/request-store"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Request Your Free Store
          </a>
        </div>
      </div>
    </div>
  );
}
