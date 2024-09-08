import React, { useEffect, useState } from 'react';
import Pdf from '../../assets/images/files/pdf.png';
import Doc from '../../assets/images/files/doc.png';
import Docx from '../../assets/images/files/docx.png';
import Jpg from '../../assets/images/files/jpg.png';
import Jpeg from '../../assets/images/files/jpeg.png';
import Png from '../../assets/images/files/png.png';
import Txt from '../../assets/images/files/txt.png';
import { useDeleteTaskFileMutation } from 'features/pmsApi';
import { useParams } from 'react-router-dom';

const EditTaskFiles = ({ files, refetch }) => {
    const [deleteTaskFile, { data, isLoading }] = useDeleteTaskFileMutation();
    const [activeFile, setActiveFile] = useState(null);
    const {projectId,taskId} = useParams();
    
    const deleteFile = (fileId) => {
        if (confirm('Are you sure you want to delete this file?')) {
            deleteTaskFile({ projectId: projectId, taskId: taskId, fileId: fileId });
            setActiveFile(fileId);
        }
    }

    useEffect(() => {
        if (data?.success) {
            refetch();
        }
    }, [data?.success]);
    
    return (
        <>
            <div className='row p-4'>
            {
                files?.map?.((file, index) => {
                    if (file.extension === 'pdf') {
                        return (
                            <div className='col-md-2 text-center mb-1 border border-top-0 border-bottom-0 p-3' key={index}>
                                <img src={Pdf} alt="pdf" style={{ width: '30px' }} />
                                <div className="text-center">
                                    <a href={file.url} download className='text-muted' target="_blank" style={{ fontSize: '12px' }}>
                                        <b>Download</b>
                                    </a> <br/>
                                    <button type='button' onClick={()=>{deleteFile(file.id)}} className='bg-light border-danger rounded mt-2'>
                                        {(isLoading && activeFile == file.id) ? <i class="fas fa-solid fa-spinner text-danger" style={{ fontSize:'16px',fontWeight:'bold' }}></i> : <i className='fas fa-trash text-danger'></i>}
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    else if (file.extension === 'doc') {
                        return (
                            <div className='col-md-2 text-center mb-1 border border-top-0 border-bottom-0 p-3' key={index}>
                                <img src={Doc} alt="pdf" style={{ width: '30px' }} />
                                <div className="text-center">
                                    <a href={file.url} className='text-muted'  target="_blank" style={{ fontSize: '12px' }}>
                                        <b>Download</b>
                                    </a><br/>
                                    <button type='button' onClick={()=>{deleteFile(file.id)}} className='bg-light border-danger rounded mt-2'>
                                        {isLoading && activeFile == file.id ? <i class="fas fa-solid fa-spinner text-danger" style={{ fontSize:'16px',fontWeight:'bold' }}></i> : <i className='fas fa-trash text-danger'></i>}
                                    </button>
                                </div>
                            </div>
                        );
                    } else if (file.extension === 'docx') {
                        return (
                            <div className='col-md-2 text-center mb-1 border border-top-0 border-bottom-0 p-3' key={index}>
                                <img src={Docx} alt="pdf" style={{ width: '30px' }} />
                                <div className="text-center">
                                    <a href={file.url} download className='text-muted'  target="_blank" style={{ fontSize: '12px' }}>
                                        <b>Download</b>
                                    </a><br/>
                                    <button type='button' onClick={()=>{deleteFile(file.id)}} className='bg-light border-danger rounded mt-2'>
                                        {isLoading && activeFile == file.id ? <i class="fas fa-solid fa-spinner text-danger" style={{ fontSize:'16px',fontWeight:'bold' }}></i> : <i className='fas fa-trash text-danger'></i>}
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    else if (file.extension === 'jpg') {
                        return (
                            <div className='col-md-2 text-center mb-1 border border-top-0 border-bottom-0 p-3' key={index}>
                                 <img src={Jpg} alt="pdf" style={{ width: '30px' }} />
                                <div className="text-center">
                                    <a href={file.url} download className='text-muted'  target="_blank" style={{ fontSize: '12px' }}>
                                        <b>Download</b>
                                    </a><br/>
                                    <button type='button' onClick={()=>{deleteFile(file.id)}} className='bg-light border-danger rounded mt-2'>
                                        {isLoading && activeFile == file.id ? <i class="fas fa-solid fa-spinner text-danger" style={{ fontSize:'16px',fontWeight:'bold' }}></i> : <i className='fas fa-trash text-danger'></i>}
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    else if (file.extension === 'jpeg') {
                        return (
                            <div className='col-md-2 text-center mb-1 border border-top-0 border-bottom-0 p-3' key={index}>
                                <img src={Jpeg} alt="pdf" style={{ width: '30px' }} />
                                <div className="text-center">
                                    <a href={file.url} download className='text-muted'  target="_blank" style={{ fontSize: '12px' }}>
                                        <b>Download</b>
                                    </a><br/>
                                    <button type='button' onClick={()=>{deleteFile(file.id)}} className='bg-light border-danger rounded mt-2'>
                                        {isLoading && activeFile == file.id ? <i class="fas fa-solid fa-spinner text-danger" style={{ fontSize:'16px',fontWeight:'bold' }}></i> : <i className='fas fa-trash text-danger'></i>}
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    else if (file.extension === 'png') {
                        return (
                            <div className='col-md-2 text-center mb-1 border border-top-0 border-bottom-0 p-3' key={index}>
                                <img src={Png} alt="pdf" style={{ width: '30px' }} />
                                <div className="text-center">
                                    <a href={file.url} download className='text-muted'  target="_blank" style={{ fontSize: '12px' }}>
                                        <b>Download</b>
                                    </a><br/>
                                    <button type='button' onClick={()=>{deleteFile(file.id)}} className='bg-light border-danger rounded mt-2'>
                                        {isLoading && activeFile == file.id ? <i class="fas fa-solid fa-spinner text-danger" style={{ fontSize:'16px',fontWeight:'bold' }}></i> : <i className='fas fa-trash text-danger'></i>}
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    else {
                        return (
                            <div className='col-md-2 text-center mb-1 border border-top-0 border-bottom-0 p-3' key={index}>
                                <img src={Txt} alt="pdf" style={{ width: '30px' }} />
                                <div className="text-center">
                                    <a href={file.url} download className='text-muted'  target="_blank" style={{ fontSize: '12px' }}>
                                        <b>Download</b>
                                    </a><br/>
                                    <button type='button' onClick={()=>{deleteFile(file.id)}} className='bg-light border-danger rounded mt-2'>
                                        {isLoading && activeFile == file.id ? <i class="fas fa-solid fa-spinner text-danger" style={{ fontSize:'16px',fontWeight:'bold' }}></i> : <i className='fas fa-trash text-danger'></i>}
                                    </button>
                                </div>
                            </div>
                        );
                    }
                })
            }
            </div>
        </>
    );
}

export default EditTaskFiles;