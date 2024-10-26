import { useTaskCommentsQuery, useViewTaskQuery } from 'features/pmsApi';
import { Row, Col, Card } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import TaskFiles from './TaskFiles';
import Spinner from 'views/common/Spinner';
import { useState } from 'react';
import Comment from 'views/components/comment/Comments';
import CommentForm from 'views/components/comment/CommentForm';

const TaskView = () => {
    const {projectId,taskId} = useParams();    
    const { data, refetch, isFetching } = useViewTaskQuery({ projectId: projectId, taskId: taskId });
    
    const comments = useTaskCommentsQuery({ projectId: projectId, taskId: taskId });
    const user = JSON.parse(localStorage.getItem('user'));
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [commentEditId, setCommentEditId] = useState('');

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
                                        <CommentForm
                                            isEditing={isEditing}
                                            setIsEditing={setIsEditing}
                                            commentEditId={commentEditId}
                                            setCommentEditId={setCommentEditId}
                                            message={message}
                                            setMessage={setMessage}
                                            comments={comments}
                                             displayQuill={true}
                                        />
                                        <Comment
                                            comments={comments}
                                            userId={user?.id}
                                            setMessage={setMessage}
                                            setIsEditing={setIsEditing}
                                            setCommentEditId={setCommentEditId}
                                        />
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