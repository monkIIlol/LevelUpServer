
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import Comments from '../components/Comments';

const BlogDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const post = blogPosts.find(p => p.id === id);

    if (!post) {
        return (
            <main id="main-content">
                <header className="page-header">
                    <h1>Artículo no encontrado</h1>
                    <Link to="/blog" className="btn">← Volver al blog</Link>
                </header>
            </main>
        );
    }

    return (
        <main id="main-content" data-post-id={post.id}>
            <article className="prose">
                <header>
                    <h1>{post.title}</h1>
                </header>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            <Comments postId={post.id} />

            {/* Botón para volver al blog */}
            <div className="btn-volver-neon">
                <Link to="/blog" style={{ color: '#000', textDecoration: 'none', display: 'block' }}>
                    ← Volver al blog
                </Link>
            </div>
        </main> 
    );
}

export default BlogDetailPage;