import {Card, Form, Button} from "react-bootstrap";
import {createComment} from "../../lib/actions";
import {useState} from "react";
import {CommentProp} from "../../lib/propinterfaces";

interface CreateCommentProps {
    postId: number,
    onCommentSubmitted: () => void,
}

export default function CreateComment({postId, onCommentSubmitted}: CreateCommentProps) {
    const username = sessionStorage.getItem("curUn");
    const [content, setContent] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const commentForm = {
            username: username!,
            content: content,
            postId: postId,
        }

        try {
            await createComment(commentForm);
            console.log("Comment created successfully!");
            setContent("");
            onCommentSubmitted();
        } catch (error) {
            console.error("Error creating post:", error);
        }
    }

    return (
        <>
            <div className="bg-white shadow-md rounded-md p-1 mb-1 border border-gray-200">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="comment">
                        <Form.Control
                            as="textarea"
                            placeholder="Post your reply"
                            rows={1}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>
                    <div className="flex justify-end">
                        <Button
                            variant="primary"
                            type="submit"
                            className="rounded-full"
                            disabled={!content}
                        >
                            Reply
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
}