
import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts'; 
import type { Comment } from '../Types'; 


const COMMENTS_STORAGE_KEY = 'blog_comments';


type AllComments = Record<string, Comment[]>;

const BlogPage = () => {
    const [allComments, setAllComments] = useState<AllComments>({});


    useEffect(() => {

        const allCommentsJson = localStorage.getItem(COMMENTS_STORAGE_KEY);
        const commentsData = allCommentsJson ? JSON.parse(allCommentsJson) : {};
        setAllComments(commentsData); 
    }, []); 

    return (
        <main id="main-content" className="gamer-bg-4">
            <header className="page-header">
                <h1>Blogs</h1>
            </header>

            <section className="blog-grid" data-blog-list>

                {blogPosts.map(post => {
                    
                    const commentsForThisPost = allComments[post.id] || [];
                    const commentCount = commentsForThisPost.length; 

                    return (
                        <article key={post.id} className="card" data-post-id={post.id}>
                            <img src={post.imageUrl} alt={post.title} />
                            <h3>
                                <Link to={`/blog/${post.id}`}>{post.title}</Link>
                            </h3>
                            <p>{post.summary}</p>

                            
                            <div className="card__meta">
                                <span className="badge">💬 {commentCount}</span>
                            </div>
                            

                            <Link to={`/blog/${post.id}`} className="btn-readmore">Leer más →</Link>
                        </article>
                    );
                })}
            </section>
        </main>
    );
}

export default BlogPage;