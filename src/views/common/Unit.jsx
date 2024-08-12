import { Card } from 'react-bootstrap';

const Unit = ({progressBarStyle, isObject=false, users, iconClass, iconColor, title, subTitle = '', defaultSubTitle = '', subTitleValue, defaultSubTitleValue = 'N/A',align='text-end' }) => {
    
    return (
        <>
            <div className="progress" style={{ height: '7px' }}>
                <div className={`progress-bar`}
                    role="progressbar"
                    style={progressBarStyle}
                    aria-valuenow={100}
                    aria-valuemin="0"
                    aria-valuemax="100" />
            </div>
            <Card className="card-social">
                <Card.Body className="border-bottom">
                    <div className="row align-items-center justify-content-center">
                        {iconClass != '' ? <div className="col-auto">
                            <i className={`${iconClass} fab f-36`} style={{ color:iconColor }}></i>
                        </div> : ''}
                        {
                            isObject == false ?
                            <>
                                <div className={`col ${align}`}>
                                    <h4>{ title }</h4>
                                    <h6 className="text-c-blue mb-0">
                                        {subTitle ? `${subTitle}: ` : `${defaultSubTitle}`}
                                        <span className="text-muted">
                                            {subTitleValue ? subTitleValue.toUpperCase() : defaultSubTitleValue}
                                        </span>
                                    </h6>
                                </div>    
                            </>
                                :
                                <div className={`col ${align}`} style={{ overflowY:'scroll', height: '300px'}}>
                                    <h4 className='text-primary' style={{ fontWeight:'bold' }}>Project Members ({users?.length})</h4>
                                    <hr/>
                                    {
                                        users?.map?.((user) => {
                                            return (
                                                <>
                                                    <h5 className='mb-0'>{user?.name} , <span style={{ fontSize:'12px',fontWeight:'bolder' }}>ID:{user?.id}</span></h5>
                                                    <h6 className="text-muted">
                                                        {user?.email ? `${user?.email}` : 'N/A'}
                                                    </h6>
                                                    <hr/>
                                                </>
                                            );
                                        })
                                    }
                                </div>
                        }
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

export default Unit;