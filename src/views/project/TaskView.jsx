import { useCreateTaskCommentMutation, useDeleteTaskCommentMutation, useEditTaskCommentMutation, useTaskCommentsQuery, useViewTaskQuery } from 'features/pmsApi';
import { Row, Col, Card } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import TaskFiles from './TaskFiles';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import Spinner from 'views/common/Spinner';
import { useState } from 'react';
import { set } from 'immutable';

const TaskView = () => {
    const {projectId,taskId} = useParams();    
    const { data, refetch, isFetching } = useViewTaskQuery({ projectId: projectId, taskId: taskId });
    const [createComment, commentResponse] = useCreateTaskCommentMutation();
    const [editTaskComment,updateCommentResponse] = useEditTaskCommentMutation();
    const comments = useTaskCommentsQuery({ projectId: projectId, taskId: taskId });
    const [deleteTaskComment] = useDeleteTaskCommentMutation();
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [currentComment, setCurrentComment] = useState('');
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [commentEditId, setCommentEditId] = useState('');
    console.log(data);
    
    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (message != '') {
            const formData = new FormData();
            formData.append('body', message);
            createComment({
                projectId: projectId,
                taskId: taskId,
                comment: formData
            });
            setMessage('');
            comments.refetch();
        }
    }

    const deleteComment = (id) => {
        deleteTaskComment({
            projectId: projectId,
            taskId: taskId,
            commentId: id
        });
        setCurrentComment(id);
        comments.refetch();
    }

    const editComment = (data,id) => {
        setMessage(data);
        setIsEditing(true);
        setCommentEditId(id);
    }

    const handleCommentUpdate = (e) => {
        e.preventDefault();

        if (message != '') {
            const formData = new FormData();
            formData.append('body', message);
            editTaskComment({
                projectId: projectId,
                taskId: taskId,
                commentId: commentEditId,
                comment: formData
            });
            setCommentEditId('');
            setIsEditing(false);
            setMessage('');
            comments.refetch();
        }
    }

    return (
        <>
            <Row>
                <Col md="1"></Col>
                <Col sm="10">
                    <Card className="Recent-Users widget-focus-lg">
                        <Card.Header className='d-flex justify-content-between'>
                            <Card.Title as="h5">Task Details</Card.Title>
                            <Link to={`/projects/${projectId}`} className="btn btn-danger btn-sm">Back</Link>  
                        </Card.Header>
                        <Card.Body className="">
                            {!isFetching ?
                                <Row>
                                    <Col md="8">
                                        <h4 className='text-muted pb-3'>{data?.data?.title}</h4>
                                        <p className='mb-0'><b>Description:</b></p>
                                        <hr className='m-0 mb-2 mt-1' />
                                        <p dangerouslySetInnerHTML={{ __html: data?.data && data?.data?.description }}></p>
                                        <p className='mb-0'><b>Attachments:</b></p>
                                        <hr className='m-0 mb-2 mt-1' />
                                        {data?.data?.files.length > 0 ? <TaskFiles files={data?.data?.files} refetch={refetch} /> : <p className='text-muted text-center p-3'>No attachments added yet</p>}
                                        <p className='mb-0'><b>Comments:</b></p>
                                        <hr className='m-0 mb-2 mt-1' />
                                        <form onSubmit={isEditing ? handleCommentUpdate : handleMessageSubmit}>
                                            <div className='form-group text-end'>
                                                <button type="submit" disabled={commentResponse.isLoading || updateCommentResponse.isLoading} className="btn btn-primary btn-sm">
                                                    {commentResponse.isLoading || updateCommentResponse.isLoading ? 'Loading...' : 'Save'}
                                                </button>
                                            </div>
                                            <div className="form-group">
                                                <ReactQuill theme="snow" name="message" value={message} onChange={value => setMessage(value)} />
                                            </div>
                                        </form>
                                        <Row className='mt-3' style={{ overflowY:'scroll', maxHeight:'250px' }}>
                                            {
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
                                                                        {comment?.user_id == user.id ? 
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
                                                ))
                                            }
                                        </Row>
                                    </Col>
                                    <Col md="4">
                                        <p style={{ fontSize: '16px' }} className='mb-0'><b>Assignee:</b></p>
                                        <div className="users" style={{ overflowY: 'scroll', maxHeight: '100px' }}>
                                            <ul>
                                                {data?.data?.users != '' ? data?.data?.users?.map?.((user, index) => (
                                                    <li>{user.name}</li>
                                                )) : ''}
                                            </ul>
                                        </div>
                                        <p style={{ fontSize: '16px' }} className='mb-0'><b>Task Duration:</b></p>
                                        <p>{data?.data?.task_duration}</p>
                                        <p style={{ fontSize: '16px' }} className='mb-0 mt-3'><b>Settings</b></p>
                                        <p className='p-1 mb-2 rounded' style={{ backgroundColor: '#e4e8ec' }}>Start Date: <b className='text-dark'>{data?.data?.started_at}</b></p>
                                        <p className='p-1 mb-2 rounded' style={{ backgroundColor: '#e4e8ec' }}>Due Date: <b className='text-dark'>{data?.data?.due_date}</b></p>
                                        <p className='p-1 mb-2 rounded' style={{ backgroundColor: '#e4e8ec' }}>Priority: <b className='text-dark'>{data?.data?.modified_priority}</b></p>
                                        <p style={{ fontSize: '16px' }} className='mb-0 mt-3'><b>Information</b></p>
                                        <Row className='p-1'>
                                            <Col md="6" style={{ borderRight: '1px solid #e4e8ec' }}>
                                                <p>Created By</p>
                                                <p>Created On</p>
                                                <p>Project</p>
                                            </Col>
                                            <Col md="6">
                                                <p>{data?.data?.created_by}</p>
                                                <p>{data?.data?.created_on}</p>
                                                <p>{data?.data?.project}</p>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            : <Spinner />}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="1"></Col>
            </Row>
        </>
    );
}

export default TaskView;