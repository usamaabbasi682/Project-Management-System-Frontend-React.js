import { useCreateTaskMutation, useFindProjectQuery, useProjectFileUploadMutation, useTagOptionsQuery, useTasksQuery, useUserOptionsQuery } from 'features/pmsApi';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Tabs, Tab, Card,Table,Button,Collapse } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import '../../assets/css/style.css';
import Unit from 'views/common/Unit';
import '../../assets/css/fileStyle.css';
import { ErrorMessage, Form, Formik,Field } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import * as Yup from 'yup';
import useUserNotLogin from 'hooks/useUserNotLogin';
import Files from './Files';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Tasks from 'views/components/Tasks';
import Spinner from 'views/common/Spinner';
import Search from 'views/common/Search';

const View = () => {
    useUserNotLogin();
    const [search, setSearch] = useState('');
    const {id} = useParams();
    const { data, refetch } = useFindProjectQuery(id);
    const tasks = useTasksQuery({id:id,search:search});
    const [fileUpload, response] = useProjectFileUploadMutation();
    const users = useUserOptionsQuery();
    const tags = useTagOptionsQuery();
    const [createTask,taskResponse] = useCreateTaskMutation();
    const [isBasic, setIsBasic] = useState(false);
    const style = { width: `100%`, 'background': data?.data?.color};
    const projectBadgeColor = { backgroundColor: data?.data?.status_color };
    const projectBadgeTaskColor = { backgroundColor: data?.data?.status_color,fontSize:'10px' };
    const [error, setError] = useState(null);
    const animatedComponents = makeAnimated();
    const [estimateTime, setEstimateTime] = useState('time');
    const [esitmateTimeDisabled, setEsitmateTimeDisabled] = useState(true);
    const projectRef = useRef();
    const taskRef = useRef();
    
    const taskInitialValues = {
        title: '',
        priority: '',
        users: [],
        due_date: '',
        estimated_time: '',
        time_type: '',
        tags: [],
        attachments: [],
        description: '',
    };

    const priorityOptions = [
        { value: 'highest', label: 'Highest' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
        { value: 'lowest', label: 'Lowest' },
    ];

    const timeTypeOptions = [
        { value: 'days', label: 'Days', 'id': 'option-1' },
        { value: 'hours', label: 'Hours','id': 'option-2' },
    ];

    const handleFileValidation =  Yup.object({
        files: Yup.array()
            .of(
                Yup.mixed().required('File is required')
            )
            .required('At least one file is required')
            .min(1, 'At least one file is required')
    });

    const taskValidate = () => {
        const validate = Yup.object({
            title: Yup.string().required('Title is required'),
        });
        return validate;
    };

    const handleFileSubmit = async (values, formik) => {
        
        const files = values.files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append('documents[]', files[i]);
        }
    
        fileUpload({ id: id, files: formData });
        projectRef.current = formik;
    };

    const taskHandleSubmit = (values, formik) => {
        const formData = new FormData();
        formData.append('title', values.title);

        if (values.priority != '') 
        formData.append('priority', values.priority);
        
        if (values.due_date != '') 
        formData.append('due_date', values.due_date);
        
        if (values.estimated_time != '' && values.time_type != '') {
            formData.append('estimated_time', values.estimated_time);
            formData.append('time_type', values.time_type);
        }

        if (values.description != '') 
        formData.append('description', values.description);
        
        if (values.users.length > 0) {
            values.users.forEach((user) => {
                formData.append('users[]', user.value);
            });
        }
        if (values.tags.length > 0) {
            values.tags.forEach((tag) => {
                formData.append('tags[]', tag.value);
            });
        }
        if (values.attachments.length > 0) {
            for (let index = 0; index < values.attachments.length; index++) {
                const file = values.attachments[index];
                formData.append('attachments[]', file);
            }
        }

        createTask({ id: id, task: formData });
        taskRef.current = formik;
    };

    const generateColorFromName = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        // Convert hash to a color (e.g., hex format)
        const color = `#${(hash & 0x00FFFFFF).toString(16).padStart(6, '0')}`;
        return color;
    };

    useEffect(() => {
        if (response?.data?.success) {
            projectRef?.current?.setSubmitting(false);
            projectRef?.current?.resetForm();
            setError(null);
            refetch();
            toast.success("Files Uploaded Successfully", {position: "top-right",});
        } else {
            projectRef?.current?.setSubmitting(false);
            if (response?.data) {
                setError(response?.data);   
            }
        }
    }, [response.data]);

    useEffect(() => {
        if (taskResponse?.data?.success) {
            taskRef?.current?.setSubmitting(false);
            taskRef?.current?.resetForm();
            refetch();
            tasks.refetch();
            toast.success("Task Created Successfully", {position: "top-right",});
        } else {
            taskRef?.current?.setSubmitting(false);
        }
    }, [taskResponse.data]);

    return (
        <>
            <Row>
                <ToastContainer />
                <Col>
                    <h5>{`${data?.data?.name}'s`} Project Details</h5>
                    <hr />
                    <Tabs defaultActiveKey="summary">
                        <Tab eventKey="summary" title="Summary">
                            <Row>
                                <Col key={1} md={8}>
                                    <div className="progress" style={{ height: '7px' }}>
                                        <div className={`progress-bar`} role="progressbar" style={style} aria-valuenow={100} aria-valuemin="0" aria-valuemax="100"/>
                                    </div>
                                    <Card>
                                        <Card.Body>
                                            <h4 className="mb-4 f-w-700">{data?.data?.name.toUpperCase()}&nbsp;<span className='f-w-300 text-muted'>({data?.data?.prefix})</span> <span className="project-badge" style={projectBadgeColor}>{data?.data?.status_modified}</span></h4>
                                            <hr />
                                            <div className="row d-flex align-items-center mb-2">
                                                <div className="col-12">
                                                    <h5 className="f-w-700 d-flex align-items-center m-b-0 text-muted">
                                                        Project Overview:
                                                    </h5>
                                                    <p className="m-b-0 mt-2" dangerouslySetInnerHTML={{ __html: data?.data?.description ? data?.data?.description : 'N/A' }}></p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row mb-2">
                                                <div className="col-md-4">
                                                    <h6 className="f-w-700 m-b-0 text-muted">
                                                        Project Progress:
                                                    </h6>
                                                    <h6 className="text-center m-b-10">
                                                        <span className="text-muted" style={{ fontSize:'10px' }}>Percent: 25%</span>
                                                    </h6>
                                                    <div className="progress"  style={{ height: '7px' }}>
                                                        <div
                                                            className="progress-bar progress-c-theme"
                                                            role="progressbar" style={{ width: '50%', height: '6px' }}
                                                            aria-valuenow="20" aria-valuemin="0"
                                                            aria-valuemax="100" 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <h6 className="f-w-700 m-b-0 text-muted">
                                                        Created On:
                                                    </h6>
                                                    <p className="m-b-0 mt-3">{data?.data?.creation}</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <h6 className="f-w-700 m-b-0 text-muted">
                                                        Last Updated:
                                                    </h6>
                                                    <p className="m-b-0 mt-3">{data?.data?.last_modified}</p>
                                                </div>
                                            </div>
                                        </Card.Body>
                                        
                                    </Card>
                                    <Row>
                                        <Col key={2} md={6}>
                                            <Unit
                                                progressBarStyle={style}
                                                isObject={true}
                                                users={data?.data?.users}
                                                align='text-starts'/>
                                        </Col>
                                        <Col key={3} md={6}>
                                            <Unit
                                                progressBarStyle={style}
                                                iconClass={'fas fa-user-tie'}
                                                iconColor={data?.data?.client ? generateColorFromName(data?.data?.client) : ''}
                                                title={`Client , ID: ${data?.data?.client_id}`}
                                                subTitle={''}
                                                defaultSubTitle={''}
                                                subTitleValue={`Name: ${data?.data?.client}`} 
                                                defaultSubTitleValue ='0' />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col key={4} md={4}>
                                    <Unit
                                        progressBarStyle={{  }}
                                        iconClass={'fas fa-money-bill-alt'}
                                        iconColor={'#36b38c'}
                                        title={'Budget'}
                                        subTitle={data?.data?.currency}
                                        defaultSubTitle='Empty: '
                                        subTitleValue={data?.data?.budget} 
                                        defaultSubTitleValue ='0' />
                                    
                                    <Unit
                                        progressBarStyle={{  }}
                                        iconClass={'fas fa-money-check'}
                                        iconColor={'#0081d9'}
                                        title={'Budget Type'}
                                        // subTitle='' defaultSubTitle=''
                                        subTitleValue={data?.data?.budget_type}
                                        defaultSubTitleValue ={'N/A'} />
                                    
                                    <Unit
                                        progressBarStyle={{  }}
                                        iconClass={'fas fa-money-check'}
                                        iconColor={'#ffb856'}
                                        title={'Tasks'}
                                        // subTitle='' defaultSubTitle=''
                                        subTitleValue={'0/1 Pending Tasks'}
                                        defaultSubTitleValue ={'0'} />
                                </Col>
                            </Row>
                        </Tab>
                        <Tab eventKey="activity" title="Activity">
                            <Card className="Recent-Users widget-focus-lg">
                                <Card.Header>
                                    <Card.Title as="h5">Recent Activities</Card.Title>
                                </Card.Header>
                                <Card.Body className="px-0 py-2">
                                    <Table responsive hover className="recent-users">
                                        <tbody>
                                            <tr className="unread">
                                                <td>
                                                    <i className="fa fa-list-ul text-c-blue m-r-15" style={{ fontSize:'20px' }} />
                                                </td>
                                                <td>
                                                    <h6 className="mb-1 text-muted">Isabella Christensen</h6>
                                                    <p className="m-0">Lorem Ipsum is simply dummy text of…</p>
                                                </td>
                                                <td>1 day ago</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Tab>
                        <Tab eventKey="tasks" title="Tasks">
                            <Card style={{'box-shadow':'none'}}>
                                <Card.Header>
                                    <Row>
                                        <Col md={3} className='text-start'>
                                            <div className='form-group d-flex'>
                                                <Search search={search} setSearch={setSearch} />
                                                <span style={{ marginLeft: '6px', fontSize: '10px' }} className="mt-2">
                                                    {tasks.isFetching && search != '' ? <><div className="spinner-border text-info" style={{ width:'19px',height:'19px' }} role="status"></div></> : ''}
                                                </span>
                                            </div>
                                        </Col>
                                        <Col md={9} className='text-end'>
                                            <Button className='btn btn-sm btn-primary' onClick={() => setIsBasic(!isBasic)}>New Task</Button>
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Collapse in={isBasic}>
                                    <div id="basic-collapse">
                                        <Card.Body>
                                            <Card.Text>
                                                <Row>
                                                    <Col md={2}></Col>
                                                    <Col md={8}>
                                                        <Card className="Recent-Users widget-focus-lg">
                                                            <Card.Header>
                                                                <Card.Title as="h5">New Task</Card.Title>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <Formik initialValues={taskInitialValues} validationSchema={taskValidate()} onSubmit={taskHandleSubmit}>
                                                                    {
                                                                        formik => {
                                                                            return (
                                                                                <>
                                                                                    <Form>
                                                                                        <Row>
                                                                                            <Col md={6}>
                                                                                                <div className="form-group">
                                                                                                    <label htmlFor="title">
                                                                                                        Title<span className="text-danger"><b>*</b></span>
                                                                                                    </label>
                                                                                                    <Field type="text" className="form-control" name="title" placeholder="Enter task title" />
                                                                                                    <ErrorMessage name="title" component="small" className="text-danger" />
                                                                                                </div>
                                                                                            </Col>
                                                                                            <Col md={6}>
                                                                                                <label htmlFor="priority"> Priority </label>
                                                                                                <Field as="select" name="priority" className="form-select" style={{ fontSize: '14px', height: '42px' }}>
                                                                                                    <option value="">Select...</option>
                                                                                                    {priorityOptions.map?.((priority, i) => {
                                                                                                        return (
                                                                                                            <option key={i} value={priority.value}>
                                                                                                                {priority.label}
                                                                                                            </option>
                                                                                                        );
                                                                                                    }
                                                                                                    )}
                                                                                                </Field>
                                                                                            </Col>
                                                                                            <Col md={6} className="mt-3">
                                                                                                <div className="form-group">
                                                                                                    <label htmlFor="users">Assign To</label>
                                                                                                    <Select closeMenuOnSelect={false} name="users" isMulti components={animatedComponents}
                                                                                                        // defaultValue={[options[0]]}
                                                                                                        options={users?.data?.data}
                                                                                                        value={formik.values.users}
                                                                                                        onChange={(selectedOptions) => {
                                                                                                            formik.setFieldValue('users', selectedOptions);
                                                                                                        }}
                                                                                                    />
                                                                                                    <ErrorMessage name="users" component="small" className="text-danger" />
                                                                                                </div>
                                                                                            </Col>
                                                                                            <Col md={6} className="mt-3">
                                                                                                <label htmlFor="due_date"> Due Date </label>
                                                                                                <Field type="date" className="form-control" name="due_date" />
                                                                                            </Col>
                                                                                            <Col md={6} className="mt-3">
                                                                                                <Row>
                                                                                                    <Col md={6} className="pr-0">
                                                                                                        <label htmlFor="estimated_time"> Estimated Time </label>
                                                                                                        <Field type={estimateTime} disabled={esitmateTimeDisabled} className="form-control" placeholder="Number..." name="estimated_time" />
                                                                                                    </Col>
                                                                                                    <Col md={6} className="p-0">
                                                                                                        <div className="wrapper">
                                                                                                            {
                                                                                                                timeTypeOptions.map((option) => {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                            <Field type="radio" name="time_type" onChange={(e) => {
                                                                                                                                formik.setFieldValue('time_type', e.target.value);
                                                                                                                                formik.setFieldValue('estimated_time', '');
                                                                                                                                setEstimateTime(e.target.value == 'hours' ? 'time' : 'number');
                                                                                                                                setEsitmateTimeDisabled(false);
                                                                                                                            }} id={option.id} value={option.value} />
                                                                                                                            <label htmlFor={option.id} className={`option ${option.id}`}>
                                                                                                                                <div className="dot" />
                                                                                                                                <span>{ option.label}</span>
                                                                                                                            </label>
                                                                                                                        </>
                                                                                                                    );
                                                                                                                })
                                                                                                            }
                                                                                                        </div>
                                                                                                        <ErrorMessage name="time_type" component="small" className="text-danger" />
                                                                                                    </Col>
                                                                                                    <Col md={12} className="pr-0">
                                                                                                        <small>
                                                                                                            First Select (e.g. Days, Hours)
                                                                                                        </small>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            </Col>
                                                                                            <Col md={6} className="mt-3">
                                                                                                <div className="form-group">
                                                                                                    <label htmlFor="tags">Tags</label>
                                                                                                    <Select closeMenuOnSelect={false} name="tags" isMulti components={animatedComponents}
                                                                                                        // defaultValue={[options[0]]}
                                                                                                        options={tags?.data?.data}
                                                                                                        value={formik.values.tags}
                                                                                                        onChange={(selectedOptions) => {
                                                                                                            formik.setFieldValue('tags', selectedOptions);
                                                                                                        }}
                                                                                                    />
                                                                                                    <ErrorMessage name="tags" component="small" className="text-danger" />
                                                                                                </div>
                                                                                            </Col>
                                                                                            <Col md={6} className="mt-3">
                                                                                                <label htmlFor="attachments"> Attachments </label>
                                                                                                <Field type="file" value={undefined} multiple onChange={(e) => {
                                                                                                    formik.setFieldValue("attachments", e.target.files)
                                                                                                }} name="attachments" className="form-control" />
                                                                                            </Col>
                                                                                            <Col md={12} className="mt-3">
                                                                                                <label htmlFor="description">Description</label>
                                                                                                <ReactQuill theme="snow" className="form-control" name="description" value={formik.values.description} onChange={value => formik.setFieldValue('description', value)} />
                                                                                                <ErrorMessage name="description" component="small" className="text-danger" />
                                                                                            </Col>
                                                                                            <Col md={12} className="mt-3">
                                                                                                <button type="submit" disabled={formik.isSubmitting} className="btn btn-sm btn-primary">
                                                                                                    {taskResponse.isLoading ? 'Loading...' : 'Save'}
                                                                                                </button>
                                                                                                <button type='button' className='btn btn-secondary btn-sm' onClick={() => {
                                                                                                    formik.resetForm();
                                                                                                    setEsitmateTimeDisabled(true);
                                                                                                    setIsBasic(!isBasic);
                                                                                                }}>Cancel</button>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </Form>
                                                                                </>
                                                                            )
                                                                        }
                                                                    }
                                                                </Formik>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                    <Col md={2}></Col>
                                                </Row>
                                            </Card.Text>
                                        </Card.Body>
                                    </div>
                                </Collapse>
                            </Card>
                            {!tasks.isLoading ? <Tasks tasks={tasks} /> : <Spinner />}
                        </Tab>
                        <Tab eventKey="attachments" title="Attachments">
                            <Card className="Recent-Users widget-focus-lg">
                                <Card.Header>
                                    <Card.Title as="h5">Project Files</Card.Title>
                                </Card.Header>
                                <Card.Body className="px-0 py-2">
                                    <Formik initialValues={{ files:[] }} validationSchema={handleFileValidation} onSubmit={handleFileSubmit}>
                                        {
                                            formik => {
                                                return (
                                                    <>
                                                        <Form>
                                                            <div className="file-upload p-3">
                                                                <label htmlFor="fileInput"><b>Attachments:</b></label>
                                                                <input type="file" value={undefined} name="files" onChange={(e) => {
                                                                    const files = Array.from(e.target.files);
                                                                    setError(null);
                                                                    formik.setFieldValue('files', files);
                                                                }} multiple id="fileInput" />
                                                                <label htmlFor="fileInput" className="file-label">Choose Files</label>
                                                                <ErrorMessage name="files" component={'span'} className='text-danger' />
                                                                {error != null ? <span className='text-danger'>The file must be a file of type: pdf, doc, docx, jpg, jpeg, png, txt.</span> : ''}
                                                            </div>
                                                            <div className="text-end">
                                                                <Button disabled={formik.isSubmitting || response.isLoading} type="submit" className="btn btn-sm btn-primary">
                                                                    <i className="fa fa-upload" /> <span className="ml-2"><b>
                                                                        {response.isLoading? 'Uploading...' : 'Upload'}
                                                                    </b></span>
                                                                </Button>
                                                            </div>
                                                        </Form>
                                                    </>
                                                );
                                            }
                                        }
                                    </Formik>
                                </Card.Body>
                            </Card>
                            {
                                data?.data?.total_files > 0
                                    ? 
                                        <Card className="Recent-Users widget-focus-lg">
                                            <Card.Header>
                                                <Card.Title as="h5">Uploaded Files</Card.Title>
                                            </Card.Header>
                                        <Card.Body className="px-0 py-2">
                                        </Card.Body>
                                        <Files files={data?.data?.files} refetch={refetch} />
                                        </Card>
                                    : ''       
                            }
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </>
    );
};

export default View;
