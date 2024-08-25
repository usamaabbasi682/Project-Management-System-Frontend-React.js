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
                        !tasks.isFetching ? tasks?.data?.data?.map?.((task) => {
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
                                            <Link to={`/projects/${id}/tasks/${task.id}`} title='Details'>
                                                <i className="fa fa-info text-c-blue m-r-15" style={{ fontSize: '12px' }} />
                                            </Link>
                                            <span className="project-badge" style={{ backgroundColor: task.priority_color, color: 'black' }}>{task.modified_priority}</span>
                                            <span className='text-muted'>
                                                <b>Today</b>
                                            </span>&nbsp;&nbsp;
                                            <Link className='text-warning' to="#">
                                                <b>Edit</b>
                                            </Link>
                                        </td>
                                    </tr>
                                </>
                            ) 
                        }): <tr> Loading... </tr>
                    }
                </tbody>
            </Table>
        </>
    );
}

export default Tasks;