import { useCreateTaskCommentMutation, useEditTaskCommentMutation } from "features/pmsApi";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useParams } from "react-router-dom";

const CommentForm = (
    {
        isEditing,
        setIsEditing,
        commentEditId,
        setCommentEditId,
        message,
        setMessage,
        comments,
        project = null,
        task = null,
        currentTaskId = null,
        displayQuill,
    }) => {

    const { projectId, taskId } = useParams(); 
    const [createComment, commentResponse] = useCreateTaskCommentMutation();
    const [editTaskComment, updateCommentResponse] = useEditTaskCommentMutation();
    
    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (message != '') {
            const formData = new FormData();
            formData.append('body', message);
            createComment({
                projectId: project != null ? project : projectId,
                taskId: task != null ? task : taskId,
                comment: formData
            });
            setMessage('');
            comments.refetch();
        }
    }
    
    const handleCommentUpdate = (e) => {
        e.preventDefault();

        if (message != '') {
            const formData = new FormData();
            formData.append('body', message);
            editTaskComment({
                projectId: project != null ? project : projectId,
                taskId: task != null ? task : taskId,
                commentId: commentEditId,
                comment: formData
            });
            setCommentEditId('');
            setIsEditing(false);
            setMessage('');
            comments.refetch();
        }
    }
    
    const handleChange = (value) => {
        setMessage(value);
    };

    return (
        <>
        <form onSubmit={isEditing ? handleCommentUpdate : handleMessageSubmit}>
            <div className='form-group text-end'>
                <button type="submit" disabled={commentResponse.isLoading || updateCommentResponse.isLoading} className="btn btn-primary btn-sm">
                    {commentResponse.isLoading || updateCommentResponse.isLoading ? 'Loading...' : 'Save'}
                </button>
            </div>
            <div className="form-group">
                {task == currentTaskId && displayQuill == false ? <ReactQuill theme="snow" className="form-control" name="message" value={message} onChange={handleChange} /> : ''}
                {displayQuill == true ? <ReactQuill theme="snow" className="form-control" name="message" value={message} onChange={handleChange} /> : ''}
            </div>
        </form>
        </>
    );
}

export default CommentForm;