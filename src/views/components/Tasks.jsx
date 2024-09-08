import { Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Avatar from "views/common/Avatar";
const Tasks = ({ tasks }) => {
    const { id } = useParams();
    return (
        <>
            <Table responsive hover className="recent-users" key={1}>
                <tbody>
                    {
                        !tasks.isLoading ? tasks?.data?.data?.map?.((task) => {
                            return (
                                <>
                                    <tr className="unread">
                                        <td>
                                            <input type="checkbox" className="form-check-input m-0 align-middle" />
                                        </td>
                                        <td>
                                            <h6 className="mb-1 text-muted">0 Minutes</h6>
                                            <p className="m-0 d-flex align-items-center">
                                                {task.title}
                                            </p>
                                            <div className="avatar-group">
                                                {task?.users != '' ? task?.users?.map?.((user, index) => (
                                                    <Avatar key={user.id} name={user.name} />
                                                )) : ''}
                                            </div>
                                        </td>
                                        <td className='text-end'>
                                            <span className="project-badge m-r-10" style={{ backgroundColor: task.priority_color, color: 'white' }}>{task.modified_priority}</span>
                                            <span className='text-muted m-r-10'>
                                                <b>{ task?.due_date }</b>
                                            </span>
                                            <Link to={`/projects/${id}/tasks/${task.id}`} className="m-r-10" title='Details'>
                                                <i className="fa fa-info text-c-blue" style={{ fontSize: '12px' }} />
                                            </Link>
                                            <Link to={`/projects/${id}/tasks/${task.id}/edit`} className='text-warning' title='Edit'>
                                                <i className="fa fa-edit text-c-warning" style={{ fontSize: '12px' }} />
                                            </Link>
                                        </td>
                                    </tr>
                                </>
                            ) 
                        }): ''
                    }
                </tbody>
            </Table>
        </>
    );
}

export default Tasks;