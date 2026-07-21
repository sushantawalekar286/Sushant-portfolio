import Certificate from '../models/Certificate.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    return sendSuccess(res, 'Certificates retrieved successfully', certificates);
  } catch (error) {
    next(error);
  }
};

export const getCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return sendError(res, 'Certificate not found', null, 404);
    }
    return sendSuccess(res, 'Certificate retrieved successfully', cert);
  } catch (error) {
    next(error);
  }
};

export const createCertificate = async (req, res, next) => {
  const { name, issuer, issueDate, credentialLink, verifyButton } = req.body;

  try {
    let imageUrl = '/images/default-certificate.jpg';
    let imagePublicId = '';

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'portfolio/certificates');
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const cert = await Certificate.create({
      name,
      issuer,
      issueDate,
      credentialLink,
      image: imageUrl,
      imagePublicId,
      verifyButton: verifyButton === 'true' || verifyButton === true
    });

    return sendSuccess(res, 'Certificate created successfully', cert, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCertificate = async (req, res, next) => {
  const { id } = req.params;
  const { name, issuer, issueDate, credentialLink, verifyButton } = req.body;

  try {
    const cert = await Certificate.findById(id);
    if (!cert) {
      return sendError(res, 'Certificate not found', null, 404);
    }

    if (req.file) {
      if (cert.imagePublicId) {
        await deleteFromCloudinary(cert.imagePublicId);
      }
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'portfolio/certificates');
      cert.image = uploadResult.secure_url;
      cert.imagePublicId = uploadResult.public_id;
    }

    if (name !== undefined) cert.name = name;
    if (issuer !== undefined) cert.issuer = issuer;
    if (issueDate !== undefined) cert.issueDate = issueDate;
    if (credentialLink !== undefined) cert.credentialLink = credentialLink;
    if (verifyButton !== undefined) cert.verifyButton = verifyButton === 'true' || verifyButton === true;

    await cert.save();
    return sendSuccess(res, 'Certificate updated successfully', cert);
  } catch (error) {
    next(error);
  }
};

export const deleteCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return sendError(res, 'Certificate not found', null, 404);
    }

    if (cert.imagePublicId) {
      await deleteFromCloudinary(cert.imagePublicId);
    }

    await Certificate.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 'Certificate deleted successfully');
  } catch (error) {
    next(error);
  }
};
