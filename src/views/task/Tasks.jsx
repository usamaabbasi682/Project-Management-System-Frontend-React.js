import Spinner from "views/common/Spinner";
import { useProjectsOptionsQuery, useTaskBoardQuery, useTaskCommentsQuery, useUserOptionsQuery } from "features/pmsApi";
import useUserNotLogin from "hooks/useUserNotLogin";
import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import ModelButton from "views/components/model/ModelButton";
import Model from "views/components/model/Model";
import TaskFiles from "views/project/TaskFiles";
import CommentForm from "views/components/comment/CommentForm";
import Comment from "views/components/comment/Comments";
import { useParams } from "react-router-dom";

const Tasks = () => {
    useUserNotLogin(); 
    const animatedComponents = makeAnimated();
    const projectsOptions = useProjectsOptionsQuery();
    const [currentTask,setTask] = useState('');
    const [project, setProject] = useState('');
    const [user, setUser] = useState('');
    const { data, isLoading, isFetching, refetch } = useTaskBoardQuery({ project: project?.value, user: user?.value });
    const users = useUserOptionsQuery();
    console.log(data);
    
    const comments = useTaskCommentsQuery({ projectId: project?.value, taskId: currentTask });
    const [isEditing, setIsEditing] = useState(false);
    const [commentEditId, setCommentEditId] = useState('');
    const [message, setMessage] = useState('');
    const loginUser = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        if (projectsOptions.data) {
            setProject(projectsOptions.data.data[0]);
        }
    }, [projectsOptions.data]);
    
    return (
        <>
            <Card className="Recent-Users widget-focus-lg p-1">
                <Row className="p-3">
                    <Col md={3}>
                        <Card.Header className="d-flex justify-content-between border-bottom-0">
                            <Card.Title as="h5">Tasks Board</Card.Title>
                        </Card.Header>
                    </Col>
                    <Col md={3}>
                        <Card.Header className="text-center border-bottom-0">
                             {isFetching && project != '' ? <div className="spinner-border text-info" style={{ width:'19px',height:'19px' }} role="status"></div> : ''}
                        </Card.Header>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <Col md={6}>
                                <div className="form-group">
                                    <label htmlFor="projects">Projects</label>
                                    <Select closeMenuOnSelect={false} name="projects" components={animatedComponents}

                                        options={projectsOptions?.data?.data}
                                        value={project}
                                        onChange={(selectedOptions) => {
                                            setProject(selectedOptions);
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="form-group">
                                    <label htmlFor="users">Users</label>
                                    <Select closeMenuOnSelect={false} name="user" components={animatedComponents}
                                        // defaultValue={[options[0]]}
                                        options={users?.data?.data}
                                        value={user}
                                        onChange={(selectedOptions) => {
                                            setUser(selectedOptions);
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>    
            </Card>
            <Card className="Recent-Users widget-focus-lg">
                <Card.Body>
                    <Row className="d-flex flex-nowrap gap-3" style={{ overflowX: 'auto', height: '500px' }}>
                        {
                            !isLoading ?
                            data?.data?.map?.((taskBoard, index) => {
                                return (
                                    <>
                                        <Col md="3" className="bg-light p-2" key={index}>
                                            <h6 className="fw-bold text-secondary">{taskBoard?.name}</h6>
                                            <ul className="list-unstyled mt-4" style={{ overflowY: 'auto', height: '400px' }}>
                                                {
                                                    taskBoard?.tasks?.map?.((task, index) => {
                                                        return (
                                                            <li className="bg-white p-3 mb-4" key={index}>
                                                                <div>
                                                                    <ModelButton handleClick={() => { setTask(task?.id); setMessage(''); }} title={task?.title} id={`open_${task.id}`} className="border-0 p-0 bg-transparent text-dark" />
                                                                    <Model marginRight="10%" modelSize={'modal-xl'} id={`open_${task.id}`} title="Task Details">
                                                                         <Row>
                                                                            <Col md="8">
                                                                                <h4 className='text-muted pb-3'>{ task?.title}</h4>
                                                                                <p className='mb-0'><b>Description:</b></p>
                                                                                <hr className='m-0 mb-2 mt-1' />
                                                                                <p dangerouslySetInnerHTML={{ __html: task?.description }}></p>
                                                                                <p className='mb-0'><b>Attachments:</b></p>
                                                                                <hr className='m-0 mb-2 mt-1' />
                                                                                {task?.files.length > 0 ? <TaskFiles files={task?.files} refetch={refetch} /> : <p className='text-muted text-center p-3'>No attachments added yet</p>}
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
                                                                                    project={project?.value}
                                                                                    task={task?.id}
                                                                                    currentTaskId={currentTask}
                                                                                    displayQuill={false}
                                                                                />
                                                                                <Comment
                                                                                    comments={comments}
                                                                                    userId={loginUser?.id}
                                                                                    setMessage={setMessage}
                                                                                    setIsEditing={setIsEditing}
                                                                                    setCommentEditId={setCommentEditId}
                                                                                    project={project?.value}
                                                                                    task={task?.id}
                                                                                    />
                                                                            </Col>
                                                                              <Col md="4">
                                                                                <p style={{ fontSize: '16px' }} className='mb-0'><b>Assignee:</b></p>
                                                                                <div className="users" style={{ overflowY: 'scroll', maxHeight: '100px' }}>
                                                                                    <ul>
                                                                                        {task?.users != '' ? task?.users?.map?.((user, index) => (
                                                                                            <li>{user.name}</li>
                                                                                        )) : ''}
                                                                                    </ul>
                                                                                </div>
                                                                                <p style={{ fontSize: '16px' }} className='mb-0'><b>Task Duration:</b></p>
                                                                                <p>{task?.time_left}</p>
                                                                                <p style={{ fontSize: '16px' }} className='mb-0 mt-3'><b>Settings</b></p>
                                                                                <p className='p-1 mb-2 rounded' style={{ backgroundColor: '#e4e8ec' }}>Start Date: <b className='text-dark'>{task?.started_at}</b></p>
                                                                                <p className='p-1 mb-2 rounded' style={{ backgroundColor: '#e4e8ec' }}>Due Date: <b className='text-dark'>{task?.due_date}</b></p>
                                                                                <p className='p-1 mb-2 rounded' style={{ backgroundColor: '#e4e8ec' }}>Priority: <b className='text-dark'>{task?.modified_priority}</b></p>
                                                                                <p style={{ fontSize: '16px' }} className='mb-0 mt-3'><b>Information</b></p>
                                                                                <Row className='p-1'>
                                                                                    <Col md="6" style={{ borderRight: '1px solid #e4e8ec' }}>
                                                                                        <p>Created By</p>
                                                                                        <p>Created On</p>
                                                                                        <p>Project</p>
                                                                                    </Col>
                                                                                    <Col md="6">
                                                                                        <p>{task?.created_by}</p>
                                                                                        <p>{task?.created_on}</p>
                                                                                        <p>{task?.project}</p>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>
                                                                        </Row>
                                                                    </Model>
                                                                    <br/>
                                                                    <small className="text-muted">{task?.due_date}</small>
                                                                </div>
                                                                <div className="d-flex justify-content-between pt-2">
                                                                    <span>{task?.time_left}</span>
                                                                    <div>
                                                                        <span>
                                                                            <i className="fa fa-solid fa-paperclip"></i> {task?.files_count > 0 ? task?.files_count : '0'}
                                                                        </span>&nbsp;
                                                                        <span>
                                                                            <i className="fa fa-comment"></i> {task?.comments_count > 0 ? task?.comments_count : '0'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                        </Col>
                                    </>
                                );
                            }) : <Spinner/>
                        }
                    </Row>
                </Card.Body>
            </Card>

        </>
    )
}
export default Tasks;