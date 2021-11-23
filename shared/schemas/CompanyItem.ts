import * as Joi from 'joi'
import {AddressItem} from './AddressItem';

// Company Data Item
export const CompanyItem = Joi.object({
    company_name: Joi.string().required(),
    language: Joi.string().required(),
    uid: Joi.string(),
    person_name: Joi.string().required(),
    domicile_address: Joi.isSchema(AddressItem), //TODO: add required
    correspondence_address: Joi.isSchema(AddressItem), //TODO: add required
    phone: Joi.string().required(),
    email: Joi.string().required(),
    branch_structure: Joi.boolean().required(),
    document_upload_enabled: Joi.boolean().required(),
    documents: Joi.array(),
});
