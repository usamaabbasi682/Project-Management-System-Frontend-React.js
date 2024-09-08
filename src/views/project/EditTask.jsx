import { useParams,Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useEditTaskMutation, useStatusOptionsQuery, useTagOptionsQuery, useUserOptionsQuery, useViewTaskQuery } from "features/pmsApi";
import { useEffect, useRef, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../assets/css/style.css';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import EditTaskFiles from "./EditTaskFiles";

const EditTask = () => {
    const { projectId, taskId } = useParams();
    const {data, refetch}= useViewTaskQuery({projectId, taskId});
    const animatedComponents = makeAnimated();
    const users = useUserOptionsQuery();
    const tags = useTagOptionsQuery();
    const statuses = useStatusOptionsQuery();
    const [estimateTime, setEstimateTime] = useState('time');
    const [esitmateTimeDisabled, setEsitmateTimeDisabled] = useState(true);
    const [editTask, taskResponse] = useEditTaskMutation();
    const taskRef = useRef('');

    const taskInitialValues = {
        title: data?.data?.title,
        priority: data?.data?.priority,
        users: data?.data?.users?.map?.(user => ({ value: user.id, label: user.name })),
        due_date: data?.data?.edit_due_date,
        estimated_time: data?.data?.estimated_time,
        time_type: data?.data?.estimate_time_type,
        tags: data?.data?.tags,
        attachments: [],
        description: data?.data?.description,
        status: data?.data?.status,
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

    const taskValidate = () => {
        const validate = Yup.object({
            title: Yup.string().required('Title is required'),
        });
        return validate;
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

        if (values.status != '')
        formData.append('status_id', values.status.value);

        editTask({ projectId: projectId, taskId:taskId, task: formData });
        taskRef.current = formik;
    };

    useEffect(() => {
        if (taskResponse?.data?.success) {
            taskRef.current.setSubmitting(false);
            refetch();
            toast.success("Task Updated Successfully", {position: "top-right",});
        }
    }, [taskResponse?.data?.success]);
    
    return (
        <>
            <Row>
                <ToastContainer />
                <Col md="1"></Col>
                <Col sm="10">
                    <Card className="Recent-Users widget-focus-lg">
                        <Card.Header className='d-flex justify-content-between'>
                            <Card.Title as="h5">Edit Task</Card.Title>
                            <Link to={`/projects/${projectId}`} className="btn btn-danger btn-sm">Back</Link>  
                        </Card.Header>
                        <Card.Body className="">
                            <Formik initialValues={taskInitialValues} validationSchema={taskValidate()} onSubmit={taskHandleSubmit} enableReinitialize={true}>
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
                                                                                            <span>{ option.label }</span>
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
                                                            <div className="form-group">
                                                                <label htmlFor="status">Status</label>
                                                                <Select closeMenuOnSelect={false} name="status" components={animatedComponents}
                                                                    // defaultValue={[options[0]]}
                                                                    options={statuses?.data?.data}
                                                                    value={formik.values.status}
                                                                    onChange={(selectedOptions) => {
                                                                        formik.setFieldValue('status', selectedOptions);
                                                                    }}
                                                                />
                                                                <ErrorMessage name="status" component="small" className="text-danger" />
                                                            </div>
                                                        </Col>
                                                        <Col md={6}></Col>
                                                        <Col md={6} className="mt-3">
                                                            <label htmlFor="attachments"> Attachments </label>
                                                            <Field type="file" value={undefined} multiple onChange={(e) => {
                                                                formik.setFieldValue("attachments", e.target.files)
                                                            }} name="attachments" className="form-control" />
                                                        </Col>
                                                        {data?.data?.files.length > 0 ? <EditTaskFiles files={data?.data?.files} refetch={refetch} /> : <p className='text-muted text-center p-3'>No attachments added yet</p>}
                                                        <Col md={12} className="mt-3">
                                                            <label htmlFor="description">Description</label>
                                                            <ReactQuill theme="snow" className="form-control" name="description" value={formik.values.description} onChange={value => formik.setFieldValue('description', value)} />
                                                            <ErrorMessage name="description" component="small" className="text-danger" />
                                                        </Col>
                                                        <Col md={12} className="mt-3">
                                                            <button type="submit" disabled={formik.isSubmitting} className="btn btn-sm btn-primary">
                                                                {taskResponse.isLoading ? 'Loading...' : 'Save'}
                                                            </button>
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
                <Col md="1"></Col>
            </Row>
        </>
    );
};

export default EditTask;