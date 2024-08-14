// src/controllers/formController.js
const Form = require('../models/Form');
const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.createForm = async (req, res) => {
    try {
        const { firstName, lastName, agree, signature } = req.body;

        const newForm = new Form({ firstName, lastName, agree, signature });
        await newForm.save();

        res.status(201).json({ message: 'Formulario guardado exitosamente', formId: newForm._id });
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar el formulario', error });
    }
};

exports.generatePDF = async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        const lorem = " Se deja expresa constancia, de acuerdo a lo establecido en el artículo 156 del Código del Trabajo y artículo 14 del Decreto 40  de la Ley 16.744 que, he recibido en forma gratuita un ejemplar del Reglamento Interno de Orden, Higiene y Seguridad de la empresa ASPRO SPA.";
        const lorem2 = "Declaro bajo mi firma haber recibido, leído y comprendido el presente Reglamento Interno de Orden, Higiene y Seguridad, del cual doy fe de conocer el contenido de éste y me hago responsable de su estricto cumplimiento en cada uno de sus artículos, no pudiendo alegar desconocimiento de su texto a contar de esta fecha."
        if (!form) {
            return res.status(404).json({ message: 'Formulario no encontrado' });
        }

        const doc = new PDFDocument();
        let buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(pdfData),
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename=formulario_${form._id}.pdf`,
            }).end(pdfData);
        });
        

        doc.text(lorem, {
        align: 'justify'
        });
        doc.text(lorem2, {
            align: 'justify'
            });
        doc.text(`Nombre: ${form.firstName}`);
        doc.text(`Apellido: ${form.lastName}`);
        doc.text(`Acepta términos: ${form.agree ? 'Sí' : 'No'}`);
        doc.text('Firma:');
        doc.image(form.signature, { fit: [250, 150], align:'center' });
        
        doc.end();
    } catch (error) {
        res.status(500).json({ message: 'Error al generar el PDF', error });
    }
};
