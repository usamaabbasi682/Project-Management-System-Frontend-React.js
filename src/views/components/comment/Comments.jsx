import { useDeleteTaskCommentMutation } from "features/pmsApi";
import { useState } from "react";
import { Row,Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

const Comment = ({ comments, userId, setMessage, setIsEditing, setCommentEditId, project = null, task = null }) => {
    const { projectId, taskId } = useParams(); 
    const [deleteTaskComment] = useDeleteTaskCommentMutation();
    const [currentComment, setCurrentComment] = useState('');

    const editComment = (data,id) => {
        setMessage(data);
        setIsEditing(true);
        setCommentEditId(id);
    }

    const deleteComment = (id) => {
        if (confirm('Are you sure?')) {
            deleteTaskComment({
                projectId: project != null ? project : projectId,
                taskId: task != null ? task : taskId,
                commentId: id
            });
            setCurrentComment(id);
            comments.refetch();
        }
    }
    return (
        <>
            <Row className='mt-3' style={{ overflowY:'scroll', maxHeight:'250px' }}>
                {
                    !comments.isLoading ?
                    comments?.data?.data?.map((comment, index) => (
                        <Col md="12" key={index}>
                            <div className="mb-2 shadow-none border rounded" style={{ backgroundColor: '#f1f1f1' }}>
                                <div className="card-body pb-2 pt-2">
                                    <Row>
                                        <Col md="8" style={{ paddingLeft: '4px' }}>
                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex flex-row align-items-center">
                                                    <div className="ms-2 c-pointer ">
                                                        <p className="mb-0 text-dark pl-2"><b>{comment?.created_by}</b> | <span className='text-primary'>{comment?.created_at}</span> { comment.created_at != comment.updated_at ?  <>| Last-Updated: <span className='text-primary'>{comment?.updated_at}</span></> : ''}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="4" className="text-end">
                                            {comment?.user_id == userId ? 
                                                <>
                                                <button type='button' className='text-danger border-0' onClick={()=>{deleteComment(comment?.id)}}>
                                                    <b>{comment?.id == currentComment ? 'Deleting...' : 'Delete' }</b> 
                                                </button>|
                                                <button type='button' className='text-success border-0' onClick={()=>{editComment(comment?.body,comment?.id)}}>
                                                    <b>Edit</b> 
                                                </button> 
                                                </>
                                            : ''}
                                        </Col>
                                    </Row>
                                    <div className="mt-2">
                                        <p className="mb-0 text-muted" dangerouslySetInnerHTML={{ __html: comment?.body }}></p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    )): <Col me={12} className="text-center text-success">Loading...</Col>
                }
            </Row>
        </>
    );
}

export default Comment;