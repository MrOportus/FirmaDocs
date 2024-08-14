// src/components/SignatureForm.js
import React, { useRef, useState } from 'react';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';


function SignatureForm() {
    const sigCanvas = useRef({});
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        agree: false,
    });
    const [formId, setFormId] = useState(null);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        try {
            const response = await axios.post(`https://firmadocs.onrender.com:5000/api/forms/create`, {
                ...formData,
                signature
            });
            console.log('Formulario enviado:', response.data);
            setFormId(response.data.formId); // Guarda el ID del formulario
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    };

    const handleDownloadPDF = async () => {
        if (!formId) {
            alert('Debe enviar el formulario antes de descargar el PDF.');
            return;
        }

        try {
            const response = await axios.get(`https://firmadocs.onrender.com:5000/api/forms/pdf/${formId}`, {
                responseType: 'blob', // Para manejar el PDF como un blob
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `formulario_${formId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error al descargar el PDF:', error);
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre:</label>
                    <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Apellido:</label>
                    <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="form-check mb-3">
                    <input type="checkbox" className="form-check-input" name="agree" checked={formData.agree} onChange={handleChange} />
                    <label className="form-check-label">
                        Acepto los términos y condiciones
                    </label>
                </div>
                <div className="mb-3" style={{ border: '1px solid #000', padding: '10px', backgroundColor: '#f8f9fa' }}>
                    <SignatureCanvas
                        ref={sigCanvas}
                        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                        backgroundColor="#ffffff"
                    />
                </div>
                <div className="d-flex">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => sigCanvas.current.clear()}>Limpiar Firma</button>
                    <button type="submit"  className="btn btn-primary">Enviar</button>
                    {formId && (
                        <button type="button" className="btn btn-success ms-2" onClick={handleDownloadPDF}>
                            Descargar PDF
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default SignatureForm;
