// En src/components/Comments.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Para saber quién comenta
import type { Comment } from '../Types';

// NOTA: Para no forzar la importación de Link, usaremos un <a> con href="/login"
// y le aplicaremos la clase "btn" para que se vea como un botón.

interface Props {
    postId: string;
}

const COMMENTS_STORAGE_KEY = 'blog_comments';

const Comments: React.FC<Props> = ({ postId }) => {
    const { currentUser } = useAuth();

    const [comments, setComments] = useState<Comment[]>([]);
    const [newCommentText, setNewCommentText] = useState('');

    useEffect(() => {
        const allCommentsJson = localStorage.getItem(COMMENTS_STORAGE_KEY);
        const allComments = allCommentsJson ? JSON.parse(allCommentsJson) : {};

        setComments(allComments[postId] || []);
    }, [postId]);

    // Lógica para guardar un nuevo comentario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        if (!currentUser) {
            // Esto nunca debería pasar porque el botón/campo se deshabilita, 
            // pero es una buena práctica de seguridad.
            alert('Debes iniciar sesión para poder comentar.');
            return;
        }

        // Creamos el nuevo objeto de comentario
        const newComment: Comment = {
            id: Date.now().toString(),
            author: currentUser.firstName || currentUser.email,
            text: newCommentText,
            timestamp: new Date().toISOString()
        };

        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        setNewCommentText('');

        const allCommentsJson = localStorage.getItem(COMMENTS_STORAGE_KEY);
        const allComments = allCommentsJson ? JSON.parse(allCommentsJson) : {};

        allComments[postId] = updatedComments;

        localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(allComments));
    };

    return (
        <section className="comments" data-comments-root>
            <h2>Comentarios ({comments.length})</h2>

            <ul className="comments__list" data-comments-list>
                {comments.length === 0 ? (
                    <p className="comment-empty">Sé el primero en comentar 🐐</p>
                ) : (
                    comments.map(comment => (
                        <li key={comment.id} className="comment">
                            <div className="comment__head">
                                <span className="comment__user">{comment.author}</span>
                                <span className="comment__time">{new Date(comment.timestamp).toLocaleString('es-CL')}</span>
                            </div>
                            <p className="comment__text">{comment.text}</p>
                        </li>
                    ))
                )}
            </ul>

            <form className="comments__form" data-comment-form onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor="comment_text">Comentario</label>
                    <textarea
                        id="comment_text"
                        name="comment_text"
                        rows={4}
                        placeholder={currentUser ? "Escribe tu comentario…" : "Debes iniciar sesión para comentar"}
                        value={newCommentText}
                        onChange={e => setNewCommentText(e.target.value)}
                        required
                        disabled={!currentUser}
                    />
                </div>

                {currentUser ? (
                    // 1. SI HAY USUARIO: Muestra el botón de Publicar
                    <button className="btn" type="submit">
                        Publicar comentario
                    </button>
                ) : (
                    // 2. SI NO HAY USUARIO: Muestra un enlace/botón a /login
                    // Usamos <a> para redirigir y className="btn" para el estilo.
                    <a href="/login" className="btn" style={{ textAlign: 'center' }}>
                        Inicia sesión para comentar
                    </a>
                )}
            </form>
        </section>
    );
}

export default Comments;